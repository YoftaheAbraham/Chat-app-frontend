import { useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setChats, setCurrentUser, setGroups } from '../redux/reducer';
const useUser = () => {
    const token = useSelector((item) => item.data.token);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const getUser = useCallback(() => {
        let timer
        setLoading(true)
        if (loading) {
            timer = setTimeout(() => {
                window.location.reload()
            }, 10000)
        }
        fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(res => res.json()).then(data => {
            if (data.status === "success") {
                window.clearTimeout(timer)
                dispatch(setCurrentUser(data.userData))
                data.chats.map((item) => {
                    dispatch(setChats(item))
                })
                data.joinedGroups.map((item) => {
                    dispatch(setGroups(item))
                })
                setData(data)
            } else {
                setError(data.message)
                setTimeout(() => {
                    setError(null)
                }, 3000)
                localStorage.setItem("token", "")
            }
        }).catch(err => {
            setError(err.message)
            localStorage.setItem("token", "")
        })
    }, [])
    return [data, loading, error, getUser]
}

export default useUser
