"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../util/supabaseClient";
import { GameInformation } from "./GameInformation";

const ActiveGame = ({
  game_code,
  players,
  currentPlayer,
}: {
  game_code: number;
  players: string[];
  currentPlayer: string;
}) => {
  const dice = [
    ["R", "I", "F", "O", "B", "X"],
    ["I", "F", "E", "H", "E", "Y"],
    ["D", "E", "N", "O", "W", "S"],
    ["U", "T", "O", "K", "N", "D"],
    ["H", "M", "S", "R", "A", "O"],
    ["L", "U", "P", "E", "T", "S"],
    ["A", "C", "I", "T", "O", "A"],
    ["Y", "L", "G", "K", "U", "E"],
    ["Q", "B", "M", "J", "O", "A"],
    ["E", "H", "I", "S", "P", "N"],
    ["V", "E", "T", "I", "G", "N"],
    ["B", "A", "L", "I", "Y", "T"],
    ["E", "Z", "A", "V", "N", "D"],
    ["R", "A", "L", "E", "S", "C"],
    ["U", "W", "I", "L", "R", "G"],
    ["P", "A", "C", "E", "M", "D"],
  ];

  const [word, setWord] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(210); // Initial time left is 210 seconds
  const [timerRunning, setTimerRunning] = useState(false); // State to track if timer is running
  const [boardLetters, setBoardLetters] = useState([]);
  const [boardRotations, setBoardRotations] = useState([]); // New state for storing rotations
  const [isLoading, setIsLoading] = useState<boolean>();
  const [lastClicked, setLastClicked] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [clickedLetters, setClickedLetters] = useState<
    { row: number; col: number }[]
  >([]); // New state to track clicked letters
  const [gameInfoOpen, setGameInfoOpen] = useState<boolean>(false);
  const rotations = [0, 90, 180, 270];

  // Function to start the timer
  const startTimer = () => {
    setTimerRunning(true);
    setTimeLeft(210); // Reset time left to 210 seconds
  };

  // Function to select a random letter from a die and mark it as used
  const selectRandomLetter = (dieIndex) => {
    const die = dice[dieIndex];
    const randomIndex = Math.floor(Math.random() * die.length);
    const letter = die[randomIndex];
    return letter;
  };

  // Function to generate random rotations for the dice
  const generateRandomRotations = () => {
    return Array.from(
      { length: 16 },
      () => rotations[Math.floor(Math.random() * rotations.length)]
    );
  };

  const checkForLetterConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("boggle_game")
        .select("letters")
        .eq("game_code", game_code)
        .single(); // Use single() to get a single record

      if (error) {
        console.log("Error fetching letters:", error);
        return;
      }

      if (data && data.letters && data.letters.length > 0) {
        setBoardLetters(data.letters);
      } else {
        await generateBoard();
      }
    } catch (error) {
      console.log("Caught Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBoard = async () => {
    try {
      const newRotations = generateRandomRotations();
      const newBoardLetters = Array.from({ length: 4 }, (_, rowIndex) =>
        Array.from({ length: 4 }, (_, colIndex) =>
          selectRandomLetter(rowIndex * 4 + colIndex)
        )
      );

      const { error } = await supabase
        .from("boggle_game")
        .update({ letters: newBoardLetters })
        .eq("game_code", game_code);

      if (error) {
        console.log("Error updating letters:", error);
        return;
      }

      setBoardLetters(newBoardLetters);
      setBoardRotations(newRotations);
    } catch (error) {
      console.log("Error generating board:", error);
    }
  };

  const clickLetter = (event, row: number, col: number) => {
    if (lastClicked && lastClicked.col === col && lastClicked.row === row) {
      console.log("Clicking again");
      return;
    }

    if (lastClicked === null || isAdjacent(lastClicked, { row, col })) {
      setWord((prev) => {
        let updatedWord = prev + event.target.value;
        return updatedWord;
      });
      setLastClicked({ row, col });
      // Add the clicked letter to the clickedLetters array
      setClickedLetters((prev) => [...prev, { row, col }]); // Add the clicked letter's position to clickedLetters
    }
  };
  const isAdjacent = (
    lastPosition: { row: number; col: number },
    currentPosition: { row: number; col: number }
  ) => {
    const rowDiff = Math.abs(lastPosition.row - currentPosition.row);
    const colDiff = Math.abs(lastPosition.col - currentPosition.col);

    // Check if the current position is adjacent to the last clicked (including diagonals)
    return rowDiff <= 1 && colDiff <= 1;
  };

  const endGame = async () => {
    try {
      const finalPoints = points;
      const finalWordList = [...wordList];

      // First update game status
      const { data: gameData, error: gameError } = await supabase
        .from("boggle_game")
        .update({
          game_active: false,
          winner: true,
          letters: [],
        })
        .eq("game_code", game_code)
        .select();

      if (gameError) {
        console.error("Error updating game status:", gameError);
        return;
      }

      // Then update player details
      const { data: playerData, error: playerError } = await supabase
        .from("boggle_players")
        .update({
          current_points: finalPoints,
          word_count: finalWordList,
        })
        .eq("current_game_lobby_code", game_code)
        .eq("player_name", currentPlayer)
        .select();

      if (playerError) {
        console.error("Error updating player:", playerError);
        return;
      }

      console.log("Game successfully ended:", gameData);
      console.log("Player successfully updated:", playerData);

      setTimeLeft(0);
      setWord("");
      setPoints(0);
      setWordList([]);
    } catch (error) {
      console.error("Error in endGame:", error);
    }
  };

  const addWordToWordCount = async (paramWord: string) => {
    let wordLength = paramWord.length;
    let newPoints = points;

    // Calculate new points
    switch (wordLength) {
      case 3:
        newPoints += 1;
        alert("Well done, +1 point");
        break;
      case 4:
        newPoints += 2;
        alert("Well done, +2 points");
        break;
      case 5:
        newPoints += 3;
        alert("Well done, +3 points");
        break;
      case 6:
        newPoints += 4;
        alert("Well done, +4 points");
        break;
      case 7:
        newPoints += 5;
        alert("Well done, +5 points");
        break;
      case 8:
        newPoints += 6;
        alert("Well done, +6 points");
        break;
      case 9:
        newPoints += 7;
        alert("Well done, +7 points");
        break;
      case 10:
        newPoints += 8;
        alert("Well done, +8 points");
        break;
      case 11:
        newPoints += 9;
        alert("Well done, +9 points");
        break;
      case 12:
        newPoints += 10;
        alert("Well done, +10 points");
        break;
      case 13:
        newPoints += 11;
        alert("Well done, +11 points");
        break;
      case 14:
        newPoints += 12;
        alert("Well done, +12 points");
        break;
      case 15:
        newPoints += 13;
        alert("Well done, +13 points");
        break;
      case 16:
        newPoints += 14;
        alert("Well done, +14 points");
        break;
      default:
        return;
    }

    // Update state
    const updatedWordList = [...wordList, paramWord];
    setPoints(newPoints);
    setWordList(updatedWordList);

    // Update database with fresh values
    const { data, error } = await supabase
      .from("boggle_players")
      .update({
        current_points: newPoints,
        word_count: updatedWordList,
      })
      .eq("player_name", currentPlayer)
      .eq("current_game_lobby_code", game_code)
      .select();

    if (error) {
      console.log("Error received attempting to update player profile:", error);
    } else {
      console.log(data);
    }
  };

  const checkWord = async () => {
    if (word.length < 3) {
      alert("You must have atleast 3 letters in your word!");
      return;
    }
    if (wordList.includes(word)) {
      alert("Whoops, you have already gotten that word.");
      setLastClicked(null);
      setClickedLetters([]);
      setWord("");
      return;
    }
    console.log("checking word", word);
    try {
      const res = await fetch(
        `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.NEXT_PUBLIC_DICTIONARY_API}`
      );
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      //checks to make sure the given response is a valid word according to results from merriam webster's dictionary
      let success = false;
      data.map((dataEntry) => {
        if (
          dataEntry.fl === "verb" ||
          dataEntry.fl === "noun" ||
          dataEntry.fl === "adjective" ||
          dataEntry.fl === "adverb"
        ) {
          success = true;
        }
      });

      if (success) {
        addWordToWordCount(word);
      } else if (!success) {
        alert(
          "The given string was not found as a word according to Merriam Webster's dictionary"
        );
      }
    } catch (error) {
      console.error("Error checking word:", error);
    } finally {
      setWord("");
      setLastClicked(null);
      setClickedLetters([]);
    }
  };

  // Effect to start the timer when timerRunning state changes
  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(async () => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true);
      await checkForLetterConfig();
      startTimer();
    };
    initializeGame();
  }, [game_code]);

  useEffect(() => {
    if (timeLeft === 0 && !timerRunning) {
      endGame();
    }
  }, [timeLeft, timerRunning]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Loading game board...</p>
      </div>
    );
  }

  const rows = boardLetters.map((row, rowIndex) => (
    <div key={rowIndex} className="flex justify-center">
      {row.map((letter, colIndex) => {
        const rotation = boardRotations[rowIndex * 4 + colIndex];
        const isClicked = clickedLetters.some(
          (clicked) => clicked.row === rowIndex && clicked.col === colIndex
        );
        return (
          <button
            key={colIndex}
            onClick={(e) => clickLetter(e, rowIndex, colIndex)}
            value={letter}
            className={`border border-gray-400 w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center rounded-xl m-1 shadow-lg bg-white text-black font-bold text-3xl p-2 transition duration-300 linear hover:bg-gray-400`}
            style={{
              transform: `rotate(${rotation}deg)`,
              backgroundColor: isClicked ? "#FBBF24" : null,
            }}
          >
            {letter}
          </button>
        );
      })}
    </div>
  ));

  return (
    <div>
      <div className="flex-col lg:flex items-center justify-center">
        <div className="bg-blue-500 p-4 h-screen">
          <p className="text-center my-2 text-white text-3xl font-semibold text-yellow-300">
            Time Left: {timeLeft} seconds
          </p>
          <button
            className="w-fit mx-auto block font-semibold text-xl underline text-blue-900"
            onClick={() => setGameInfoOpen(true)}
          >
            View Game Information
          </button>
          <div className="my-8">{rows}</div>
          <h2 className="font-semibold text-2xl">Current Word:</h2>
          <p className="mb-8">{word.length > 0 ? word : "Nothing yet..."}</p>
          <h2 className="font-semibold text-2xl">My Points: {points}</h2>
          <button
            onClick={() => checkWord()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 text-2xl w-full rounded"
          >
            Check Word
          </button>
          <button
            onClick={() => {
              setLastClicked(null);
              setClickedLetters([]);
              setWord("");
            }}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold p-4 text-2xl w-full rounded"
          >
            Clear
          </button>
        </div>
        <GameInformation
          wordList={wordList}
          players={players}
          points={points}
          endGame={endGame}
          visible={gameInfoOpen}
          setVisibility={setGameInfoOpen}
        />
      </div>
    </div>
  );
};

export default ActiveGame;
