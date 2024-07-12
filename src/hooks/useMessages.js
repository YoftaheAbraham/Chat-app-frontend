import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/reducer';
const useMessage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = useSelector((item) => item.data.token);
    const dispatch = useDispatch();
    const getMessages = async (id) => {
        setData(null)
        setError(null)
        setLoading(true);
        try {
            const response = await fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/conversation/getMessagePrivate/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const messages = await response.json();
            setLoading(false)
            if (messages.status == "success") {
                dispatch(setMessages(messages.messages))
                setData(messages)
            } else {
                setData(null)
                setError(data.message)
            }
            return messages
        } catch (error) {
            setError(error.message)
        }

    }

    return [data, loading, error, getMessages]
}

export default useMessage
