import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSignup from '../../hooks/useSignup'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../redux/reducer'
import Loader from 'react-loading'
import Popup from 'reactjs-popup'
const Signup = () => {
    const dispatch = useDispatch();
    const [full_name, setFull_name] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [gender, setGender] = useState('boy');
    const [data, loading, Error, signup] = useSignup();
    const navigate = useNavigate();
    useEffect(() => {
        if (data) {
            dispatch(setCurrentUser(data));
            navigate('/')
            window.location.reload()
        }
    }, [data, loading, Error, dispatch, navigate])

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        signup({
            full_name, username, password, gender
        })
    }
    return (
        <div className='bg-slate-700 flex justify-center items-center' style={{
            height: "100vh"
        }}>
            <Popup open={loading} lockScroll overlayStyle={{ background: `rgba(0, 0, 0, 0.65)`, textAlign: 'center',display: 'flex', minHeight: '100vh', justifyContent: "center", alignItems: 'center' }}>
                <Loader type="spin" color='rgb(6, 188, 212)'/>
            </Popup>
            <form onSubmit={handleSubmit} className="p-4 rounded border h-min shadow bg-slate-800 min-w-36 flex flex-col">
                {Error && <div className='p-2 origin-center border-red-700' style={{ background: "rgba(236, 32, 32, 0.090)" }}>
                    <p className='text-red-500 break-words max-w-64 text-center text-sm'>{Error}</p>
                </div>}
                <h1 className='text-2xl text-slate-400 font-bold'>Signup</h1>
                <div className="fields min-w-28">
                    <div className="field my-2">
                        <label className='text-slate-500'>Full Name:</label><br />
                        <input maxLength={20} required onChange={e => setFull_name(e.target.value)} type="text" spellCheck="false" className='bg-slate-700 text-slate-300 min-w-80 outline-none rounded p-2' />
                    </div>
                    <div className="field my-2">
                        <label className='text-slate-500'>Username:</label><br />
                        <input maxLength={10} required type="text" onChange={e => setUsername(e.target.value)} spellCheck="false" className='bg-slate-700 text-slate-300 min-w-80 outline-none rounded p-2' />
                    </div>
                    <div className="field my-2">
                        <label className='text-slate-500'>Password:</label><br />
                        <input required spellCheck="false" type="password" onChange={e => setPassword(e.target.value)} className='bg-slate-700 text-slate-300 min-w-80 outline-none rounded p-2' />
                    </div>
                    <div className="field my-2 flex gap-2">
                        <label className='text-slate-500'>Gender:</label><br />
                        <input
                            required
                            spellCheck="false"
                            type="radio"
                            checked={gender === 'boy'}
                            onChange={handleGenderChange}
                            name='gender'
                            value='boy'
                            className='outline-none rounded border p-1'
                        />
                        <span className='text-slate-400'>Male</span>
                        <input
                            required
                            spellCheck="false"
                            type="radio"
                            checked={gender === 'girl'}
                            onChange={handleGenderChange}
                            name='gender'
                            value='girl'
                            className='outline-none rounded border p-1'
                        />
                        <span className='text-slate-400'>Female</span>
                    </div>
                    <div className="field my-2">
                        <button type='submit' className={`bg-cyan-700 cursor-pointer text-white min-w-80 outline-none rounded p-1 flex justify-center`}>Signup </button>
                    </div>

                    <p className='text-slate-300'>Already have an account? <Link to={'/login'} className='text-cyan-500 font-semibold'>Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Signup
