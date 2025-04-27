import classNames from "classnames";
import React, { useMemo, useState } from "react";



import PixleKubeLogo from "../assets/icons/pixelkube-logo.svg";
import AdminApps from "../assets/icons/admin.svg";
import DashBoard from "../assets/icons/dashboard.svg";
import ConnectionManagement from "../assets/icons/connectormanagement.svg";
import thememanagement from "../assets/icons/themeoriginalicon.svg";  
import playlist from "../assets/icons/playlisticon.svg";
import SystemManagement from "../assets/icons/systemmanagement.svg";
import UserManagement from "../assets/icons/usermanagement.svg";
import SpaceManagement from "../assets/icons/spacemanagement.svg";

import ToggleIcon from "../assets/icons/toggle.svg";

import BookRoom from "../assets/icons/bookRoom.svg";
import BookDesk from "../assets/icons/bookDesk.svg";
import FindColleague from "../assets/icons/findCollegue.svg";
import ManageVisitor from "../assets/icons/manageVisitor.svg";
import BookParking from "../assets/icons/bookParking.svg";
import BookService from "../assets/icons/bookServices.svg";
import MyBookings from "../assets/icons/myBookings.svg";

import { display } from "@mui/system";

import SidebarItem from "./SidebarItem";

const Sidebar = () => {

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const menuItems = [
    {
      id: 0,
      label: "Admin Apps",
      icon: AdminApps,
      link: "",
      isGroupMenu: true,
      subMenu: [
        {
          id: 3,
          label: "Connector Management",
          icon: ConnectionManagement,
          link: "/connector",
        },
        {
          id: 4,
          label: "Space Management",
          icon: SpaceManagement,
          link: "/space",
        },
        {
          id: 10,
          label: "Service Management",
          icon: SpaceManagement,
          link: "/service",
        },
        {
          id: 5,
          label: "User Management",
          icon: UserManagement,
          link: "/user",
        },
        // { id: 6, label: "System Management", icon: SystemManagement, link: "/" },
        {
          id: 7,
          label: "Player Management",
          icon: SystemManagement,
          link: "/player",
        },
        {
          id: 8,
          label: "Playlist Management",
          icon: playlist,
          link: "/playlist",
        },
        {
          id: 9,
          label: "Theme Management",
          icon: thememanagement,
          link: "/theme",
        },
      ],
    },
    {
      id: 1,
      label: "Book Spaces",
      icon: SpaceManagement,
      link: "/bookSpaces/Dashboard",
      isGroupMenu: true,
      subMenu: [
        {
          id: 2,
          label: "Dashboard",
          icon: DashBoard,
          link: "/bookSpaces/Dashboard",
        },
        {
          id: 11,
          label: "Book Room",
          icon: BookRoom,
          link: "/bookSpaces/BookRoom",
        },
        {
          id: 12,
          label: "Book Desk",
          icon: BookDesk,
          link: "/bookSpaces/BookDesk",
        },
        {
          id: 13,
          label: "Find Colleague",
          icon: FindColleague,
          link: "/bookSpaces/FindColleague",
        },
        {
          id: 14,
          label: "Manage Visitor",
          icon: ManageVisitor,
          link: "/bookSpaces/ManageVisitor",
        },
        {
          id: 15,
          label: "Book Parking",
          icon: BookParking,
          link: "/bookSpaces/BookParking",
        },
        {
          id: 16,
          label: "Book Services",
          icon: BookService,
          link: "/bookSpaces/BookService",
        },
        {
          id: 17,
          label: "My Bookings",
          icon: MyBookings,
          link: "/bookSpaces/MyBookings",
        },
        {
          id: 18,
          label: "Questionnaire Master",
          icon: MyBookings,
          link: "/bookSpaces/QuestionnairesPage",
        },
        {
          id: 19,
          label: "Questionnaire Portal",
          icon: MyBookings,
          link: "/bookSpaces/VisitorPortal",
        },
        {
          id: 19,
          label: "Front Desk",
          icon: MyBookings,
          link: "/bookSpaces/FrontDesk",
        },
      ],
    },
  ];



  const wrapperclasses = classNames(
    "flex justify-between flex-col border bg-white h-full t-0 l-0 sidebar mobile-view-sidebar",
    {
      ["w-72 min-w-[18rem]"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );
  const collapseIconClasses = classNames(
     "p-0 mt-2.5 mr-1 bg-sky-200 absolute toggle-arrow bg-white mobile-view-sidebar-toggle",
    {
      ["rotate-180"]: toggleCollapse,
    }
  );

  const onMouseOver = () => {
    // setToggleCollapse(false)
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperclasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0 ,0, 1) 0s" }}
    >
      <div
        className="flex flex-col"
        style={{ overflowY: "clip", overflowX: "visible" }}
      >
        <div className="flex items-center justify-between relative">
          <div
            className="mainlogo flex items-center pl-2 pt-4 gap-4"
            style={{ margin: "auto" }} >
            <PixleKubeLogo />
            <button className={collapseIconClasses} onClick={handleSidebarToggle}>
              <ToggleIcon />
            </button>
          </div>
        </div>
        <div
          className="flex flex-col items-start mt-4"
          style={{ overflowY: "hidden" }}
        >
          <div style={{ overflowY: "auto", width: "100%" }}>
            {menuItems.map((item: any, i: number) => {
              return (
                <SidebarItem key={i} toggleCollapse={toggleCollapse} menu={item}></SidebarItem>
              );
            })}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Sidebar;
