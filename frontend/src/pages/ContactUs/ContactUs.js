import axios from "axios";
import React, { useState } from "react";
import { AiOutlineMail, AiOutlineTwitter } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import "./contactUs.css";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ContactUs = () => {
  const [data, setData] = useState({
    subject: "",
    message: "",
  });
  const { subject, message } = data;

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const clickSubmit = async (e) => {
    if (!subject || !message) {
      return toast.error("Fields cant be empty");
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/help/contactUs`, data, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setData({
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.success(error.response.data);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-form-container">
        <p>Subject</p>
        <input
          style={{border:'1px solid grey'}}
          type="text"
          placeholder="subject"
          name="subject"
          value={subject}
          onChange={inputChangeHandler}
        />
        <br />
        <p>Message</p>
        <textarea
        style={{border:'1px solid grey'}}
          rows="10"
          cols="30"
          placeholder=" Write message here..."
          name="message"
          value={message}
          onChange={inputChangeHandler}
        ></textarea>
        <button
          style={{
            cursor: "pointer",
            padding: "0.2rem",
            backgroundColor: "rgb(223, 238, 234)",
            width: "50%",
            marginInline: "auto",
          }}
          onClick={clickSubmit}
        >
          Send Messagae
        </button>
      </div>
      <div className="contact-connect">
        <h3>Our Contact information</h3>
        <p>
          Fill the form and send message or contact us via channels listed below
        </p>
        <div className="contact-info">
          <p>
            <BsFillTelephoneFill />
            <span>&nbsp; 07084257895</span>
          </p>
          <p>
            <AiOutlineMail />
            <span>&nbsp;Support@inventapp</span>
          </p>
          <p>
            <FiMapPin />
            <span>&nbsp; UP, India</span>
          </p>
          <p>
            <AiOutlineTwitter />
            <span> &nbsp; @KpGroups</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
