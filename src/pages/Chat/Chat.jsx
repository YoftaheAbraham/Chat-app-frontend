import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import "./Chat.css"
import Socket from '../../socket/Socket';
const Chat = () => {
    const [data, loading, Error, getData] = useUser();
    const dataRedux = useSelector((item) => item.data)
    useEffect(() => {
        getData();
    }, [])
    return (
        <div style={{ minHeight: "100vh" }} className='chat-main-container flex bg-gray-300'>
            {data &&
                <>
                    <Socket>
                        <Sidebar dataRedux={dataRedux} />
                        <Outlet dataRedux={dataRedux} />
                    </Socket>
                </>
            }
        </div>
    )
}

export default Chat
