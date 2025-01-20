"use client";

import { Suspense, useState } from "react";
import { Loading } from "../components/loading";

export interface Lobby {
  id: number;
  created_at: Date;
  winner: boolean;
  game_code: number;
  game_active: boolean;
  players: string[];
  letters: string[];
  public_lobby: boolean;  
}
export const LobbyDisplay = ({ params }: { params: Lobby[] }) => {
  const [activeGameTooltip, setActiveGameTooltip] = useState(false);

  return (
    <Suspense fallback={<Loading/>}>
    <ul className="grid w-full lg:text-xl mt-12 px-2">
  <a href="/" className="absolute top-0 left-0 underline text-blue-500 p-2">Back to home</a>
  
  {/* Header Row */}
  <div className="grid grid-cols-4 border-2">
    <p className="border-r-2 p-4">Game status:</p>
    <p className="border-r-2 p-4">Lobby Code:</p>
    <p className="border-r-2 p-4">Player count:</p>
    <p className="p-4">Action:</p>
  </div>
  
  {/* Data Rows */}
  {params.map((lobby, index) => (
    lobby.players.length <= 6 && (
      <div 
        key={index} 
        className="grid grid-cols-4 items-center border-2"
      >
        <li className="p-4 border-r-2">
          {lobby.game_active ? <span className="text-red-500">🔴 Busy</span> : <span className="text-green-500">🟢 Joinable</span>}
        </li>
        <li className="p-4 border-r-2">
          <span className="text-blue-500">{lobby.game_code}</span>
        </li>
        <li className="p-4 border-r-2">
          <span className="text-blue-500">{lobby.players.length}</span>
        </li>
        <li className="p-4 text-center">
          {lobby.game_active ? (
            <div className="relative">
            <p className="text-red-500 w-fit mx-auto cursor-pointer" onMouseEnter={() => setActiveGameTooltip(true)} onMouseLeave={() => setTimeout(() => setActiveGameTooltip(false), 300)}>Active game</p>
            
            {activeGameTooltip && <div className="absolute bg-gray-200 text-black border-2 border-yellow-300 rounded-xl p-2 text-sm text-left lg:w-7/12 ">
              <p>This lobby is joinable, but the game is currently active. You must wait until the game finishes to join.</p>
            </div>}
            </div>
          ) : (
            <a href={`/${lobby.game_code}`} className="text-blue-500">Join Lobby</a>
          )}
        </li>
      </div>
    )
  ))}
</ul>

    </Suspense>
  );
};
