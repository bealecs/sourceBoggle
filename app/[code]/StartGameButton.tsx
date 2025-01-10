"use client";

export const StartGameButton = ({game_code} : {game_code: number}) => {
  
  const startGame = async (e, game_code: number) => {
    e.preventDefault();
      try {
        const response = await fetch("/api/start-game", {
          method: "POST",
          body: JSON.stringify({ game_code: game_code }),
          cache: 'no-cache'
        });

        if (!response.ok) {
          throw new Error("Failed to start game");
        }
  
        const result = await response.json();
  
        console.log(result);
      } catch (error) {
        console.log(error);
      }
  
      location.reload();
    };

  return <button onClick={(e) => startGame(e, game_code)}>Start Game</button>;
};
