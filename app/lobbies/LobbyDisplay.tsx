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
      <div className="flex">
        <p className="w-3/12 border-2 p-4">Game status:</p>
        <p className="w-3/12 border-2 p-4">Lobby Code: </p>
        <p className="w-3/12 border-2 p-4">Player count:</p>
      </div>
      {params.map((lobby, index) => (
        lobby.players.length <= 6 &&
        <div key={index} className="flex content-center items-center justify-evenly">
          <li className="border-2 p-4 w-3/12">
            {lobby.game_active ? <span className="text-red-500">🔴 Busy</span> : <span className="text-green-500">🟢 Joinable</span>}
          </li>
          <li className="border-2 p-4 w-3/12"><span className="text-blue-500">{lobby.game_code}</span></li>
          <li className="border-2 p-4 w-3/12"><span className="text-blue-500">{lobby.players.length}</span></li>
          {lobby.game_active ? <p className="text-red-500 w-3/12 text-center border-2 p-4">Active game</p> : <a href={`/${lobby.game_code}`} className="text-blue-500 w-3/12 text-center border-2 p-4">Join Lobby</a>}
        </div>))}
    </ul>
    </Suspense>
  );
};
