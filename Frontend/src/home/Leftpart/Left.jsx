import React from "react";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";

function Left() {
  return (
    <div className="w-full  bg-gray-800 text-white rounded-xl">
      <Search />
      <div
        className=" flex-1  overflow-y-auto"
        style={{ minHeight: "calc(84vh - 10vh)" }}>
        <Users />
      </div>
      <Logout />
    </div>
  );
}

export default Left;
