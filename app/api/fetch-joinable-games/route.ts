import { supabase } from "@/app/util/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const {data, error} = await supabase.from("boggle_game").select().eq("public_lobby", true);

    if(error) {
        console.log(error);
    }

    return NextResponse.json({success: true, error: error, status: 200, data})
}