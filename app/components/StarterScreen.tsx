"use client"
import { useEffect, useState } from "react";
import { createPlayer } from "../api/join-game/createPlayer";
import { useRouter } from "next/navigation";
import { Loading } from "./loading";

export const StarterScreen = () => {
  const [name, setName] = useState<string>("");
  const [name2, setName2] = useState<string>("");
  const [gameCode, setGameCode] = useState<number>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lobbyVisibility, setLobbyVisibility] = useState<string>("public");
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          lobbyVisibility: lobbyVisibility,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
  
      const result = await response.json();
      console.log(result);

      if(isMounted) {
        console.log("Navigating to route...")
        router.push(`./${result.data[0].game_code}/${name}`);
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
        router.push(`./${result.data[0].game_code}/${name}`);
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
    return <Loading />
  }

  return (
    <div className="w-full mx-auto lg:flex lg:content-center lg:h-screen my-auto">
      <form onSubmit={(e) => handleCreateGame(e, name2)} className='flex flex-col w-11/12 lg:w-fit mx-auto border-4 rounded-xl p-4 lg:p-8 lg:text-3xl text-xl my-4 lg:h-fit content-center lg:my-auto'>
        <label htmlFor='name2' className='mt-4'>Enter your name:</label>
        <input type="text" id='name2' className='mb-8 text-black rounded p-1' value={name2} onChange={(e) => setName2(e.target.value)} autoComplete="off" required minLength={1}/>
        <label htmlFor="lobby-type">Lobby visibility:</label>
        <select name="lobby-type" id="lobby-type" className="text-black mb-8 p-4 rounded-xl" onChange={(e) => setLobbyVisibility(e.target.value)}>
          <option value={"public"}>🟢 Public</option>
          <option value={"private"}>🔴 Private</option>
        </select>
      <button type="submit" className="lg:text-3xl text-xl border-4 rounded-xl p-4">
        Create New Game
      </button>
      </form>
      <h2 className='lg:text-5xl text-2xl content-center text-center'>OR</h2>
      <form
        onSubmit={(e) => handleJoinGame(e, name, gameCode)}
        className="flex flex-col justify-center my-4 lg:text-3xl text-xl border-4 rounded-xl lg:p-8 p-4 w-11/12 lg:w-fit mx-auto lg:h-fit lg:my-auto"
      >
        <label htmlFor="name" className="mt-4">
          Enter your name:
        </label>
        <input
          type="text"
          id="name"
          className="text-black rounded p-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          required
          minLength={1}
        />
        <label htmlFor="game-code" className="mt-8">
          Enter Lobby Code:
        </label>
        <input
          type="number"
          id="game-code"
          className=" mb-8 text-black p-1 rounded"
          autoComplete="off"
          value={gameCode}
          onChange={(e) => setGameCode(parseInt(e.target.value))}
          required
          minLength={1}
        />
        <button className="lg:text-3xl text-xl border-4 rounded-xl p-4" type="submit">Join lobby</button>
        <a className="text-center my-4 underline text-blue-500 hover:cursor-pointer" href="/lobbies">View open lobbies</a>
        {errorMessage != null && <p className="my-4 text-red-500">{errorMessage}</p>}
      </form>
    </div>
  );
};
