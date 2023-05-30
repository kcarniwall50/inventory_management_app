import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import "./profile.css";
import Loader from "../../utils/Loader";
import { useDispatch } from "react-redux";
import { Set_Loading } from "../../redux/features/ProductSlice";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Profile = ({loading}) => {
  const dispatch = useDispatch()

  const [profile, setProfile] = useState(null);

  // getting user detail
  useEffect(() => {
    const getUser = async () => {

try{

      dispatch(Set_Loading(true))
      const user = await axios.get(`${BACKEND_URL}/user/getUser`, {
        withCredentials: true,
      });
      dispatch(Set_Loading(false))

      setProfile(user.data);
    }
    catch(error){
      dispatch(Set_Loading(false))
      console.log(error)
     return toast.error("Server error")
    }
    };
    getUser();
  }, [dispatch]);

  return (
    <div className="profile-container">
      {loading && <Loader/>}
      {loading && <Loader/>}
      <h2>Profile</h2>
      <div className="user-container">
        <div className="user-photo">
          <img src={profile?.photo} alt="img" />
        </div>
        <div className="user-info">
          <p className="user-content">
            <b>Name:&nbsp;</b> {profile?.name}
          </p>
          <p className="user-content">
            <b>Email:&nbsp; </b> {profile?.email}
          </p>

          <p className="user-content">
            <b>Phone:&nbsp;</b> {profile?.phone}
          </p>
          <p className="user-content">
            <b>Bio:&nbsp;</b> {profile?.bio}
          </p>
        </div>
      </div>
      <Link className="edit-profile-btn" to="/editProfile">
        Edit Profile
      </Link>
    </div>
  );
};

export default Profile;
