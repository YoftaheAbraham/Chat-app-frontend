import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setCurrentUser } from '../../redux/reducer';
import useLogin from '../../hooks/useLogin';
import Popup from 'reactjs-popup';
import Loader from 'react-loading'
const Login = () => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [data, loading, Error, loginUser] = useLogin();
    const navigate = useNavigate()

    useEffect(() => {
        if (data) {
            dispatch(setCurrentUser(data));
            navigate('/')
            window.location.reload()
        }
    }, [data, loading, Error, dispatch, navigate])

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser({
            username: username,
            password
        })
    }
    return (
        <div className='bg-slate-700 flex justify-center items-center' style={{
            height: "100vh"
        }}>
            <Popup open={loading} lockScroll overlayStyle={{ background: `rgba(0, 0, 0, 0.65)`, textAlign: 'center', display: 'flex', minHeight: '100vh', justifyContent: "center", alignItems: 'center' }}>
                <Loader type="spin" color='rgb(6, 188, 212)' />
            </Popup>
            <form onSubmit={handleSubmit} className="p-4 rounded h-min shadow bg-slate-800 min-w-36 flex flex-col">
                {Error && <div className='p-2 origin-center border-red-700' style={{ background: "rgba(236, 32, 32, 0.090)" }}>
                    <p className='text-red-500 break-words max-w-64 text-center text-sm'>{Error}</p>
                </div>}
                <h1 className='text-2xl text-slate-400 font-bold'>Login</h1>
                <div className="fields min-w-28">
                    <div className="field my-2">
                        <label className='text-slate-500'>Username:</label><br />
                        <input required type="text" spellCheck="false" onChange={e => setUsername(e.target.value)} className='bg-slate-700 text-slate-300 min-w-80 outline-none rounded p-2' />
                    </div>
                    <div className="field my-2">
                        <label className='text-slate-500'>Password:</label><br />
                        <input required spellCheck="false" type="password" onChange={e => setPassword(e.target.value)} className='bg-slate-700 text-slate-300 min-w-80 outline-none rounded p-2' />
                    </div>

                    <div className="field my-2">
                        <input type="submit" value={'Login'} className='bg-cyan-700 text-white cursor-pointer min-w-80 outline-none rounded  p-1' />
                    </div>

                    <p className='text-slate-400'>{`Don't`} have an account? <Link to={'/signup'} className='text-cyan-600 font-semibold'>Signup</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Login
