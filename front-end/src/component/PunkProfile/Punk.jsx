import React from 'react';
import "./Punk.css";
import MenuBar from "./MenuBar/MenuBar";
import GameModes from "../game/GameModes/GameModes"
import Friends from "./friends/friend"
import Infos from "./Infos/infos"
import  {useState, useEffect} from 'react'

import im1 from '../../assets/bat.jpg'
import im2 from '../../assets/last.jpg'
import im3 from '../../assets/test1.png'
import im4 from '../../assets/test2.jpg'

import { useSocket }  from "../../component/Socket"

const images = [im1, im2, im3, im4];


const Punk = ({user, SetgoGame}) => {
  const socket = useSocket();

  
  return (
    <div className='profile'>

        <div className='page'>
          

            <Infos user={user}/>

        
            <Friends />
          

            <GameModes SetgoGame={SetgoGame}/>



        </div>
      {
        user &&  <MenuBar user={user}/>
      }
    </div>
  )
}

export default Punk