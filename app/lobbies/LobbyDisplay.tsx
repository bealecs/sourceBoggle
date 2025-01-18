"use client";

interface Lobby {
  id: number;
  created_at: Date;
  winner: boolean;
  game_code: number;
  game_active: boolean;
  players: string[];
  letters: string[];
  public_lobby: boolean;
}

interface Props {
  params: Lobby[];
}

export const LobbyDisplay = ({ params }: Props) => {
  return (
    <ul className="flex-col w-full text-xl">
      {params.map((lobby, index) => (
        <div key={index} className="flex content-center items-center justify-evenly my-8 border-2">
          <li className="border-x-2 p-4">
            Game status: <span className="text-blue-500">{lobby.game_active ? "🟢 Active" : "🔴 Waiting in lobby"}</span>
          </li>
          <li className="border-x-2 p-4">Lobby Code: <span className="text-blue-500">{lobby.game_code}</span></li>
          <li className="border-x-2 p-4">Player count: <span className="text-blue-500">{lobby.players.length}</span></li>
          {lobby.game_active ? <p className="text-red-400">Please wait for the current game to end</p> : <a href={`/${lobby.game_code}`} className="text-blue-500
          ">Join Lobby</a>}
        </div>
      ))}
    </ul>
  );
};
