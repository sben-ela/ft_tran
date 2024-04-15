import React, { useState } from 'react'
import './Login.css'
import CanvasAnimation from '../Canvas/canvas'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import { Navigate } from "react-router-dom";



export const TwoFa = ({user ,setError}) => 
{

  const [code, setcode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  if (user)
    return <Navigate to="/Home" replace />;
  const saveData = async () => {
    const data = await axios.post(`${import.meta.env.VITE_url_back}/api/2fa/authenticate`, {twofa:code},{withCredentials: true})
    if(data.status == 200)
    {
      setError('');
      setIsVerified(true);
    }
  }

  if (isVerified)
   return <Navigate to="/Home" replace />;

  return (
    <div className='wfa-container'>
      <div className='wfa'>
        <h1 className='h11'> Enter your 2fa code please </h1>
        <input className='input' onChange={(e) => setcode(e.target.value)}></input>
        <Button onClick={saveData}>save</Button>
      </div>
    </div>
  )
}

export const Login = ({user}) => {
  if(user)
    return <Navigate to="/Home" replace />;
  return (
    <div className='cont'>

        <div className='title'>
          <p></p>
        </div>
        {/* <a  className="button-link"></a> */}
        <a href={`${import.meta.env.VITE_url_back}/api/auth/42`}>
          <p>Login</p>
        </a>
        <p className='game-title'>Heroes PingPong</p>
    </div>
  )
}
