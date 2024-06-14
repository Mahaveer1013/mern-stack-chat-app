import { useContext, useState } from "react";
import { AuthContext } from "../pages/Main";
import '../css/my-profile.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";

export default function MyProfile() {
    const auth = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        username: auth.userDet.username,
        email: auth.userDet.email,
        oldPassword: "",
        newPassword: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Handle file upload
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <>
        <Header username={'Profile'} isMyProfile={false} />
        <div className="my-profile">
            <div className="my-profile-content fcc">
                <form className="my-profile-form" onSubmit={handleSubmit}>
                    <div className="profile-dp fcc">
                        <img src="https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png" alt="" onClick={handleFileChange}/>
                        <label className="dp-change fcc" htmlFor="dp-change">
                            <FontAwesomeIcon icon={faEdit} />
                        </label>
                        <input type="file" id="dp-change" hidden onChange={handleFileChange} />
                    </div>
                    <div className="profile-username fcc">
                        <label htmlFor="p-username">Username</label>
                        <div>
                            <input type="text" id="p-username" name="username" value={profileData.username} onChange={handleInputChange} />
                            <button type="submit">Save</button>
                        </div>
                    </div>
                    <div className="profile-email fcc">
                        <label htmlFor="p-email">Email</label>
                        <div>
                            <input type="text" id="p-email" name="email" value={profileData.email} onChange={handleInputChange} />
                            <button type="submit">Save</button>
                        </div>
                    </div>
                    <div className="profile-password fcc">
                        <label htmlFor="p-old-password">Change Password</label>
                        <div>
                            <input type="password" id="p-old-password" name="oldPassword" placeholder="Enter Old Password" value={profileData.oldPassword} onChange={handleInputChange}/>
                            <input type="password" id="p-new-password" name="newPassword" placeholder="Enter New Password" value={profileData.newPassword} onChange={handleInputChange}/>
                            <button type="submit">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
    );
}
 