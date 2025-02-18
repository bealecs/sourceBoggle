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

const GameLobby = ({ params }: { params: { code: string; name: string } }) => {
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
          .eq("current_game_lobby_code", params.code)
          .single()
      );

      const results = await Promise.all(playerDataPromises);

      // Prepare end screen data
      const updatedData = results
        .map(({ data, error }, index) => {
          if (error) {
            console.error(
              `Error fetching data for player ${playerList[index]}:`,
              error
            );
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
        {
          event: "*",
          schema: "public",
          table: "boggle_game",
          filter: `game_code=eq.${gameCode}`,
        },
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

  const validatePoints = (word: string) => {
    const wordLength = word.length;
    switch (wordLength) {
      case 3:
        return 1;
      case 4:
        return 2;
      case 5:
        return 3;
      case 6:
        return 4;
      case 7:
        return 5;
      case 8:
        return 6;
      case 9:
        return 7;
      case 10:
        return 8;
      case 11:
        return 9;
      case 12:
        return 10;
      case 13:
        return 11;
      case 14:
        return 12;
    }
  };

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
        <div className="flex justify-around overflow-auto">
          {endScreenData ? (
            endScreenData.map((player, index) => {
              return (
                <div key={index} className="my-12 p-4">
                  <ul>
                    <li>{player.player}</li>
                    <li>{player.points} Points</li>
                    <ul className="max-h-[40vh] min-h-[10vh] overflow-y-auto">
                      {player.words.map((word, index) => (
                        <li
                          key={index}
                          className="mr-4 my-2 border-2 rounded-xl p-1 pr-4"
                        >
                          {word}{" "}
                          <span className="text-yellow-300">
                            +{validatePoints(word)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ul>
                </div>
              );
            })
          ) : (
            <p>No data was found</p>
          )}
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
        <ActiveGame
          game_code={gameCode}
          players={gameData.players}
          currentPlayer={params.name}
        />
      ) : (
        <div className="text-center flex flex-col justify-around h-[50vh]">
          <a
            href="/"
            className="underline text-2xl italic font-semibold hover:cursor-pointer text-blue-500 absolute top-0 left-0 p-2"
          >
            Back to Home
          </a>
          <h1 className="text-white text-3xl font-semibold mt-12">
            Game Lobby:{" "}
            <span className="text-yellow-400">{gameData.game_code}</span>
          </h1>
          <ol className="text-3xl font-semibold">
            Players:
            {gameData.players.map((player, index) => (
              <li key={index} className="text-yellow-400 mt-4">
                {player}
              </li>
            ))}
          </ol>
          <StartGameButton
            game_code={gameData.game_code}
            onGameStart={handleGameStart}
          />
          {/* This section is used for if I want it to be only multiplayer. Currently I have it set to allow single player matches */}
          {/* {gameData.players.length >= 2 ? (
            <StartGameButton
              game_code={gameData.game_code}
              onGameStart={handleGameStart}
            />
          ) : (
            <p className="text-2xl text-red-500 font-semibold">
              You need atleast 2 players to start a game
            </p>
          )} */}
        </div>
      )}
    </div>
  );
};

export default GameLobby;
