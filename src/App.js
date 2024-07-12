import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Chat from './pages/Chat/Chat';
import Message from './components/Message/Message';
import NoChatMessage from './components/Message/NoChatSelected';
import GroupMessage from './components/Message/MessageGroup';
import './App.css'

// const socket = io("http://localhost:6600");

function App() {
  const data = useSelector((item) => item.data);
  return (
    <>
      <Routes>
        <Route path='/' element={data.token === "" || !data.token || data.token === undefined ? <Navigate to="/signup" /> : <Chat />}>
          <>
            <Route path='/' index element={<NoChatMessage />} />
            <Route path=':id' element={<Message />} />
            <Route path='/group/:id' element={<GroupMessage />} />
          </>
        </Route>
        <Route path='/login' index element={
          <>
            {data.token === "" || data.token ? <Navigate to="/" /> : <Login />}
          </>
        } />
        <Route path='/signup' element={
          <>
            {data.token === "" || data.token ? <Navigate to="/" /> : <Signup />}
          </>
        } />
        <Route path='*' index element={
          <h1 className=' text-3xl'>Unmatched routed</h1>
        } />
      </Routes>
    </>
  )
}

export default App
