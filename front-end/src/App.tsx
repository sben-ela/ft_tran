import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, TwoFa } from './component/Login/Login';
import './App.css';
import Punk from './component/PunkProfile/Punk';
import Chat from './component/MyChat/Chat';
import axios from 'axios';
import { useSocket } from './component/Socket';
import UserProfile from './component/UserProfile/UserProfile';
import ChangeProfile from './component/ChangeInfos/ChangeInfos';
import GameRequest from './component/Modals/GameRequest/gamereq';
import FirstPage from './component/game/FirstPage';
import OnlineMatching from './component/game/OnlineMatching';
import Invite from './component/game/Invite';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const socket = useSocket();
  const[fetchuser,setfetchuser] = useState(0);
  const [showRequest, SetShow] = useState(false);
  const [gameRequestSender, SetSender] = useState(null);
  useEffect(()=>{
    socket?.on('updated', ()=> {
    
      setfetchuser((prevIsBool) => prevIsBool + 1)});
  }, [socket])

  useEffect(()=>{
    socket?.on('invitegame', (user)=> {
      console.log()
      SetSender(user);
      SetShow(true)});
      setTimeout(() => {
        SetShow(false);
      }, 3000);
  }, [socket])

  socket?.on('accept', () => {

  })
  
  useEffect(() => {
    const fetchData = async () => {
      try {
   
        const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user`, { withCredentials: true });
        setUser(resp.data);
        
      } catch (error) {
        setError(error.response.data.message );
      }
    };
    fetchData();
  }, [fetchuser]);





  useEffect(() => {
    const handleError = (mssg) => {
      console.log(mssg);
      setErrorMessage(`An error occurred: ${mssg.type}`);
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    };
    

    socket?.on('error', handleError);

    return () => {
      socket?.off('error');
    };
  }, [socket]);
  const canceling = () => {
    SetShow(false);
  }



const [goGame, SetgoGame] = useState(false);
return (
  <Router>
      {
        showRequest && <GameRequest SetShow={SetShow} user={user} onCancel={canceling}/>
      }
      {
        errorMessage && (
        <div className='error-container'>
          <div className="error-popup">{errorMessage}</div>
        </div>
      )
      }
      <Routes>
        {
          error.length > 0 ?
          (
            error === '2FA' 
            ? ( <>
             <Route path="*" element={<Navigate to="/2fa" />} />  
              <Route path="/2fa" element={<TwoFa user={user} setError={setError}/>} />
            </>)
            : ( <>
              <Route path="*" element={<Navigate to="/" />} /> 
             <Route path="/" element={<Login user={user}/>} />
            </>)
          )
          :
          (
            <>
              <Route path="/2fa" element={<TwoFa user={user} setError={setError}/>} />
              <Route path="/" element={<Login user={user} />} />
              <Route path="/Home" element={<Punk user={user} SetgoGame={SetgoGame}/>} />
              <Route path="/practice" element={<FirstPage infos={[]} mode='practice' goGame={goGame}/>} />
              <Route path="/online" element={<OnlineMatching goGame={goGame}/>} />
              <Route path="/invite" element={<Invite baseSocket={socket} inviter={gameRequestSender}/>} /> 

              <Route path="/Chat" element={<Chat user={user}/>} />
              {user && <Route path="/Changeinfo" element={<ChangeProfile user={user} />} />}
              <Route path="/profile/:userId" element={<UserProfile />} />
            </>
          )

        }
      </Routes>
    </Router>
);
}

export default App;