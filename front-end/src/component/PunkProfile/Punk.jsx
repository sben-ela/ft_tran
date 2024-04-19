import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import "./Punk.css";
import MenuBar from "./MenuBar/MenuBar";
import Friends from "./friends/friend";
import Infos from "./Infos/infos";
import GameModes from "../game/GameModes/GameModes";
import { useSocket } from "../../component/Socket";

const Punk = ({ SetgoGame , user}) => {
  const socket = useSocket();
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const resp = await axios.get(`${import.meta.env.VITE_url_back}/api/auth/user`, { withCredentials: true });
  //       setUser(resp.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div>
      {user && (
        <div className='profile'>
          <div className='page'>
            <Infos user={user} />
            <Friends />
            <GameModes SetgoGame={SetgoGame} />
          </div>
          <MenuBar user={user} />
        </div>
      )}
    </div>
  );
};

export default Punk;
