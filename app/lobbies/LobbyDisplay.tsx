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
  const [activeGameTooltipIndex, setActiveGameTooltipIndex] = useState<number | null>(null);

  return (
    <Suspense fallback={<Loading/>}>
    <ul className="grid w-full lg:text-xl mt-12 px-2">
  <a href="/" className="absolute top-0 left-0 underline text-blue-500 p-2">Back to home</a>
  
  {/* Header Row */}
  <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] items-stretch content-center items-center">
    <p className="border-2 text-center font-semibold">Game status:</p>
    <p className="border-2 text-center font-semibold">Lobby Code:</p>
    <p className="border-2 text-center font-semibold">Player Count:</p>
    <p className="border-2 text-center font-semibold">Action:</p>
  </div>
  
  {/* Data Rows */}
  {params.map((lobby, index) => (
    lobby.players.length <= 6 && (
      <div 
        key={index} 
        className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr] items-stretch items-center border-2"
      >
        <li className="p-4 border-r-2">
          {lobby.game_active ? <span className="text-red-500">🔴 Busy</span> : <span className="text-green-500">🟢 Ready</span>}
        </li>
        <li className="p-4 border-r-2">
          <span className="text-blue-500">{lobby.game_code}</span>
        </li>
        <li className="p-4 border-r-2">
          <span className="text-blue-500">{lobby.players.length}</span>
        </li>
        <li className="p-4 text-center border-r-2">
          {lobby.game_active ? (
            <div className="relative">
            <p className="text-red-500 w-fit mx-auto cursor-pointer" onMouseEnter={() => setActiveGameTooltipIndex(index)} onMouseLeave={() => setTimeout(() => setActiveGameTooltipIndex(null), 300)}>Unavailable</p>
            
            {activeGameTooltipIndex === index && <div className="absolute bg-gray-200 text-black border-r-2 border-yellow-300 rounded-xl p-2 text-sm text-left w-7/12 ">
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
