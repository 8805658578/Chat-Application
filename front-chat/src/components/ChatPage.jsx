import React, { useState, useRef, useEffect } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { baseURL } from "../config/AxiosHelper";
import { BiEqualizer } from "react-icons/bi";

const ChatPage = () => {

    const { roomId, currentUser, connected } = useChatContext();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const stompClientRef = useRef(null);
    const chatBoxRef = useRef(null);

    //message load 

    useEffect(() => {
        async function loadMessages() {
            try {
                const response = await fetch(`${baseURL}/api/v1/rooms/${roomId}/messages`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Error loading messages:", error);
            }   
        }
        if (roomId) {
            loadMessages();
        }    
    }, [roomId]);
    


    //scroll Down 
    useEffect(()=>{



        if(chatBoxRef.current){

            chatBoxRef.current.scroll({
                top:chatBoxRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    },[messages]);


    // Redirect if not connected
    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [connected, navigate]);

    // Connect WebSocket
    useEffect(() => {

        if (!roomId) return;

        const socket = new SockJS(`${baseURL}/chat`);

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("WebSocket Connected");

                // Subscribe to room topic
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, receivedMessage]);
                });
            },

            onStompError: (error) => {
                console.error("Broker error:", error);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };

    }, [roomId]);

    // Send Message
    const sendMessage = () => {

        if (!input.trim()) return;
        if (!stompClientRef.current) return;

        const chatMessage = {
            sender: currentUser,
            content: input,
            roomId: roomId
        };

        stompClientRef.current.publish({
            destination: `/app/sendMessage/${roomId}`,
            body: JSON.stringify(chatMessage)
        });

        setInput("");
    };

    return (
        <div className="h-screen flex flex-col">

            {/* Header */}
            <header className="border flex justify-between m-5 rounded p-5 dark:bg-gray-900">
                <h1 className="text-xl font-semibold">
                    Room: <span>{roomId}</span>
                </h1>

                <h1 className="text-xl font-semibold">
                    User: {currentUser}
                </h1>

                <button
                    onClick={() => navigate("/")}
                    className="bg-red-500 hover:bg-red-700 px-3 py-2 rounded-full text-white"
                >
                    Leave Room
                </button>
            </header>

            {/* Messages */}
            <main ref={chatBoxRef} className="flex-1 p-5 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.sender === currentUser ? "justify-end" : "justify-start"} mb-2`}
                    >
                        <div
                            className={`p-3 rounded max-w-xs ${
                                msg.sender === currentUser
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 text-black"
                            }`}
                        >
                            <p className="font-semibold">{msg.sender}</p>
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
            </main>

            {/* Input */}
            <div className="p-5 border-t">
                <div className="flex gap-3">

                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-2 rounded-full border border-gray-600 dark:bg-gray-700"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-700 px-5 py-2 rounded-full text-white"
                    >
                        <MdSend size={20} />
                    </button>

                </div>
            </div>

        </div>
    );
};

export default ChatPage;
