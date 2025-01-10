"use client"
import { useEffect, useState } from "react";
import ActiveGame from "./ActiveGame";
import { StartGameButton } from "./StartGameButton";

const GameLobby = ({ params }: { params: { code: string } }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameCode, setGameCode] = useState<number>(parseInt(params.code));

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/fetch-game?game_code=${gameCode}`, {
          method: "GET",
          cache: 'no-cache'
        })
        const result = await response.json();
        setData(result);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [gameCode]);

  if(loading) {
    return <div>Loading....</div>
  }

  return (
    <div>
      {data?.data?.game_active ? (
        <ActiveGame game_code={gameCode} players={data.data.players} />
      ) : (
        <div>
          <a href="/" className="underline text-2xl italic font-semibold hover:cursor-pointer">Home</a>
          <h1 className="text-white">Game Lobby: {gameCode}</h1>
          <ol>{data.data.players.map((player, index) => <li key={index}>{player}</li>)}</ol>
          {data.data.players.length >= 2 ? <StartGameButton game_code={gameCode} /> : <p>You need atleast 2 players to start a game</p>}
        </div>
      )}
    </div>
  );
};

export default GameLobby;