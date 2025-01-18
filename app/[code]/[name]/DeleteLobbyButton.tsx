import { useRouter } from "next/navigation";

export const DeleteLobbyButton = ({game_code}:{game_code: number}) => {
    const router = useRouter();
    const deleteGameLobby = async(e) => {
        e.preventDefault();
        try {
          const response = await fetch("/api/delete-game", {
            method: "POST",
            body: JSON.stringify({ game_code }),
            cache: "no-cache",
          });
      
          if (!response.ok) {
            throw new Error("There was an error deleting the current game lobby");
          }
        } catch (error) {
          console.log(error);
        }
    }

  return (
    <button
      onClick={(e) => {
        router.push('/')
        deleteGameLobby(e)}}
      className="my-4 bg-red-500 hover:bg-red-700 text-white font-bold block mx-auto h-fit text-center p-4 rounded mt-12"
    >
      Delete Lobby
    </button>
  );
};
