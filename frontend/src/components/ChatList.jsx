import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faClose, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../pages/Main";
import { NavLink, useNavigate } from "react-router-dom";

function ChatList() {
  
  const auth = useContext(AuthContext);

  useEffect(() => {
    // console.log(auth.userDet)
    getUsers();
  }, [])
  
  async function getUsers() {
    try {
        auth.setLoading(true)
        let url = auth.url;
        const response = await fetch(`${url}/api/get_users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        },
      })
      if (!response.ok) {
        throw new Error ('Error sending data to backend')
      }
      const responseData = await response.json()
      console.log(responseData);
      auth.setDmUsers([...responseData.users])
      auth.setFavUsers([...responseData.favorites])
    } catch (error) {
      console.log(error);
    } finally {
        auth.setLoading(false)
      }
  }

  const navigate = useNavigate();

  const [dropDowns, setDropDowns] = React.useState({
    Fav: false,
    Dm: false,
    Channel:false
  })

  function ShowDropdown(name) {
    setDropDowns(preDropdowns => ({
      ...preDropdowns,
      [name]:!dropDowns[name]
    }))
  }

  function handleOpenUser(id) {
    navigate("user-profile/"+id)
  }
  
  const Fav = auth.FavUsers.map((fav) => {
    return (
        <li className="cl-favs cl-li" key={fav._id} onClick={()=>handleOpenUser(fav._id)} >
          <div className="cl--dp-div">
            <img alt="dp" className='cl--dp fcc' src={fav.dp}></img>
          </div> 
          <p className="cl--username">{fav.username}</p>
        </li>
    )
  })
  const Dm = auth.DmUsers.map((dm) => {
    return (
                  <li className="cl-dm cl-li" key={dm._id} onClick={()=>handleOpenUser(dm._id)} >
                    <div className="cl--dp-div">
                      <img alt="dp" className='cl--dp' src={dm.dp}></img>
                    </div> 
                    <p className="cl--username">{dm.username}</p>
                  </li>
    )
  })
  const Channel = auth.ChannelUsers.map((channel) => {
    return (
                  <li className="cl-channel cl-li" key={channel._id} onClick={()=>handleOpenUser(channel._id)} >
                    <div className="cl--dp-div">
                      <img alt="dp" className='cl--dp' src={channel.dp}></img>
                    </div> 
                    <p className="cl--username">{channel.username}</p>
                  </li>
    )
  })

  return (
    <div className="chat-list-main">
      <div className="cl--title white">
        Chat Room
        {auth.windowWidth < 1024
            && <FontAwesomeIcon icon={faClose} className="chat-list-main-bar" onClick={auth.setIsChatList(false)} />
        }
      </div>
      <div className="chat-list">
        <div className="cl--fav">
          <div className="cl--fav-title" onClick={() => ShowDropdown('Fav')}>
            <FontAwesomeIcon className={`drop-down-icon ${ !dropDowns.Fav && 'close'}`} icon={faCaretDown} />
            <p className="cl--list-title">FAVOURITES</p></div>
            <ul className={`cl--fav-list ${dropDowns.Fav? 'cl-ul':''}`}>
              {Fav}
            </ul>
        </div>
        <div className="cl--dm">
          <div className="cl--dm-title" onClick={() => ShowDropdown('Dm')}>
            <FontAwesomeIcon className={`drop-down-icon ${ !dropDowns.Dm && 'close'}`} icon={faCaretDown} />
            <p className="cl--list-title">DIRECT MESSAGES</p>
          </div>
            {/* <ul className={`cl--dm-list ${dropDowns.Dm? 'cl-ul':''}`}> */}
          <ul className={'cl--dm-list ' + (dropDowns.Dm && 'cl-ul')}>
            {Dm}
          </ul>
        </div>
        <div className="cl--channel">
          <div className="cl--channel-title" onClick={() => ShowDropdown('Channel')}>
            <FontAwesomeIcon className={`drop-down-icon ${ !dropDowns.Channel && 'close'}`} icon={faCaretDown} />
            <p className="cl--list-title">CHANNELS</p>
          </div>
          <ul className={'cl--channel-list '+ (dropDowns.Channel && 'cl-ul')}>
            {Channel}
          </ul>
        </div>
      </div>
      <div className="my-profile-btn-div fcc">
        <NavLink to='/' className="my-profile-btn" ><FontAwesomeIcon icon={faUser} />My Profile</NavLink>
      </div>
    </div>
  );
}

export default ChatList;
