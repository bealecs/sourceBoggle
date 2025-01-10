import { supabase } from "@/app/util/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const gameCode = url.searchParams.get("game_code");
  
  try {
    const { data, error } = await supabase
      .from("boggle_game")
      .select()
      .eq("game_code", gameCode)
      .single();

    if (error) {
      console.log(error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
