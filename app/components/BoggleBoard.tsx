"use client";
import React, { useState, useEffect } from "react";

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
  const [timeLeft, setTimeLeft] = useState(180); // Initial time left is 180 seconds
  const [timerRunning, setTimerRunning] = useState(false); // State to track if timer is running
  const [boardLetters, setBoardLetters] = useState([]);

  // Function to start the timer
  const startTimer = () => {
    setTimerRunning(true);
    setTimeLeft(180); // Reset time left to 180 seconds
  };

  // Function to select a random letter from a die and mark it as used
  const selectRandomLetter = (dieIndex) => {
    const die = dice[dieIndex];
    const remainingLetters = die.filter((_, index) => !usedDice.includes(dieIndex * 6 + index));
    const randomIndex = Math.floor(Math.random() * remainingLetters.length);
    const letter = remainingLetters[randomIndex];
    console.log(`Getting letter ${letter} from die ${dieIndex} at index ${die.indexOf(letter)}`);
    setUsedDice([...usedDice, dieIndex * 6 + die.indexOf(letter)]);
    return letter;
  };

  // Function to handle generating new board
  const handleClick = () => {
    setUsedDice([]);
    const newBoardLetters = Array.from({ length: 4 }, (_, rowIndex) =>
      Array.from({ length: 4 }, (_, colIndex) => selectRandomLetter(rowIndex * 4 + colIndex))
    );
    setBoardLetters(newBoardLetters);
    startTimer(); // Start the timer when generating new board
  };

  // Effect to start the timer when timerRunning state changes
  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    handleClick(); // Initial generation of the board on component mount
  }, []); // Run this effect only once after the initial render

  const rows = boardLetters.map((row, rowIndex) => (
    <div key={rowIndex} className="flex">
      {row.map((letter, colIndex) => (
        <div
          key={colIndex}
          className="border border-gray-400 w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center rounded-xl m-1 shadow-lg bg-white text-black font-bold text-3xl p-2"
        >
          {letter} {/* Display letter */}
        </div>
      ))}
    </div>
  ));

  return (
    <div className="bg-blue-500 w-fit mx-auto my-4 p-4">
      <p className="text-center my-2 text-white">Time Left: {timeLeft} seconds</p>
      {rows}
      <button onClick={handleClick} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded">
        Generate new board
      </button>
    </div>
  );
};

export default BoggleBoard;
