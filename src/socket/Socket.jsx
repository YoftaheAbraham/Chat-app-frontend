import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
export const SocketContext = createContext();

const Socket = ({ children }) => {
    const dataRedux = useSelector(item => item.data)
    const socket = io("https://realtime-chat-app-server-0w28.onrender.com", {
        query: {
            user: JSON.stringify(dataRedux.currentUser)
        }
    });
    useEffect(() => {
        return () => socket.off();
    }, [socket]);
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default Socket
