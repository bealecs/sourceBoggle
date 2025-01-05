"use client";
import React, { useState, useEffect } from "react";

interface Player {
  letterCount: string[];
  wordCount: string[];
  currentPoints: number;
}

const BoggleBoard = () => {
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

  const [usedDice, setUsedDice] = useState([]);
  const [word, setWord] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(Math.floor(Math.random() * 200));
  const [timeLeft, setTimeLeft] = useState(210); // Initial time left is 210 seconds
  const [timerRunning, setTimerRunning] = useState(false); // State to track if timer is running
  const [boardLetters, setBoardLetters] = useState([]);
  const [boardRotations, setBoardRotations] = useState([]); // New state for storing rotations

  const rotations = [0, 90, 180, 270];

  // Function to start the timer
  const startTimer = () => {
    setTimerRunning(true);
    setTimeLeft(210); // Reset time left to 210 seconds
  };

  const getCurrentPlayer = () => {
    return {
      letterCount: ["H", "A", "T", "E"],
      wordCount: [],
      currentPoints: 0,
    };
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

  // Function to handle generating new board
  const generateBoard = () => {
    setUsedDice([]); // Reset used dice
    const newRotations = generateRandomRotations(); // Generate new rotations
    const newBoardLetters = Array.from({ length: 4 }, (_, rowIndex) =>
      Array.from({ length: 4 }, (_, colIndex) =>
        selectRandomLetter(rowIndex * 4 + colIndex)
      )
    );
    setBoardLetters(newBoardLetters);
    setBoardRotations(newRotations); // Store rotations in the state
    startTimer(); // Start the timer when generating new board
  };

  const checkWord = async (player: Player) => {
    const wordToCheck = player.letterCount.join(""); // Convert to string

    if (wordToCheck.length < 3) {
      console.log("You must have atleast 3 letters in your word!");
      return;
    }

    console.log("checking word", wordToCheck);
    try {
      const res = await fetch(
        `https://dictionaryapi.com/api/v3/references/collegiate/json/${wordToCheck}?key=b72e4758-4d38-4206-8ba9-245beaca916b`
      );
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      console.log(data);

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
        player.wordCount.push(wordToCheck);
        let wordLength = wordToCheck.length;
        switch (wordLength) {
          case 3:
            player.currentPoints += 1;
            console.log("Success! +1 point");
            break;
          case 4:
            player.currentPoints += 2;
            console.log("Success! +2 points");
            break;
          case 5:
            player.currentPoints += 3;
            console.log("Success! +3 points");
            break;
          case 6:
            player.currentPoints += 4;
            console.log("Success! +4 points");
            break;
          case 7:
            player.currentPoints += 5;
            console.log("Success! +5 points");
            break;
          case 8:
            player.currentPoints += 6;
            console.log("Success! +6 points");
            break;
          case 9:
            player.currentPoints += 7;
            console.log("Success! +7 points");
            break;
          case 10:
            player.currentPoints += 8;
            console.log("Success! +8 points");
            break;
          case 11:
            player.currentPoints += 9;
            console.log("Success! +9 points");
            break;
          case 12:
            player.currentPoints += 10;
            console.log("Success! +10 points");
            break;
          case 13:
            player.currentPoints += 11;
            console.log("Success! +11 points");
            break;
          case 14:
            player.currentPoints += 12;
            console.log("Success! +12 points");
            break;
          case 15:
            player.currentPoints += 13;
            console.log("Success! +13 points");
            break;
          case 16:
            player.currentPoints += 14;
            console.log("Success! +14 points");
            break;
          default:
            return;
        }
      } else if (!success) {
        console.log(
          "The given string was not found as a word according to Merriam Webster's dictionary"
        );
      }
    } catch (error) {
      console.error("Error checking word:", error);
    }
  };

  let fakePerson = {
    letterCount: ["C", "A", "T"],
    wordCount: ["", ""],
    currentPoints: Math.floor(Math.random() * 10),
  };
  const clickLetter = (event) => {
    setWord(event.target.value);
    //fake user player data for now, once DB is set up there will be a function to grab the current user's profile from the DB to push the letters to.
    addNewLetter(fakePerson);
    console.log(fakePerson.letterCount);
  };

  const addNewLetter = (player: Player) => {
    player.letterCount.push(word);
  };

  const endGame = () => {
    setTimeLeft(0);
  };
  // Effect to start the timer when timerRunning state changes
  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setInterval(() => {
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
    generateBoard(); // Initial generation of the board on component mount
  }, []); // Run this effect only once after the initial render

  const rows = boardLetters.map((row, rowIndex) => (
    <div key={rowIndex} className="flex">
      {row.map((letter, colIndex) => {
        const rotation = boardRotations[rowIndex * 4 + colIndex];
        return (
          <button
            key={colIndex}
            onClick={clickLetter}
            value={letter}
            className={`border border-gray-400 w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center rounded-xl m-1 shadow-lg bg-white text-black font-bold text-3xl p-2 transition duration-300 linear hover:bg-gray-400`}
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {letter}
          </button>
        );
      })}
    </div>
  ));

  return (
    <>
      {timeLeft <= 0 ? (
        <div className="h-screen items-center w-7/12 m-auto flex-column content-center">
          <h1 className="text-6xl text-center text-red-500 h-fit my-12">
            Game Over
          </h1>
          <button
            onClick={generateBoard}
            className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold block mx-auto w-fit text-center p-4 rounded"
          >
            Generate new board
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={endGame}
            className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold block mx-auto w-full text-center p-4 rounded"
          >
            End Game
          </button>
          <div className="bg-blue-500 w-fit mx-auto my-4 p-4">
            <p className="text-center my-2 text-white text-3xl font-semibold">
              Time Left: {timeLeft} seconds
            </p>
            {rows}
            <button
              onClick={() => checkWord(getCurrentPlayer())}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 text-2xl w-full rounded"
            >
              Check Word
            </button>
            <div className="text-center text-xl font-semibold">
              <p>Points:</p>
              <p>{points}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoggleBoard;
