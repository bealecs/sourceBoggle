import { Suspense } from "react";
import { supabase } from "../util/supabaseClient";
import { LobbyDisplay } from "./LobbyDisplay";
import { Loading } from "../loader/loading";

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

export const PublicLobbies = async () => {
  const { data, error } = await supabase
    .from("boggle_game")
    .select()
    .eq("public_lobby", true);

  if (error) {
    throw new Error(
      "An error occured fetching the list of available lobbies. Please try again",
      error
    );
  }

  const params = Array.isArray(data) ? (data as Lobby[]) : [];

  return (
  <Suspense fallback={<Loading />}>
    <LobbyDisplay params={params} />
  </Suspense>)
};
