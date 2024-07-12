import { useDispatch } from "react-redux";
import notificationSound from "./../../assets/notification-sound.wav"
import "./Sidebar.css"
import { addNotifications, logoutUser, removeNotifications, setChats, setChattingGroup, setChattingUser, setGroups, setGroupsRealtime, setLeftUsers, setOnlineUsers } from "../../redux/reducer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Popup from "reactjs-popup";
import { SocketContext } from "../../socket/Socket";
import Logo from "./../../assets/logo.png"
import ChatDisplay from "./ChatDisplay";
import avatars from './../../utils/Avatar.json'
import GroupDisplay from "./GroupDisplay";

const ChatSidebar = ({ dataRedux }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useContext(SocketContext)
    const [groupPopup, setGroupPopup] = useState(false)
    const [queryPopup, setQueryPopup] = useState(false)
    const [groupName, setGroupName] = useState(null)
    const [groupUserName, setGroupUserName] = useState(null)
    const [updatedUsername, setUpdatedUsername] = useState(dataRedux.currentUser.username)
    const [updatedFullName, setUpdatedFullName] = useState(dataRedux.currentUser.full_name)
    const [activeNestedRoute, setActiveNestedRoute] = useState("chats");
    const [searchInp, setSearchInp] = useState(null)
    const [queriedUser, setQueriedUsers] = useState(null);
    const [activeClass, setActiveClass] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(dataRedux.currentUser?.profile_picture);
    const [editProfilePopup, setEditProfilePopup] = useState(false)

    const logout = () => {
        dispatch(logoutUser())
    }

    useEffect(() => {
        socket.on("get-message-private", (data) => {
            const sound = new Audio(notificationSound)
            sound.volume = 0.5
            sound.play()
            dispatch(setChats({ ...data.chat, isNotified: true }))
            dispatch(addNotifications({ ...data.chat, isNotified: true }))
        });
        socket.on("added-to-group", data => {
            const sound = new Audio(notificationSound)
            sound.play()
            dispatch(setGroupsRealtime(data))
        })
        socket.on("get-message-public", (data) => {
            const sound = new Audio(notificationSound)
            sound.play()
            dispatch(setGroups({ ...data.group, isNotified: true }))
        });
        socket.on("onlineUsers", (data) => {
            Object.keys(data).forEach((item) => {
                dispatch(setOnlineUsers(item))
            });
        });
        socket.on("leftUsers", (data) => {
            dispatch(setLeftUsers(data))
        });
    }, [dataRedux, dispatch, socket])
    useEffect(() => {
        let timer = setTimeout(() => {
            if (searchInp) {
                fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/data/search?q=${searchInp}`, {
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
    }, [searchInp, dataRedux.token])
    const toMessage = (id, payload) => {
        setQueryPopup(false)
        setGroupPopup(false)
        setActiveClass(false)
        dispatch(removeNotifications(payload))
        dispatch(setChattingUser(payload));
        navigate(`/${id}`)
    }
    const toMessageGroup = (id, payload) => {
        setQueryPopup(false)
        setGroupPopup(false)
        setActiveClass(false)
        dispatch(setChattingGroup(payload));
        setActiveClass(false)
        navigate(`/group/${id}`)
    }
    const updateProfile = (e) => {
        e.preventDefault();
        fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/data/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${dataRedux.token}`
            },
            body: JSON.stringify({
                full_name: updatedFullName,
                username: updatedUsername,
                profile_picture: selectedAvatar
            })
        }).then((res) => res.json()).then(data => {
            if (data.status == "success") {
                window.location.reload()
                setEditProfilePopup(false)
            } else {
                alert(data.message)
            }
        })
    }
    const submitGroup = (e) => {
        e.preventDefault();
        fetch(`https://realtime-chat-app-server-0w28.onrender.com/api/conversation/createGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${dataRedux.token}`
            },
            body: JSON.stringify({ groupName, groupUsername: groupUserName })
        }).then((res) => res.json()).then(data => {
            if (data.status == "success") {
                setGroupPopup(false)
                setActiveNestedRoute("groups")
                dispatch(setGroups(data.data))
            } else {
                alert(data.message)
            }
        })
    }

    return (
        <div
            className={`sidebar-container ${activeClass ? 'active' : ''} bg-slate-800 border-slate-500 border-r absolute text-white w-full  h-screen p-4`}
        >
            <div className="side-bar-controller justify-end cursor-pointer p-2" onClick={() => setActiveClass(!activeClass)}>
                {activeClass ? <>
                    <i className="fa-solid fa-xmark"></i>
                </> : <>
                    <i className="fa-solid fa-bars text-white text-end"></i>
                </>}
            </div>
            <div className={`side-bar-content ${activeClass && 'active'}`}>
                <div className="flex flex-wrap items-center border border-slate-600 rounded p-1 my-2">

                    <img
                        src={Logo}
                        alt=""
                        className="w-10 h-10 mr-3"
                    />
                    <div className="">
                        <p className="right font-bold">Whisper wave!</p>
                    </div>
                </div>
                <div className="current-user-info flex items-center justify-between gap-1 flex-wrap mb-4">
                    <div className="flex flex-wrap items-center justify-center">
                        <img
                            src={dataRedux.currentUser?.profile_picture}
                            alt=""
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="">
                            <p className="right font-bold">{dataRedux.currentUser?.full_name}</p>
                            <p className=" text-gray-400">{dataRedux.currentUser?.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={logout} className="px-2 py-1 rounded-md bg-gray-700">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                        <button onClick={() => setEditProfilePopup(true)} className="px-2 py-1 rounded-md bg-gray-700">
                            <i className="fa-solid fa-pen"></i>
                        </button>
                    </div>
                </div>
                <button onClick={() => {
                    setQueryPopup(true)
                }} className="btn-side flex items-center justify-center gap-2 mb-4 bg-gray-700 text-white rounded-lg px-3 py-2 w-full">
                    <i className="fa-solid fa-plus"></i>
                    <span>Add Chat</span>
                </button>
                <button className="btn-side flex items-center justify-center gap-2 mb-4 bg-gray-700 text-white rounded-lg px-3 py-2 w-full"
                    onClick={() => setGroupPopup(true)}
                >
                    <i className="fa-solid fa-user-group"></i>
                    <span>Create Group</span>
                </button>
                <Popup open={queryPopup} lockScroll onClose={() => {
                    setQueriedUsers(null)
                    setQueryPopup(false)
                }} overlayStyle={{ background: `rgba(0, 0, 0, 0.65)` }}>
                    <form onSubmit={e => e.preventDefault()} className="pop-up flex flex-col gap-1 border-white border bg-slate-900 p-1">
                        <h1 className="text-white text-center font-bold">Add Chat(search)</h1>
                        <div className="">
                            <label className="text-white">Full Name or Username:</label><br />
                            <input onChange={e => setSearchInp(e.target.value)} required placeholder="eg, john, john@gmail.com" className="p-1 min-w-72 bg-slate-950 outline-none rounded text-gray-500" type="text" />
                        </div>
                        <div className="query-results max-h-56 bg-slate-950 p-2 flex flex-col overflow-y-scroll">
                            {queriedUser && queriedUser.map((data, index) => {
                                return <button type="button" className="" key={index} onClick={() => toMessage(data._id, data)}>
                                    <li className="flex items-center justify-between mb-2 p-2 rounded-md bg-slate-900 border border-slate-500 cursor-pointer hover:bg-gray-600">
                                        <div className="flex items-center justify-between flex-1">
                                            <div className="left flex items-center justify-center">
                                                <div className="flex flex-col">
                                                    <div className="relative">
                                                        <img
                                                            src={data.profile_picture}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                        {dataRedux.onlineUsers?.includes(data._id) && <div className="w-2 h-2 bg-green-400 rounded-full absolute right-1 bottom-1"></div>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-slate-400">{data.full_name}</h5>
                                                    <p className="text-sm text-cyan-600 text-start">{data.username}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </button>
                            })}
                        </div>
                        <div className="controls gap-2 flex justify-between">
                            <button className="p-2 flex-1 text-white bg-slate-600" type="button" onClick={() => setQueryPopup(false)}>Cancel</button>
                        </div>
                    </form>
                </Popup>
                <Popup open={groupPopup} onClose={() => setGroupPopup(false)} lockScroll overlayStyle={{ background: `rgba(0, 0, 0, 0.65)` }}>
                    <form onSubmit={submitGroup} className="pop-up p-2 flex flex-col gap-1 border-white border bg-slate-900 p-1">
                        <h1 className="text-white text-center font-bold">Create Group(Public)</h1>
                        <div className="">
                            <label className="text-white">Group Name:</label><br />
                            <input onChange={e => setGroupName(e.target.value)} required placeholder="eg, My Group" className="p-1 min-w-72 bg-slate-950 outline-none rounded text-gray-500" type="text" />
                        </div>
                        <div className="">
                            <label className="text-white">Group Username:</label><br />
                            <input onChange={e => setGroupUserName(e.target.value)} required placeholder="eg, group" className="p-1 min-w-72 bg-slate-950 outline-none rounded text-gray-500" type="text" />
                        </div>
                        <div className="controls gap-2 flex justify-between">
                            <button className="p-2 flex-1 text-white bg-slate-600" type="button" onClick={() => setGroupPopup(false)}>Cancel</button>
                            <button className="p-2 flex-1 text-white bg-cyan-600" type="submit">Create</button>
                        </div>
                    </form>
                </Popup>
                <Popup open={editProfilePopup} onClose={() => setEditProfilePopup(false)} lockScroll overlayStyle={{ background: `rgba(0, 0, 0, 0.65)` }}>
                    <form onSubmit={updateProfile} className="pop-up flex flex-col gap-1 border-white border bg-slate-900 p-1">
                        <h1 className="text-white text-center font-bold">Update your profile</h1>
                        <div className="">
                            <label className="text-white">Full name:</label><br />
                            <input defaultValue={updatedFullName} onChange={e => setUpdatedFullName(e.target.value)} required placeholder="Please add your Full Name" className="p-1 min-w-72 bg-slate-950 outline-none rounded text-gray-500" type="text" />
                        </div>
                        <div className="">
                            <label className="text-white">username:</label><br />
                            <input defaultValue={updatedUsername} onChange={e => setUpdatedUsername(e.target.value)} required placeholder="please add username" className="p-1 min-w-72 bg-slate-950 outline-none rounded text-gray-500" type="text" />
                        </div>
                        <div className="">
                            <label className="text-white">avatar:</label><br />
                            <div className="query-results max-h-28 rounded gap-1 flex flex-wrap max-w-72 bg-slate-950 p-2 overflow-y-scroll">
                                {avatars.map((item, index) => {
                                    return <div key={index}>
                                        {item.url == selectedAvatar ? <div onClick={() => setSelectedAvatar(item.url)} className="bg-cyan-700 cursor-pointer p-1 rounded">
                                            <img className="rounded-full p-1 w-10 h-10 bg-slate-700" alt="" src={item.url} />
                                        </div> : <div className="bg-slate-800 cursor-pointer p-1 rounded" onClick={() => setSelectedAvatar(item.url)}>
                                            <img className="rounded-full p-1 w-10 h-10 bg-slate-700" alt="" src={item.url} />
                                        </div>}
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="controls gap-2 flex justify-between">
                            <button className="p-2 flex-1 text-white bg-slate-600" type="button" onClick={() => setEditProfilePopup(false)}>Cancel</button>
                            <button className="p-2 flex-1 text-white bg-cyan-600" type="submit">Update</button>
                        </div>
                    </form>
                </Popup>
                <div className="nav-info flex gap-3 p-2 flex-wrap">
                    {dataRedux && <>
                        <p className={`${activeNestedRoute == "chats" && `font-bold text-cyan-500`} cursor-pointer flex gap-1 items-center`} style={{ fontSize: '13px' }} onClick={() => setActiveNestedRoute("chats")}> <i className="fa-solid fa-user"></i><span className="right">Chats </span>({dataRedux && dataRedux.chats.length})</p>
                        <p className={`${activeNestedRoute == "groups" && `font-bold text-cyan-500`} cursor-pointer flex gap-1 items-center`} style={{ fontSize: '13px' }} onClick={() => setActiveNestedRoute("groups")}> <i className="fa-solid fa-user-group"></i><span className="right">Groups </span>({dataRedux && dataRedux.groups.length})</p>
                    </>

                    }
                </div>
                <ul className="list-none bg-slate-900">
                    {activeNestedRoute == "chats" ? dataRedux.chats.length == 0 ? <h1 className="text-sm text-slate-500">Welcome to the Whisper wave! Start a new chat or create groups and add members to connect with others or join groups to engage in discussions. Feel free to explore and discover new conversations.</h1> :
                        dataRedux.chats.map((item, index) => {
                            return <ChatDisplay key={index} toMessage={toMessage} dataRedux={dataRedux} chat={item} />
                        })
                        :
                        dataRedux.groups.map((item, index) => {
                            return <GroupDisplay key={index} toMessageGroup={toMessageGroup} dataRedux={dataRedux} group={item} />
                        })
                    }
                </ul>
            </div>
        </div>
    );
};

export default ChatSidebar;