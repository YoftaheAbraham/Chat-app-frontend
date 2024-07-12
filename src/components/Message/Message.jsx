import { useNavigate, useParams } from "react-router-dom"
import "./Message.css"
import { useContext, useEffect, useRef, useState } from "react";
import useMessage from "../../hooks/useMessages";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext } from "../../socket/Socket";
import { removeNotifications, setChats, setMessages, setMessagesRealTime } from "../../redux/reducer";
import Loader from "react-loading";
const Message = () => {
    const socket = useContext(SocketContext)
    const { id } = useParams();
    const dataRedux = useSelector((item) => item.data);
    const [msgs, setMsgs] = useState();
    const [data, loading, Error, getMessages] = useMessage();
    const chatContainer = useRef(null)
    const [msgTxt, setMsgTxt] = useState("");
    const navigate = useNavigate();
    const [messageSent, setMessageSent] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        getMessages(id).then((res) => {
            if (!res.user) {
                navigate("/")
            }
            dispatch(setMessages(res.messages))
            dispatch(setChats(res.user))
            dispatch(removeNotifications(id))
            setMsgs(res.messages)
            setTimeout(() => {
                chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            }, 0)
        })
    }, [id, messageSent])

    useEffect(() => {
        socket.on("get-message-private", (data) => {
            dispatch(setChats(data.chat))
            if (data.chat.userID == dataRedux.chattingUser.userID) {
                dispatch(setMessagesRealTime(data.messageData))
            }
            dispatch(removeNotifications(dataRedux.chattingUser))
            setTimeout(() => {
                chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            }, 0)
        })
        if (!dataRedux.chattingUser) {
            navigate("/")
        }
    }, [id, messageSent, socket, dataRedux, navigate, dispatch]);
    const sendMessage = (event) => {
        event.preventDefault();
        if (msgTxt || msgTxt != "" || dataRedux.chattingUser) {

            socket.emit("send-message-private", {
                senderID: dataRedux.currentUser.userID,
                receiverID: dataRedux.chattingUser.userID,
                message: msgTxt
            })
            setMsgTxt("")
            if (!msgs || dataRedux.messages.length == 0 || msgs.length == 0) {
                navigate("/")
            }
            dispatch(setMessagesRealTime({
                createdAt: Date.now(),
                message: msgTxt,
                isMyMessage: true
            }))
            dispatch(setChats(dataRedux.chattingUser))
            setTimeout(() => {
                chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            }, 0)
            dispatch(removeNotifications(id))
        }
    }

    return (
        <div className='container border-l border-white flex-1 flex flex-col bg-gray-700'>
            <div className="topper border-b flex gap-2 items-center border-slate-500 bg-slate-800 p-4 ">
                <img src={dataRedux.chattingUser && dataRedux.chattingUser.profile_picture} alt="" className="w-10 h-10 rounded-full" />
                <div className="info flex flex-col">
                    <p className="text-white font-bold">{dataRedux.chattingUser && dataRedux.chattingUser.full_name}</p>
                    {dataRedux.chattingUser && dataRedux.onlineUsers.includes(dataRedux.chattingUser._id) ? <p className="text-cyan-500 text-sm">online</p> : <p className="text-slate-500 text-sm">offline</p>}

                </div>
                <i onClick={() => chatContainer.current.scrollTop = chatContainer.current.scrollHeight} className="fa-solid cursor-pointer fa-chevron-down absolute top-2 right-2 p-2 bg-gray-700 rounded-full text-white"></i>

            </div>
            <div ref={chatContainer} className="chat-body relative p-2 flex flex-col flex-1 bg-slate-800" style={{ overflowY: "scroll", overflowX: "auto" }}>
                {/* {`${data}`} */}
                {loading &&
                    <div className="flex justify-center">
                        <Loader name="spokes" color="rgb(51, 65, 85)" />
                    </div>
                }
                {msgs && dataRedux.messages.length == 0 && <h1 className="text-center text-slate-400"><span className="text-3xl">😊</span><br />Please send a message to start conversation</h1>}
                {msgs && dataRedux.messages.map((item, index) => {
                    if (item.isMyMessage) {
                        return <div key={index} className="chat msg rounded-2xl" style={{ maxWidth: "80%", alignSelf: "flex-end" }}>
                            <p className=" text-slate-400 text-end px-1">You</p>
                            <div className="data flex p-1 gap-1">
                                <div className="rounded p-2" style={{ background: 'linear-gradient(45deg,rgba(128, 0, 128, 0.295), rgba(13, 172, 172, 0.329))' }}>
                                    {item.message.split("\n").map((line, index) => {
                                        return <p className="text-white text-sm" key={index}>{line}</p>
                                    })}
                                    <p className="text-slate-400 text-end" style={{ fontSize: '10px' }}>{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-700 flex justify-center items-center min-w-8 h-8 rounded-full">
                                    <img src={dataRedux.currentUser.profile_picture} alt="" className="w-7 h-7 rounded-full" />
                                </div>
                            </div>
                        </div>
                    } else {
                        return <div key={index} className="msg rounded-2xl" style={{ maxWidth: "80%", alignSelf: "start" }}>
                            <p className=" text-slate-400 px-1">{dataRedux.chattingUser && dataRedux.chattingUser.username}</p>
                            <div className="data flex p-1 gap-1">
                                <div className="bg-slate-700 flex justify-center items-center min-w-8 h-8 rounded-full">
                                    <img src={dataRedux.chattingUser.profile_picture} alt="" className="w-7 h-7 rounded-full" />
                                </div>
                                <div className="rounded p-2 bg-slate-700">
                                    {item.message.split("\n").map((line, index) => {
                                        return <p className="text-white text-sm" key={index}>{line}</p>
                                    })}
                                    <p className="text-slate-400 text-end" style={{ fontSize: '10px' }}>{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                        </div>
                    }
                })}

            </div>
            <form onSubmit={sendMessage} className="bottom border border-slate-500 bg-slate-800">
                <div className="flex items-center justify-center h-full w-full">
                    <textarea value={msgTxt} required type="text" onChange={e => setMsgTxt(e.target.value)} placeholder="Write something..." className="noScroll-view text-slate-200 resize-none bg-slate-700 text-sm p-2 rounded-2xl m-1 flex-1 outline-none border-slate-500"></textarea>
                    <button type="submit" className="cursor-pointer">
                        <i className="fa-regular fa-paper-plane text-slate-200 mx-3"></i>
                    </button>
                </div>
            </form>
        </div >
    )
}

export default Message
