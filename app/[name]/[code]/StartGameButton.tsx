"use client";

interface Props {
  game_code: number;
  onGameStart?: () => {};
}

export const StartGameButton = (props: Props) => {
  
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
  
        if(props.onGameStart) {
          props.onGameStart();
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
  
    };

  return <button className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold block mx-auto h-fit text-center p-4 rounded mt-12" onClick={(e) => startGame(e, props.game_code)}>Start Game</button>;
};
