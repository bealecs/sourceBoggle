"use client"

import { useState } from "react";

export const StarterScreen = () => {
  const [name, setName] = useState<string>("");
  const [name2, setName2] = useState<string>("");

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name2) {
      console.log('Player name is required');
      return;
    }
  
    try {
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',  // Set the content type to 'text/plain'
        },
        body: name2,  // Send the player name as plain text
      });
  
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
  
      const result = await response.json();
      console.log(result);
  
    } catch (error) {
      console.error('Network error:', error);
    }
  };  

  return (
    <div className="w-full text-center">
      <h1 className="text-6xl">Start a new game of boggle</h1>
      <form
        action=""
        className="flex flex-col justify-center my-12 text-3xl border-4 rounded-xl p-8 w-fit mx-auto"
      >
        <label htmlFor="name" className="mt-4">
          Enter your name:
        </label>
        <input
          type="text"
          id="name"
          className="w-fit mx-auto text-black"
          value={name} onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <label htmlFor="game-code" className="mt-8">
          Enter Lobby Code:
        </label>
        <input
          type="text"
          id="game-code"
          className="w-fit mx-auto mb-8 text-black"
          autoComplete="off"
        />
        <button className="text-3xl border-4 rounded-xl p-4">Join lobby</button>
      </form>
      <h2 className='text-5xl'>OR</h2>
      <form onSubmit={handleCreateGame} className='flex flex-col w-fit mx-auto border-4 rounded-xl p-8 text-3xl my-12'>
        <label htmlFor='name2' className='mt-4'>Enter your name:</label>
        <input type="text" id='name2' className='mb-8 text-black' value={name2} onChange={(e) => setName2(e.target.value)} autoComplete="off"/>
      <button type="submit" className="text-3xl border-4 rounded-xl p-4">
        Create New Game
      </button>
      </form>
      
    </div>
  );
};
