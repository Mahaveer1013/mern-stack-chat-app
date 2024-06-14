import React, { useContext, useEffect, useRef, useState } from 'react'
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from 'react-router-dom';
import { AuthContext } from '../pages/Main';
import Header from '../components/Header';
import io from 'socket.io-client'


export default function Chat() {
  
  const auth = useContext(AuthContext)
  const [chats, setChats] = React.useState([])
  const params = useParams();
  const id = params.userID;
  const [message, setMessage] = useState('')
  const chatContainerRef = useRef(null);

  let url = auth.url;
  const socket = io(`${url}`, {
    extraHeaders: {
      Authorization: 'Bearer '+auth.token
    }
  });

  
  function handleChange(e) {
    setMessage(e.target.value)
  }

  useEffect(() => {
    setChats([])
    getChats(id)
  },[id])
  
  async function getChats(id) {
    try {
      auth.setLoading(true)
        let url = auth.url;
        const response = await fetch(`${url}/api/get_chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        },
        body: JSON.stringify(id)
      })
      if (!response.ok) {
        throw new Error('failed to send data to backend')
      }
      const responseData = await response.json();
      responseData && setChats([...responseData])
    } catch (error) {
      console.log(error);
    } finally {
      auth.setLoading(false)
    }
  }

  const [username, setUserName] = useState('');

  useEffect(() => {
    checkUser(id)
  }, [id])
  
  async function checkUser(id) {
    if (id) {
        let url = auth.url;
        const response = await fetch(`${url}/api/get_user_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        },
        body: JSON.stringify(id)
      })
      if (!response.ok) {
        throw new Error('failed to send data to backend')
      }
      const responseData = await response.json();
      if (responseData) {
        auth.setVisitorDet({
          _id: responseData['_id'],
          username: responseData['username'],
          email: responseData['email'],
          dp: responseData['dp'],
          isFav: responseData['isFav']
        })
        setUserName(responseData.username)
      }
    } else {
      auth.setVisitorDet({
        _id: null,
        username: null,
        email: null,
        dp: null
      })
      setUserName(auth.userDet.username)
    }
  }

  const messages = chats.map(msg => {
        return (
          <div className={ (msg.sender_id !== id ? 'my-msg-div' : 'other-msg-div') + " msg-div"} key={msg._id}>
            <div className={ (msg.sender_id !== id ? 'my-msg' : 'other-msg') + " msg"}>
              { msg.username }<br />{msg.message}<br /> <span className="time">{msg.time}</span>
            </div>
          </div> 
        )
      }) 

    function handleSend(event) {
      event.preventDefault();
      const messageDet = {
        sender_id: auth.userDet._id,
        receiver_id: id,
        message: message
      }
      socket.emit('send_message', messageDet)
      setMessage('')
      
  }
  
  socket.on('message_received', data => {
      (
        (data['receiver_id'] === id && data['sender_id'] === auth.userDet._id) ||
        (data['sender_id'] === id && data['receiver_id'] === auth.userDet._id)
      ) &&
        setChats([...chats, data])
  })

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  // Function to scroll the chat container to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
    return (
      <>
        <Header username={username} isMyProfile={true} />
        <div className="container">
          <div className="message">
              <div className="message-div" ref={chatContainerRef}>
                {messages && [messages]}
              </div>
          </div>
          <form className="input-box" >
            <div className="input-dp-div">
              <img className='input-dp' src="https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-6/128/profile-male-circle2-512.png" alt="dp" />
            </div>
            <input className='input-msg' value={message} onChange={handleChange} type="text" name='message' placeholder='Write a message ...' />
            <button className='send-msg' onClick={handleSend}><FontAwesomeIcon icon={faPaperPlane} />Send</button>
          </form>
        </div>
      </>
    )
  }