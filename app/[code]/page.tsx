"use client"
import { useEffect, useState } from "react"
import { createPlayer } from "../api/join-game/createPlayer";
import { useRouter } from "next/navigation";

const PregameLobby = ({params} : {params: {code: number}}) => {
    const [name, setName] = useState<string>("");
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
            if(!name) {
              return;
            }
        
            try {
              const response = await fetch('/api/join-game', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',  
                },
                body: JSON.stringify({
                  playerName: name, 
                  game_code: params.code, 
                }),
              });
          
              if (!response.ok) {
                throw new Error('Failed to create game');
              }
          
              const result = await response.json();
              console.log(result);
              createPlayer(name, params.code);
              if(isMounted) {
                console.log("Navigating to route...")
                router.push(`./${result.data[0].game_code}/${name}`);
              }
        
            } catch (error) {
              console.log(error)
            }
    }

    useEffect(() => {
        setIsMounted(true);
    }, [params.code])

    
    if(!isMounted) {
        return <div>Loading...</div>
    }

    return (
        <div className="w-fit mx-auto content-center h-screen text-3xl">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col justify-center items-center content-center border-2 p-4 lg:p-8 rounded-xl">
                <label htmlFor="name">Enter your name:</label>
                <input type="text" placeholder="Username..." className="text-black my-4 p-1 rounded" value={name} onChange={(e) => setName(e.target.value)} required minLength={1}/>
                <button type="submit" className="border-2 my-4 p-4 rounded-xl">Enter game</button>
            </form>
        </div>
    )
}

export default PregameLobby;