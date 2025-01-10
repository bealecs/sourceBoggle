"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkWord } from "../util/checkWord";

interface Player {
  letterCount: string[];
  wordCount: string[];
  currentPoints: number;
}

const ActiveGame = ({
  game_code,
  players,
}: {
  game_code: number;
  players: string[];
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

  const [usedDice, setUsedDice] = useState([]);
  const [word, setWord] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(Math.floor(Math.random() * 200));
  const [timeLeft, setTimeLeft] = useState(210); // Initial time left is 210 seconds
  const [timerRunning, setTimerRunning] = useState(false); // State to track if timer is running
  const [boardLetters, setBoardLetters] = useState([]);
  const [boardRotations, setBoardRotations] = useState([]); // New state for storing rotations
  const router = useRouter();

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

  const clickLetter = (event) => {
    setWord((prev) => {
      let updatedWord = prev + event.target.value;
      console.log(updatedWord);
      return updatedWord;
    });
  };

  const endGame = () => {
    setTimeLeft(0);
  };

  const deleteGameLobby = async (e, game_code: number) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/delete-game", {
        method: "POST",
        body: JSON.stringify({ game_code }),
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error("There was an error deleting the current game lobby");
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
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
          <button
            onClick={(e) => deleteGameLobby(e, game_code)}
            className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold block mx-auto w-fit text-center p-4 rounded"
          >
            Delete game lobby
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center content-center">
            <div className="bg-blue-500 w-fit m-12 p-4">
              <p className="text-center my-2 text-white text-3xl font-semibold">
                Time Left: {timeLeft} seconds
              </p>
              {rows}
              <h2 className="font-semibold text-2xl">Current Word:</h2>
              <p>{word.length > 0 ? word : "Nothing yet..."}</p>
              <button
                onClick={() => checkWord(getCurrentPlayer())}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 text-2xl w-full rounded"
              >
                Check Word
              </button>
              <button
                onClick={() => setWord("")}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold p-4 text-2xl w-full rounded"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col w-3/12 mx-auto">
              <h4 className="font-semibold text-3xl text-center my-8">
                Players:
              </h4>
              <ol className="flex justify-around w-full">
                {players.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ol>
              <button
                onClick={(e) => deleteGameLobby(e, game_code)}
                className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold block mx-auto w-full text-center p-4 rounded mt-12"
              >
                Delete Lobby
              </button>

              <button
                onClick={endGame}
                className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold block mx-auto w-full text-center p-4 rounded"
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveGame;
