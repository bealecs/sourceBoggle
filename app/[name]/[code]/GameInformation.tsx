import { Dispatch, SetStateAction } from "react";

interface GameDataProps {
    wordList: string[];
    players: string[];
    points: number;
    endGame: () => {};
    visible: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
}
export const GameInformation = ({ wordList, players, points, endGame, visible, setVisibility}: GameDataProps) => {
  return (
    <div className={`z-10 bg-black h-screen w-full ${visible ? "absolute" : "hidden"} content-center`}>      
        <div className="flex justify-between w-full lg:justify-around">
        {wordList.length > 0 && (
          <div>
            <h4 className="font-semibold text-2xl">Points: {points}</h4>
            <h4 className="font-semibold text-3xl my-8">Words:</h4>
            <ol className="flex w-full">
              {wordList.map((word, index) => (
                <li key={index} className="mr-8 mb-8">
                  {word}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-3xl my-8">Players:</h4>
          <ol className="flex w-full">
            {players.map((player, index) => (
              <li key={index} className="mr-8 mb-8">
                {player}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div>
      <button
          onClick={() => setVisibility(false)}
          className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold block mx-auto w-full h-fit text-center p-4 rounded"
        >
            Return to Game
        </button>
        <button
          onClick={() => endGame()}
          className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold block mx-auto w-full h-fit text-center p-4 rounded"
        >
          End Game
        </button>
      </div>
    </div>
  );
};
