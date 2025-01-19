"use client";

import { Suspense } from "react";
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

  return (
    <Suspense fallback={<Loading/>}>
    <ul className="flex-col w-full lg:text-xl mt-24 px-2">
      <a href="/" className="absolute top-0 left-0 underline text-blue-500 p-2">Back to home</a>
      {params.map((lobby, index) => (
        <div key={index} className="flex content-center items-center justify-evenly my-8 border-2">
          <li className="border-r-2 p-4 w-3/12">
            Game status:<span className="text-blue-500">{lobby.game_active ? "🔴 In progress" : "🟢 Joinable"}</span>
          </li>
          <li className="border-r-2 p-4 w-3/12">Lobby Code: <span className="text-blue-500">{lobby.game_code}</span></li>
          <li className="border-r-2 p-4 w-3/12">Player count: <span className="text-blue-500">{lobby.players.length}</span></li>
          {lobby.game_active ? <p className="text-red-400 w-3/12 text-center">Game currently active</p> : <a href={`/${lobby.game_code}`} className="text-blue-500 w-3/12 text-center">Join Lobby</a>}
        </div>
      ))}
    </ul>
    </Suspense>
  );
};
