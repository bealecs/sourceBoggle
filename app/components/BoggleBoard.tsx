"use client";
import React, { useState, useEffect } from "react";

const BoggleBoard = () => {
  // Generate a 4x4 grid
  const alphabet = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ];

  // Function to generate a random letter
  const generateRandomLetter = () => {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  };

  // Initial state for the board letters
  const initialLetters = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => generateRandomLetter())
  );

  const [boardLetters, setBoardLetters] = useState(initialLetters);
  const [timeLeft, setTimeLeft] = useState(60); // Initial time left is 60 seconds
  const [timerRunning, setTimerRunning] = useState(false); // State to track if timer is running

  // Function to start the timer
  const startTimer = () => {
    setTimerRunning(true);
    setTimeLeft(60); // Reset time left to 60 seconds
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

  // Function to handle generating new board
  const handleClick = () => {
    setBoardLetters(Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => generateRandomLetter())
    ));
    startTimer(); // Start the timer when generating new board
  };

  const rows = boardLetters.map((row, rowIndex) => (
    <div key={rowIndex} className="flex">
      {row.map((letter, colIndex) => (
        <div
          key={colIndex}
          className="border border-gray-400 w-16 h-16 flex items-center justify-center"
        >
          <p>{letter}</p> {/* Display letter */}
        </div>
      ))}
    </div>
  ));

  return (
    <div className="w-64">
      {rows}
      <button onClick={handleClick}>Generate new board</button>
      <p>Time Left: {timeLeft} seconds</p>
    </div>
  );
};

export default BoggleBoard;
