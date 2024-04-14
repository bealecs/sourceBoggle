"use client";
import React, { useState } from "react";

const BoggleBoard = () => {
  // Generate a 3x3 grid
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const handleClick = () => {
    setCurrentLetter(alphabet[Math.floor(Math.random() * 26)])
  }
  const [currentLetter, setCurrentLetter] = useState("");
  const rows = Array.from({ length: 3 }, (_, rowIndex) => (
    <div key={rowIndex} className="flex">
      {Array.from({ length: 3 }, (_, colIndex) => (
        <div
          key={colIndex}
          className="border border-gray-400 w-16 h-16 flex items-center justify-center"
        >
          <p>{alphabet[Math.floor(Math.random() * 26)]}</p>
        </div>
      ))}
    </div>
  ));

  return (
    <div className="w-64">
      {rows}
      <button onClick={handleClick}>Generate new board</button>
    </div>
  );
};

export default BoggleBoard;
