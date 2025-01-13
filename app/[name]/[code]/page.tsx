"use client";
import { useEffect, useState } from "react";
import ActiveGame from "./ActiveGame";
import { StartGameButton } from "./StartGameButton";
import { supabase } from "../../util/supabaseClient";
import { DeleteLobbyButton } from "./DeleteLobbyButton";

interface Props {
  player: string;
  points: number;
  words: string[];
}

const GameLobby = ({ params }: { params: { code: string, name: string } }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameCode, setGameCode] = useState<number>(parseInt(params.code));
  const [endScreenData, setEndScreenData] = useState<Props[]>([]);

  const comparePlayersForVictory = async (playerList: string[]) => {
    try {
      // Fetch data for all players concurrently
      const playerDataPromises = playerList.map((playerName) =>
        supabase
          .from("boggle_players")
          .select("player_name, word_count, current_points")
          .eq("player_name", playerName)
          .single()
      );
  
      const results = await Promise.all(playerDataPromises);
  
      // Prepare end screen data
      const updatedData = results
        .map(({ data, error }, index) => {
          if (error) {
            console.error(`Error fetching data for player ${playerList[index]}:`, error);
            return null;
          }
          if (!data) {
            console.log(`No data found for player ${playerList[index]}`);
            return null;
          }
  
          return {
            player: data.player_name,
            points: data.current_points || 0,
            words: Array.isArray(data.word_count) ? data.word_count : [],
          };
        })
        .filter(Boolean); // Filter out null results
  
      setEndScreenData(updatedData);
    } catch (error) {
      console.error("Error comparing players for victory:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/fetch-game?game_code=${gameCode}`, {
        method: "GET",
        cache: "no-cache",
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscribedChanges = supabase
  .channel("custom-all-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "boggle_game" },
    (payload) => {
      console.log("Change received:", payload);
      fetchData(); // Fetch updated game data
      if (payload.eventType === "UPDATE" && payload.new.winner) {
        comparePlayersForVictory(payload.new.players); // Fetch players for end screen
      }
    }
  )
  .subscribe();
    
  fetchData();
    return () => {
      supabase.removeChannel(subscribedChanges);
    };
  }, [gameCode]);

  useEffect(() => {
    if (data?.data?.winner) {
      comparePlayersForVictory(data.data.players);
    }
  }, [data?.data?.winner, data?.data?.players]); // Only re-run if winner or players change

  if (loading) {
    return <div>Loading....</div>;
  }

  const gameData = data?.data;

  if (!gameData || gameData === null || gameData === undefined) {
    return (
      <div>
        This lobby seems to have been disbanded. Please{" "}
        <a href="/" className="underline italic font-semibold">
          return home
        </a>
      </div>
    );
  }

  const handleGameStart = async () => {
    await fetchData();
  };

    if (gameData.winner) {
    return (
      <div className="h-screen items-center w-7/12 m-auto flex-column content-center">
        <h1 className="text-6xl text-center text-red-500 h-fit my-12">
          Game Over
        </h1>
         <h2 className="text-center text-3xl font-semibold">Results:</h2>
         <div className="flex justify-around">
         {endScreenData ? endScreenData.map((player, index) => {
            return (<div key={index} className="my-12 max-h-[40vh] min-h-[10vh] p-4">
              <ul>
                <li>Player:{player.player}</li>
                {player.words.map((word, index) => <li key={index} className="mr-4 my-2">{word}</li>)}
                <li>Points Earned: {player.points}</li>
              </ul>
            </div>)
          }) : <p>No data was found</p>}
         </div>
          
        <div className="flex justify-around">
          <StartGameButton
            game_code={gameData.game_code}
            onGameStart={handleGameStart}
          />
          <DeleteLobbyButton game_code={gameCode} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {gameData.game_active ? (
        <ActiveGame game_code={gameCode} players={gameData.players} currentPlayer={params.name} />
      ) : (
        <div>
          <a
            href="/"
            className="underline text-2xl italic font-semibold hover:cursor-pointer"
          >
            Home
          </a>
          <h1 className="text-white">Game Lobby: {gameCode}</h1>
          <ol>
            {gameData.players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ol>
          {gameData.players.length >= 2 ? (
            <StartGameButton
              game_code={gameCode}
              onGameStart={handleGameStart}
            />
          ) : (
            <p>You need atleast 2 players to start a game</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameLobby;
