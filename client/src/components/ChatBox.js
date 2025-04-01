import React, { useState } from 'react';
import { sendMessage } from '../api';

export default function ChatBox({selectedBook}){
    const [message, setMessage] = useState('');
    const [response , setResponse] = useState('');

    const handleSend = async () =>{
        if(!selectedBook || !message) return;
        const res = await sendMessage(selectedBook, message);
        setResponse(res.data.response);
    }
    return(
        <div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask something..." />
            <button onClick={handleSend}>Send</button>
            <div>
                <strong>Response</strong>
                {response}
            </div>
        </div>
    )

}