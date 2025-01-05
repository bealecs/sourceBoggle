import { NextResponse } from 'next/server';
import { supabase } from '../../util/supabaseClient';

export async function POST(req: Request) {
  try {
    const playerName = await req.text();  // Read the body as plain text
    console.log('Received playerName:', playerName);

    if (!playerName) {
      return NextResponse.json(
        { success: false, error: 'Player name is required' },
        { status: 400 }
      );
    }

    const randomLobbyCode = Math.floor(Math.random() * 999999);

    const { data, error } = await supabase
      .from('boggle-game')
      .insert([{ game_code: randomLobbyCode, players: [playerName], game_active: true }])
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
