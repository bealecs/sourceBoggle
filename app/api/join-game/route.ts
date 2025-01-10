import { NextResponse } from 'next/server';
import { supabase } from '../../util/supabaseClient';

export async function POST(req: Request) {
  try {
    // Ensure you're correctly parsing the JSON body
    const { playerName, game_code } = await req.json();

    const {data: existingPlayers, error: fetchError} = await supabase.from("boggle_game").select("players").eq("game_code", game_code).single();

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: fetchError.message },
        { status: 500 }
      );
    }
    
    const updatedPlayers = existingPlayers?.players || [];

    if (!playerName || !game_code) {
      return NextResponse.json(
        { success: false, error: 'Player name and game code are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('boggle_game')
      .update({ players: [...updatedPlayers, playerName] })
      .eq('game_code', game_code)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
