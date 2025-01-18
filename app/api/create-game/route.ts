import { NextResponse } from 'next/server';
import { supabase } from '../../util/supabaseClient';

export async function POST(req: Request) {
  try {
    const {name, lobbyVisibility} = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Player name is required' },
        { status: 400 }
      );
    }
  
    const randomLobbyCode = Math.floor(Math.random() * 999999);

    const { data, error } = await supabase
      .from('boggle_game')
      .insert([{ game_code: randomLobbyCode, players: [name], public_lobby: lobbyVisibility === "public" ? true : false}])
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
