import { supabase } from "@/app/util/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {game_code} = await req.json();
    const { data, error } = await supabase
      .from("boggle_game")
      .delete()
      .eq("game_code", game_code);

    if (error) {
        console.log(error)
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
