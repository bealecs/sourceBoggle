import { supabase } from "@/app/util/supabaseClient"

export const createPlayer = async (name, gameCode) => {
    const {data, error} = await supabase.from("boggle_players").insert({player_name: name, current_game_lobby_code: gameCode}).select();

    if(error) {
        console.log("Error while creating new player:", error)
    }

    console.log(data);
}