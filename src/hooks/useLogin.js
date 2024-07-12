import { useState } from 'react'

const useLogin = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loginUser = (body) => {
        let timer
        setLoading(true)
        if (loading) {
            timer = setTimeout(() => {
                window.location.reload()
            }, 10000)
        }
        fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => {
            setLoading(false)
            if (data.status === "success") {
                window.clearTimeout(timer)
                localStorage.setItem("token", data.token)
                setData(data.data)
            } else {
                setError(data.message)
                setTimeout(() => {
                    setError(null)
                }, 3000)
            }
        }).catch(err => {
            setError(err.message)
        })
    }
    return [data, loading, error, loginUser]
}

export default useLogin
