"use client";

import { useEffect, useState } from "react";
import { supabase } from "../util/supabaseClient";
import { Lobby, LobbyDisplay } from "./LobbyDisplay";
import { Loading } from "../components/loading";

export const PublicLobbies = () => {
  const [data, setData] = useState<Lobby[] | null>(null);

  useEffect(() => {
    const fetchUpdatedData = async () => {
      const { data, error } = await supabase
        .from("boggle_game")
        .select()
        .eq("public_lobby", true);

      if (!error) {
        setData(data);
      }
    };

    fetchUpdatedData();

    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "boggle_game",
          filter: `public_lobby=eq.${true}`,
        },
        () => fetchUpdatedData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  if(data === null) {
    return <Loading/>
  }

  return <LobbyDisplay params={data} />
};
