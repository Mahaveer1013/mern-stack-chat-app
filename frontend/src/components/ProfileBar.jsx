import React, { useContext } from "react"
import '../css/profileBar.css'
import logo from '../assets/chat_design.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faMessage, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons"
import { AuthContext } from "../pages/Main"

export default function ProfileBar() {
    const auth = useContext(AuthContext);

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
      }

    return (<div className="fcc profile-bar">
        <div className="profile-close" onClick={()=>(auth.setIsProfile(false))}>
            <FontAwesomeIcon icon={faClose} />
        </div>
        <div className="profile-div fcc">
            <div className="profile-img">
                <img src={auth.visitorDet.dp} alt="DP" />
            </div>
            <div className="profile-name fcc">
                <p>{auth.visitorDet.username}</p>
                <span>{auth.visitorDet.email}</span>
            </div>
            <div className="profile-btns fcc">
                <div className="phone-btn fcc">
                    <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="message-btn fcc">
                    <FontAwesomeIcon icon={faMessage} />
                </div>
                <div className="phone-btn fcc">
                    <FontAwesomeIcon icon={faVideo} />
                </div>
            </div>
            <div className="profile-options">
                <ul>
                    {auth.visitorDet.isFav ? 
                        <li onClick={handleModifyFav} > Remove From Favourites</li>
                        : <li onClick={handleModifyFav} > Add To Favourites</li>
                    }
                    <li>Delete This Contact</li>
                    <li>Block This Contact</li>
                </ul>
            </div>
            <div className="common-ch fcc">
                <p>Common Channels</p>
                <div className="common-ch-list">
                    <ul className="fcc">
                        <li className="fcc">
                            <img src="https://www.shutterstock.com/shutterstock/photos/364341761/display_1500/stock-vector-manager-vector-icon-style-is-bicolor-flat-circled-symbol-green-and-gray-colors-rounded-angles-364341761.jpg" alt="" />
                            Mahaveer</li>
                        <li className="fcc">
                            <img src="https://vectorified.com/images/persona-icon-9.jpg" alt="" />
                            Nagappan</li>
                        <li className="fcc">
                            <img src="https://vectorified.com/images/persona-icon-6.jpg" alt="" />
                            Aashath</li>
                        <li className="fcc">
                            <img src="https://www.shutterstock.com/shutterstock/photos/364341761/display_1500/stock-vector-manager-vector-icon-style-is-bicolor-flat-circled-symbol-green-and-gray-colors-rounded-angles-364341761.jpg" alt="" />
                            Pradeep</li>
                    </ul>
                </div>
            </div>
        </div>
        
    </div>)
}