import { useNavigate, useParams } from "react-router-dom"
import "./Message.css"
import { useContext, useEffect, useRef, useState } from "react";
import usePublicMessage from "../../hooks/usePublicMessages";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
import { SocketContext } from "../../socket/Socket";
import { setMessagesRealTime, setChattingGroup } from "../../redux/reducer";
import Loader from 'react-loading'


const GroupMessage = () => {
    const { id } = useParams();
    const dataRedux = useSelector((item) => item.data)
    const chattingGroup = useSelector((item) => item.data.chattingGroup);
    const dispatch = useDispatch()
    const socket = useContext(SocketContext);
    const [data, loading, Error, getMessages] = usePublicMessage();
    const [addMembersPopup, setAddMembersPopup] = useState(false);
    const [memberQuery, setMemberQuery] = useState(null);
    const [queriedUser, setQueriedUsers] = useState(null);
    const [messageSent, setMessageSent] = useState(0);
    const [msgTxt, setMsgTxt] = useState("");
    const chatContainer = useRef()
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("join_group", chattingGroup);
        socket.on("get-message-public", data => {
            dispatch(setMessagesRealTime(data.message))
            setTimeout(() => {
                chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            }, 0)
        })
    }, [socket, dataRedux, chattingGroup])

    useEffect(() => {
        let timer = setTimeout(() => {
            if (memberQuery) {
                fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/data/search?q=${memberQuery}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataRedux.token}`
                    }
                }).then(res => res.json()).then(data => {
                    if (data.status == "success") {
                        setQueriedUsers(data.users)
                    }
                })
            } else {
                setQueriedUsers(null)
            }
        }, 700);

        return () => clearTimeout(timer)
    }, [memberQuery])

    const sendMessage = (event) => {
        event.preventDefault();
        if (msgTxt || msgTxt != "") {
            socket.emit("send-message-public", {
                senderID: dataRedux.currentUser.userID,
                groupID: chattingGroup.groupID,
                message: msgTxt
            })
            dispatch(setMessagesRealTime({
                isMyMessage: true,
                message: msgTxt,
                createdAt: Date.now()
            }));
            setTimeout(() => {
                chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            }, 0)
            setMsgTxt("")
        }
    }
    const addMember = (userID) => {
        socket.emit("added-to-group", {
            groupID: chattingGroup.groupID,
            memberID: userID
        })
        navigate("/")
        setAddMembersPopup(false)
    }
    useEffect(() => {
        if (!chattingGroup) {
            navigate("/group")
        }
        getMessages(id).then((data) => {
            setChattingGroup(data.group)
            setTimeout(() => {
                chatContainer.current.scrollTop = chatContainer.current.scrollHeight
            }, 0)
        })
    }, [id, messageSent])
    return (<>

        {chattingGroup && <>

            <div className='container flex-1 flex flex-col bg-gray-700'>
                <Popup open={addMembersPopup} lockScroll onClose={() => {
                    setAddMembersPopup(false)
                }} overlayStyle={{ background: `rgba(0, 0, 0, 0.65)` }}>
                    <form onSubmit={e => e.preventDefault()} className="pop-up flex flex-col gap-1 border-white border bg-slate-900 p-1">
                        <h1 className="text-white text-center font-bold">Add Group Member</h1>
                        <div className="">
                            <label className="text-white">Full name or Username:</label><br />
                            <input onChange={e => setMemberQuery(e.target.value)} required placeholder="eg, john, john@gmail.com" className="p-1 min-w-72 bg-slate-950 outline-none rounded text-gray-500" type="text" />
                        </div>
                        <div className="max-h-56 bg-slate-950 p-2 flex flex-col overflow-y-scroll">
                            {queriedUser && queriedUser.map((data, index) => {
                                return <button type="button" className="" key={index} onClick={() => {
                                    addMember(data._id)
                                }}>
                                    <li className="flex items-center justify-between mb-2 p-2 rounded-md bg-gray-700 cursor-pointer hover:bg-gray-600">
                                        <div className="flex items-center justify-between flex-1">
                                            <div className="left flex items-center justify-center">
                                                <div className="flex flex-col">
                                                    <div className="relative">
                                                        <img
                                                            src={data.profile_picture}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                        <div className="w-2 h-2 bg-green-400 rounded-full absolute right-1 bottom-1"></div>
                                                    </div>
                                                </div>
                                                <div className="userInfo">
                                                    <h5 className="font-bold">{data.full_name}</h5>
                                                    <p className="text-sm text-gray-400 text-start">{data.username}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </li>
                                </button>
                            })}
                        </div>
                        <div className="controls gap-2 flex justify-between">
                            <button className="p-2 flex-1 text-white bg-slate-600" type="button" onClick={() => setAddMembersPopup(false)}>Cancel</button>
                        </div>
                    </form>
                </Popup>
                <div className="topper border-b flex justify-between items-center border-slate-500 bg-slate-800 p-4 ">
                    <div className="flex gap-2 items-center">
                        <img src={chattingGroup && chattingGroup.groupProfilePicture} alt="" className="w-10 h-10 rounded-full" />
                        <div className="info flex flex-col">
                            <p className="text-white font-bold">{chattingGroup && chattingGroup.groupName}</p>
                            <p className="text-gray-400 text-sm">{chattingGroup && chattingGroup?.members && chattingGroup.members.length == 1 || chattingGroup.members.length == 0 ? `${chattingGroup.members.length} member` : `${chattingGroup.members.length} members`} </p>
                        </div>
                    </div>
                    {<button onClick={() => setAddMembersPopup(true)} className="btn-side flex items-center justify-center gap-2 mb-4 bg-gray-700 text-white rounded-lg px-3 py-2 w-7 h-7"
                    >
                        <i className="fa-solid fa-plus"></i>
                    </button>}

                </div>
                <div ref={chatContainer} className="chat-body p-2 flex flex-col flex-1 bg-slate-800" style={{ overflowY: "scroll" }}>
                    {loading &&
                        <div className="flex justify-center">
                            <Loader name="spokes" color="rgb(51, 65, 85)" />
                        </div>
                    }
                    {data && dataRedux.messages.length === 0 && <p className="text-slate-300 text-xl self-center text-center justify-self-center">😊 <br /> Be the first to send a message!</p>}
                    {data && dataRedux.messages.map((item, index) => {
                        if (item.isMyMessage || item.senderID == dataRedux.currentUser.userID) {
                            return <div key={index} className="msg rounded-2xl" style={{ maxWidth: "80%", alignSelf: "flex-end" }}>
                                <p className=" text-white text-end">You</p>
                                <div className="rounded p-2 bg-cyan-700" style={{ background: "linear-gradient(45deg,rgba(128, 0, 128, 0.295), rgba(13, 172, 172, 0.329))" }}>
                                    {item.message.split("\n").map((line, index) => {
                                        return <p className="text-white" key={index}>{line}</p>
                                    })}
                                    <p className="text-gray-400 text-sm text-end">{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        } else {
                            return <div key={index} className="msg rounded-2xl" style={{ maxWidth: "80%", alignSelf: "start" }}>
                                <p className=" text-white">{item.sender_username}</p>
                                <div className="rounded p-2 bg-slate-700">
                                    {item.message.split("\n").map((line, index) => {
                                        return <p className="text-white" key={index}>{line}</p>
                                    })}
                                    <p className="text-gray-400 text-sm text-end">{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        }
                    })}

                </div>
                <form onSubmit={sendMessage} className="bottom border border-slate-500 bg-slate-800 p-1">
                    <div className="flex items-center justify-center h-full w-full">
                        <textarea value={msgTxt} required type="text" onChange={e => setMsgTxt(e.target.value)} placeholder="Write something..." className="noScroll-view text-slate-200 resize-none bg-slate-700 text-sm p-2 rounded-2xl flex-1 outline-none border-slate-500"></textarea>
                        <button type="submit" className="cursor-pointer">
                            <i className="fa-regular fa-paper-plane text-slate-200 mx-3"></i>
                        </button>
                    </div>
                </form>
            </div>
        </>
        }
    </>

    )
}

export default GroupMessage
