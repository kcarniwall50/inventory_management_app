import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./item.css";

const Item = ({ item, isExpanded, index }) => {

  let color1='green'
  let color2='#2439f8'

  const [isChild, setIsChild] = useState(false);

  if (item.childrens) {
    return (
      <>
        <NavLink
          to={item.path}
          style={{
            color: isChild ? color1 :color2,
            textDecoration: "none",
          }}
          key={index + 10}
        >
          <div className="it" style={{ margin: "1rem 0" }}>
            {item.icon && (
              <span style={{ marginLeft: "0.3rem", size: "85" }}>
                {item.icon}
              </span>
            )}
            {isExpanded && (
              <>
                <span style={{ marginLeft: "10%", marginRight: "0.1rem" }}>
                  {item.title}
                </span>

                {isChild ? (
                  <span>
                    <MdKeyboardArrowDown
                      className="arrow-icon"
                      size="21"
                      onClick={() => setIsChild((prev) => !prev)}
                    />
                  </span>
                ) : (
                  <span>
                    <MdKeyboardArrowRight
                      className="arrow-icon"
                      size="21"
                      onClick={() => setIsChild((prev) => !prev)}
                    />
                  </span>
                )}
              </>
            )}
          </div>
        </NavLink>

        {isChild &&
          item.childrens.map((child, index) => {
            return (
              <NavLink
                to={child.path}
                style={({ isActive }) => ({
                  color: isActive ? color1 :color2,
                  textDecoration: "none",
                })}
              >
                <div style={{ margin: "1rem 0" }}>
                  {isChild && (
                    <span style={{ marginLeft: "5%" }}>{child.title}</span>
                  )}
                </div>
              </NavLink>
            );
          })}
      </>
    );
  } else {
    return (
      <NavLink
        key={index}
        to={item.path}
        style={({ isActive }) => ({
          color: isActive ? color1 :color2,
          textDecoration: "none",
        })}
      >
        <div className="it" style={{ margin: "1rem 0" }}>
          {item.icon && (
            <span style={{ marginLeft: "0.3rem" }}>{item.icon}</span>
          )}
          {isExpanded && (
            <span style={{ marginLeft: "10%" }}>{item.title}</span>
          )}
        </div>
      </NavLink>
    );
  }
};

export default Item;
