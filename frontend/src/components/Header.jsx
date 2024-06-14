import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCircleInfo, faRightFromBracket, faGear, faEllipsisVertical, faStar } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../pages/Main';

export default function Header({username, isMyProfile}) {
    
  const auth = useContext(AuthContext);

  const visitorDet = auth.visitorDet;

  async function handleModifyFav() {
    try {
      let url = auth.url;
      const response = await fetch(`${url}/api/modify_favorite`, {
        method: auth.visitorDet.isFav ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth.token
        },
        body: JSON.stringify(auth.visitorDet._id)
      });
      if (!response.ok) {
        auth.setFlash(['Backend Error', 'error']);
        throw new Error('failed to send data to backend');
      }
      // const responseData = await response.json();
      auth.setVisitorDet(prevState => ({
        ...prevState,
        isFav: !auth.visitorDet['isFav']
      }))
      auth.setFavUsers(prev => {
        let updatedFav = []
        auth.visitorDet.isFav 
          ? (prev.forEach(element => {
            element['_id'] != auth.visitorDet['_id'] && updatedFav.push(element)
          }))
          : updatedFav = [...prev, auth.visitorDet]
        // console.log(updatedFav);
        return updatedFav
      });
      // console.log(responseData);
      // auth.setFlash([responseData.message, responseData.success]);
    } catch (error) {
      console.log(error);
    }
    console.log(visitorDet.isFav ? 'removed' : 'Added fav')
  }

  const handleLogout = async () => {
    try {
      // Move state update outside the async function
      auth.setLoading(true);
        let url = auth.url;
        const response = await fetch(`${url}/api/logout`, {
        method: 'GET'
      });
      if (!response.ok) {
        auth.setFlash(['Backend Error', 'error']);
        throw new Error('failed to send data to backend');
      }
      localStorage.removeItem('token');
      auth.Logout();
    } catch (error) {
      console.log(error);
    }
    finally {
      auth.setLoading(false);
    }
  };
  
    return (<>
        <div className="header">
            <div className="chat--title">
                {username}
            </div>
            <div className="chat--options">
              {isMyProfile && 
                (<>
                <div className="chat-option" onClick={handleModifyFav}>
                    <FontAwesomeIcon icon={faStar} style={visitorDet.isFav && {color:'yellow'}}></FontAwesomeIcon>
                </div>
                <div className="chat-option" onClick={()=>(auth.setIsProfile(prev=>(!prev)))}>
                    <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
                </div>
                <div className="chat-option">
                    <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                </div>
                <div className="chat-option">
                    <FontAwesomeIcon icon={faEllipsisVertical}></FontAwesomeIcon>
                </div>
              </>)
              }
                <div className="chat-option logout-div" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                </div>
            </div>
        </div>
    </>)
}