import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [roomId, setroomId] = useState("");
    const [currentUser, setcurrentUser] = useState("");
    const [connected, setconnected] = useState(false);

    return (
        <ChatContext.Provider
            value={{
                roomId,
                currentUser,
                setroomId,
                setcurrentUser,
                connected,
                setconnected
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);
