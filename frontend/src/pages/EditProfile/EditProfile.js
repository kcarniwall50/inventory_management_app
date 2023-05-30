import React, { useEffect, useState } from "react";
import "./editProfile.css";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link} from "react-router-dom";
import { toast } from "react-toastify";
import { setName } from "../../redux/features/auth/AuthSlice";
import Loader from "../../utils/Loader";
import { Set_Loading } from "../../redux/features/ProductSlice";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EditProfile = ({loading}) => {

  const [newPassword, setNewPassword] = useState({
    oldPassword: "",
    password: "",
    password2: "",
  });
  const { oldPassword, password, password2 } = newPassword;

  const [userImage, setUserImage] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: "",
    phone: "",
    bio: "",
  });

  const [saveUser, setSaveUser] = useState();
  const dispatch = useDispatch();

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
      setSaveUser(user.data);
    }
    catch(e)
    {
      dispatch(Set_Loading(false))
      console.log(e)
      toast.error("server error")
    }
    };
    getUser();
  }, [dispatch]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const imageHandler = (e) => {
    setUserImage(e.target.files[0]);
  };

  const inputPassHandler = (e) => {
    const { name, value } = e.target;
    setNewPassword((prev) => ({ ...prev, [name]: value }));
  };

  const updatePassword = async (passwordData) => {
    if (!oldPassword || !password || !password2) {
      return toast.error("please enter passwords");
    }

    if (password?.length < 6) {
      return toast.error("password's length  cant be below 6 ");
    }

    if (password !== password2) {
      return toast.error("confirem password did not match");
    }

    try {
    await  dispatch(Set_Loading(true))
      await axios.patch(
        "http://localhost:5000/user/changePassword",
        { oldPassword, password },
        { withCredentials: true }
      );
      dispatch(Set_Loading(false))
      toast.success("Password Updated successfully");
    } catch (error) {
     dispatch(Set_Loading(false))
      return toast.error(error.response.data);
    }
  };

  const updateProfile = async () => {
    if (
      profile?.name !== saveUser?.name ||
      profile?.phone !== saveUser?.phone ||
      profile?.bio !== saveUser?.bio
    ) {
      const formDataa = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profile.photo,
      };

      if (profile?.name !== saveUser?.name) {
        dispatch(setName(profile?.name));
      }

      try {
        dispatch(Set_Loading(true))
         await axios.patch(
          "http://localhost:5000/user/updateUser",
          formDataa,
          { withCredentials: true }
        );
        dispatch(Set_Loading(false))

        toast.success("profile Updated successfully");
      } catch (error) {
        dispatch(Set_Loading(false))
        return toast.error(error.message);
      }
    } else {
      return toast.error("please edit profile first");
    }
  };

  const updatePhoto = async () => {
    if (!userImage) {
      return toast.error("please choose file first");
    }

    if (
      userImage &&
      (userImage.type === "image/jpg" ||
        userImage.type === "image/jpeg" ||
        userImage.type === "image/png")
    ) {
      const newImage = new FormData();
      newImage.append("file", userImage);
      newImage.append("upload_preset", "invclient");

      try {
        dispatch(Set_Loading(true))
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dvsviwnhl/image/upload",
          newImage
        );
        dispatch(Set_Loading(false))

        profile.photo = response.data.secure_url;
        const formDataa = {
          name: profile.name,
          phone: profile.phone,
          bio: profile.bio,
          photo: profile.photo,
        };

        try {


          dispatch(Set_Loading(true))

          const responseData = await axios.patch(
            "http://localhost:5000/user/updateUser",
            formDataa,
            { withCredentials: true }
          );
          dispatch(Set_Loading(false))
          setSaveUser({
            ...saveUser,
            [saveUser.photo]: responseData.data.photo,
          });

          toast.success("photo Updated successfully");
        } catch (error) {
          dispatch(Set_Loading(false))
          return toast.error(error.message);
        }
      } catch (e) {
        dispatch(Set_Loading(false))
        return toast.error(e.response.data.error.message);
      }
    } else {
      return toast.error("invalid file format");
    }
  };

  return (
    <>
    {loading && <Loader/>}
      <h3 style={{ margin: "0.6rem 0", textAlign: "center", color: "grey" }}>
        Edit Profile
      </h3>
      <div className="edit-profile-container">
        <div className="image-part">
          <img
            src={saveUser?.photo} alt="img"
            style={{ width: "150px", borderRadius: "50%" }}
          />
        </div>

        <div>
          <label>Photo:</label>
          <input type="file" name="image" onChange={imageHandler}></input>
          <br />
          <code style={{ color: "grey" }}>
            <small>jpg, jpeg, png only</small>
          </code>

          <br />
          <code style={{ color: "grey" }}>
            <small>(less than 10.5MB)</small>
          </code>

          <p style={{ width: "40%" }}>
            <br />
            <span
              type="submit"
              className="edit-profile-button"
              onClick={updatePhoto}
            >
              update photo
            </span>
          </p>
        </div>

        <form className="edit-profile-form">
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={profile?.name}
              name="name"
              onChange={inputHandler}
            />
          </div>

          <div>
            <label>Email:</label>
            <input type="text" value={profile?.email} name="email" disabled />
            <br />
            <code>
              <small>Email cant not be changed</small>
            </code>
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              value={profile?.phone}
              name="phone"
              onChange={inputHandler}
            />
          </div>
        </form>

        <form className="edit-profile-form">
          <div>
            <label>Bio:</label>
            <textarea
              type="text"
              rows="5"
              cols="25"
              value={profile?.bio}
              name="bio"
              onChange={inputHandler}
            ></textarea>
          </div>

          <p style={{ width: "40%" }}>
            <br />
            <span className="edit-profile-button" onClick={updateProfile}>
              update profile
            </span>
          </p>
        </form>

        {/* <button>Save Changes</button> */}

        <div
          style={{
            display: "flex",
            gap: "3rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="change-password">
            <h4>Change Password:</h4>
            <div>
              <input
                type="password"
                placeholder="Old Password"
                name="oldPassword"
                value={oldPassword}
                onChange={inputPassHandler}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="New Password"
                name="password"
                value={password}
                onChange={inputPassHandler}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                name="password2"
                value={password2}
                onChange={inputPassHandler}
              />
            </div>

            <div style={{ marginLeft: "auto" }}>
              <Link to="/forgotPassword" target="_blank">
                <code>Forgot Password</code>
              </Link>
            </div>
          </div>

          <p style={{ width: "70px" }}>
            <button
              type="submit"
              className="edit-profile-button"
              onClick={updatePassword}
            >
              update password
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
