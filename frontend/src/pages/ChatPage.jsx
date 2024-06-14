// eslint-disable-next-line
import React, { useContext } from 'react'
import ChatList from "../components/ChatList";
import '../css/Chat.css'
import ProfileBar from '../components/ProfileBar';
import { Outlet } from 'react-router-dom';
import {AuthContext} from './Main'

function ChatPage() {

  const auth = useContext(AuthContext);

  return (
    <div className="main-div">
      <ChatList />
      <div className='chat-page'>
        <Outlet />
      </div>
      {auth.isProfile && <ProfileBar />}
    </div>
  )
}

export default ChatPage