"use client"
import { useState } from "react"

const PregameLobby = ({params} : {params: {game_code: number}}) => {
    const [name, setName] = useState<string>("");

    const handleSubmit = () => {

    }

    return (
        <div>
            <form action={handleSubmit}>
                <label htmlFor="name">Enter your name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <button>Enter game</button>
            </form>
        </div>
    )
}

export default PregameLobby;