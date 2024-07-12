import "./Message.css"
const NoChatMessage = () => {
  return (
    <div className='container flex-1 flex flex-col bg-gray-800 justify-center items-center text-center' style={{ width: "40rem" }}>
      <i className="fa-solid fa-comments text-gray-400 text-5xl"></i><br />
      <h1 className="text-xl text-gray-500 break-words max-w-96">Select a chat to start a conversation and connect with others.</h1>
      <h1 className="text-sm text-gray-500 break-words max-w-56"> © Built by <span className="text-cyan-600"> Yoftahe Abraham </span> | 2024 All Rights Reserved</h1>
    </div>
  )
}

export default NoChatMessage
