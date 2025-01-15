import { supabase } from "@/app/util/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { game_code } = await req.json();
    // Debugging log
    console.log("Game code received:", game_code);

    // Update the game status
    const { data: gameData, error: gameError } = await supabase
      .from("boggle_game")
      .update({ game_active: true , winner: false})
      .eq("game_code", game_code)
      .select();

    // Check for errors
    if (gameError) {
      console.error("Supabase error:", gameError.message);
      return NextResponse.json(
        { success: false, error: gameError.message },
        { status: 500 }
      );
    }

    const { data: playerData, error: playerError } = await supabase
      .from("boggle_players")
      .update({ "word_count": [] , "current_points": 0})
      .eq("current_game_lobby_code", game_code)
      .select();

    // Check for errors
    if (playerError) {
      console.error("Supabase error:", playerError.message);
      return NextResponse.json(
        { success: false, error: playerError.message },
        { status: 500 }
      );
    }
    // Return success response with updated data
    return NextResponse.json({ success: true, gameData, playerData }, { status: 200 });
  } catch (err) {
    // Catch and handle unexpected errors
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
