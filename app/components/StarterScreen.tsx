"use client"
import { useEffect, useState } from "react";
import { createPlayer } from "../api/join-game/createPlayer";
import { useRouter } from "next/navigation";

export const StarterScreen = () => {
  const [name, setName] = useState<string>("");
  const [name2, setName2] = useState<string>("");
  const [gameCode, setGameCode] = useState<number>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateGame = async (e, name: string) => {
    e.preventDefault();
    if (!name) {
      // console.log('Player name is required');
      return;
    }
  
    try {
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',  // Set the content type to 'text/plain'
        },
        body: name,  // Send the player name as plain text
      });
  
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
  
      const result = await response.json();
      console.log(result);

      if(isMounted) {
        console.log("Navigating to route...")
        router.push(`./${name}/${result.data[0].game_code}`);
      }

    } catch (error) {
      console.error('Network error:', error);
    }
    
  }; 

  const handleJoinGame = async (e, name: string, gameCode: number) => {
    e.preventDefault();
    if(!name) {
      // console.log("Player name required!")
      return;
    }

    try {
      const response = await fetch('/api/join-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify({
          playerName: name, 
          game_code: gameCode, 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
  
      const result = await response.json();
      console.log(result);
      createPlayer(name, gameCode);
      if(isMounted) {
        console.log("Navigating to route...")
        router.push(`./${name}/${result.data[0].game_code}`);
      }

    } catch (error) {
      console.log(error)
      setErrorMessage("There was an error joining the desired lobby. Please ensure you have the correct code.")
    }
    
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted) {
    return <div>One or more components failed to mount, please reload the page...</div>
  }

  return (
    <div className="w-3/12 mx-auto text-center">
      <h1 className="text-6xl">Start a new game of boggle</h1>
      <form
        onSubmit={(e) => handleJoinGame(e, name, gameCode)}
        className="flex flex-col justify-center my-12 text-3xl border-4 rounded-xl p-8 w-fit mx-auto"
      >
        <label htmlFor="name" className="mt-4">
          Enter your name:
        </label>
        <input
          type="text"
          id="name"
          className="w-fit mx-auto text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
        <label htmlFor="game-code" className="mt-8">
          Enter Lobby Code:
        </label>
        <input
          type="number"
          id="game-code"
          className="w-fit mx-auto mb-8 text-black"
          autoComplete="off"
          value={gameCode}
          onChange={(e) => setGameCode(parseInt(e.target.value))}
        />
        <button className="text-3xl border-4 rounded-xl p-4" type="submit">Join lobby</button>
        {errorMessage != null && <p className="my-4 text-red-500">{errorMessage}</p>}
      </form>
      <h2 className='text-5xl'>OR</h2>
      <form onSubmit={(e) => handleCreateGame(e, name2)} className='flex flex-col w-fit mx-auto border-4 rounded-xl p-8 text-3xl my-12'>
        <label htmlFor='name2' className='mt-4'>Enter your name:</label>
        <input type="text" id='name2' className='mb-8 text-black' value={name2} onChange={(e) => setName2(e.target.value)} autoComplete="off"/>
      <button type="submit" className="text-3xl border-4 rounded-xl p-4">
        Create New Game
      </button>
      </form>
      
    </div>
  );
};
