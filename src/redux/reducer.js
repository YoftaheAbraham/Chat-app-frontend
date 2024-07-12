import { createSlice } from "@reduxjs/toolkit";

const data = createSlice({
    name: "App_data",
    initialState: {
        token: localStorage.getItem("token") || null,
        currentUser: null,
        onlineUsers: [],
        chats: [],
        groups: [],
        messages: [],
        chattingUser: null,
        chattingGroup: null,
        socket: null,
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers = [...state.onlineUsers, action.payload]
            }
        },
        setLeftUsers: (state, action) => {
            if (state.onlineUsers.includes(action.payload)) {
                state.onlineUsers = state.onlineUsers.filter((item) => item !== action.payload
                )
            }
        },
        addNotifications: (state, action) => {
            const user = state.chats.find((item) => item.userID == action.payload.userID);
            if (user) {
                if (!user.numOfNotifications) {
                    user.numOfNotifications = 1
                    const newChats = state.chats.filter(item => item.userID != action.payload.userID);
                    newChats.unshift(user)
                    state.chats = newChats
                } else {
                    user.numOfNotifications++
                    const newChats = state.chats.filter(item => item.userID != action.payload.userID);
                    newChats.unshift(user)
                    state.chats = newChats
                }

            }
        }
        ,

        setSocket: (state, action) => {
            state.socket.socket = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        logoutUser: (state) => {
            state.currentUser = null;
            state.token = null
            localStorage.setItem("token", "")
            window.location.reload()
        },
        setChats: (state, action) => {
            const filtered = state.chats.find(item => item._id == action.payload._id)
            if (!filtered) {
                state.chats.unshift(action.payload)
            } else {
                const newChats = state.chats.filter(item => item._id != action.payload._id);
                newChats.unshift(action.payload);
                state.chats = newChats;
            }
        },
        setGroups: (state, action) => {
            const filtered = state.groups.find(item => item.groupID == action.payload.groupID)
            if (!filtered) {
                state.groups.unshift(action.payload)
            } else {
                const newGroups = state.groups.filter(item => item.groupID != action.payload.groupID);
                newGroups.unshift(action.payload);
                state.groups = newGroups;
            }
        },
        setGroupsRealtime: (state, action) => {
            const data = { ...action.payload };
            const filtered = state.groups.find(item => item.groupID == data.data.groupID)
            if (!filtered) {
                state.groups.unshift(data.data)
            } else {
                const newGroups = state.groups.filter(item => item.groupID != data.data.groupID);
                newGroups.unshift(data.data);
                state.groups = newGroups;
            }
        },
        removeNotifications: (state, action) => {
            const foundUser = state.chats.find((item) => item.userID == action.payload.userID)
            if (foundUser) {
                foundUser.isNotified = false
                const filtered = state.chats.filter((item) => item.userID == foundUser.userID)
                filtered.unshift(foundUser)
            }
        },
        setGroupMembers: (state, action) => {
            state.chattingGroup.members = action.payload

        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        setMessagesRealTime: (state, action) => {
            state.messages = [...state.messages, action.payload]
        }
        ,
        setChattingUser: (state, action) => {
            state.chattingUser = action.payload
        },
        setChattingGroup: (state, action) => {
            state.chattingGroup = action.payload
        }
    }
})

export default data.reducer;
export const {
    setSocket,
    setChats,
    setCurrentUser,
    logoutUser,
    setMessages,
    setChattingUser,
    removeNotifications,
    addNotifications,
    setGroups,
    setGroupsRealtime,
    setChattingGroup,
    setOnlineUsers,
    setLeftUsers,
    setMessagesRealTime,
    setGroupMembers
} = data.actions