import React from "react";

interface MenuProps {
  onClickLogout: any
}

const Menu : React.FC<MenuProps> = ({onClickLogout}) => {
  return (
    <div
      className="bg-slate-400 shadow-2xl  rounded-lg p-1"
      style={{
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      }}
    >
      <ul>
        <li className="hover:bg-blue-400 rounded-lg cursor-pointer p-1" onClick={onClickLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Menu;
