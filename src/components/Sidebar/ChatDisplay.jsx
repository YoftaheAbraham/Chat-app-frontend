const ChatDisplay = ({ toMessage, chat, dataRedux }) => {

  return (
    <button className="w-full" onClick={() => { toMessage(chat.userID, chat) }}>
      <li className={`flex items-center justify-between mb-2 p-2 rounded-md border border-slate-500 cursor-pointer ${dataRedux.chattingUser && dataRedux.chattingUser.userID == chat.userID ? 'bg-slate-700' : 'bg-slate-900'} hover:bg-slate-700`}>
        <div className="flex items-center justify-between flex-1">
          <div className="left flex items-center justify-center">
            <div className="flex flex-col">
              <div className="relative">
                <img
                  src={chat.profile_picture}
                  alt=""
                  className="w-10 h-10 rounded-full mr-3"
                />
                {dataRedux.onlineUsers && dataRedux.onlineUsers.includes(chat._id) ?
                  <div className="w-2 h-2 bg-green-400 rounded-full absolute right-1 bottom-1"></div> :
                  <div className="w-2 h-2 bg-gray-700 rounded-full absolute right-1 bottom-1"></div>}
              </div>
            </div>
            <div>
              <h5 className="font-semibold">{chat.full_name}</h5>
              <p className="text-sm text-cyan-600 text-start">{chat.username}</p>
            </div>
          </div>
          {chat.isNotified && <div className="bg-cyan-600 w-4 h-4 rounded-full text-white font-bold" style={{ fontSize: '11px' }}>?</div>}
        </div>
      </li>
    </button>
  )
}

export default ChatDisplay
