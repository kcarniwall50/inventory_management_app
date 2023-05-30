import React, { useState } from "react";
import "./sidebar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaKickstarterK } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import menu from "./data/sidebarItemsArray";
import Item from "./Item";

const Sidebar = ({ children }) => {

  const [isExpanded, setIsExpanded] = useState(true);

  function menuClickHandler() {
    setIsExpanded((prev) => !prev);
  }

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="layout">
      <div className="sidebar" style={{ width: isExpanded ? "14%" : "4%" }}>
        <div className="sidebarTop">
          <FaKickstarterK
            onClick={goHome}
            size={isExpanded ? "20%" : "80%"}
            color="blue"
            style={{
              display: isExpanded ? "inline-flex" : "none",
              transitionDelay: "0s",
            }}
          />

          <GiHamburgerMenu
            size={isExpanded ? "20%" : "100%"}
            color="yellow"
            onClick={menuClickHandler}
            style={{
              marginLeft: isExpanded ? "0px" : "0px",
              transitionDelay: "0s",
            }}
          />
        </div>

        {menu.map((item, index) => {
          return (
            <Item
              key={index + 15}
              item={item}
              isExpanded={isExpanded}
              index={index}
            />
          );
        })}
      </div>

      <main
        className="sidebar-children"
        style={{
          left: isExpanded ? "14%" : "4%",
          width: isExpanded ? "86%" : "96%",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
