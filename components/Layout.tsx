import React, { useState } from "react";
//import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Sidebar from "./Sidebar";
import NotificationIcon from "../assets/icons/notification.svg";
import SearchIcon from "../assets/icons/loupe.svg";
import UserContext, { initialvalue } from "../context/BookSpaceContext";
import { Button, Stack } from "@mui/material";
import Image from "next/image";
import type { Metadata,Viewport } from 'next'
import Head from 'next/head'
//import { useAuth } from "../context/AuthContext";
import MobileFooterMenu from "../pages/bookSpaces/compponents/MobileFooterMenu";
import { Provider } from "urql";
import urqlClient from "../services/urql.client";
import Notification from "./Notification";
import { signOut, useSession } from "next-auth/react";
import SignIn from "../pages/SignIn";
import Router from 'next/router';


export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Pix Room Web',
  description: 'Smart application to book meeting rooms and manage your meetings.',
}

const Layout = ({ children }: any) => {
  const { data: session } = useSession();
  if (session) {
     return (
      <Provider value={urqlClient}>
      <UserContext.Provider value={initialvalue}>
       <div className="xl:container xl:mx-auto 2xl:container 2xl:mx-auto block flex fullHeight mx-auto px-0 sm:px-0 md:px-8" style={{ maxWidth: "90rem" }}>
          <Sidebar />
          <div className="flex flex-1 w-full">
            <div className="w-full">
              <header className="w-full " style={{height: '60px'}}>
                <div className="h-16 p-4 flex items-center justify-end header-comp bg-white border" >
                  <div className="flex items-center justify-content-between" >
                    <div className="p-4">
                    <Notification />
                    </div>
                    <div>
                      <Image onClick={() => Router.push('/user/UserProfile?id=1')}
                        src={"/assets/images/userprofile.png"}
                        alt=""
                        width="50"
                        height="50"
                        style={{ cursor: 'pointer',transition:'transform 0.3s ease'}}
                      />{" "}
                    </div>
                    <div className="p-4">
                    <Button onClick={() => signOut({ callbackUrl: "/SignIn" })}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
              <div className="border" style={{  overflowY: 'scroll', height: 'calc(100% - 60px)' }}  >
                <div className="relative  p-4 h-full" style={{ filter: "drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161))" }}>
                  {children}
                </div>
              </div>
            </div>
          </div>
          <MobileFooterMenu />
        </div>
      </UserContext.Provider>
     </Provider>
    );
    }
  return (
    <>
      <SignIn></SignIn>
    </>
  );
};

export default Layout;
