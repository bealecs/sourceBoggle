import { supabase } from "@/app/util/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { game_code } = await req.json();
    // Debugging log
    console.log("Game code received:", game_code);

    // Update the game status
    const { data, error } = await supabase
      .from("boggle_game")
      .update({ game_active: true })
      .eq("game_code", game_code)
      .select();

    // Check for errors
    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Return success response with updated data
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    // Catch and handle unexpected errors
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
