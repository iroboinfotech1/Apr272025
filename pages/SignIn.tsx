"use client";
import React from 'react';
import Layout from '../components/Layout';
import LogInLogo from "../assets/icons/Login.svg"
import { useSession, signIn, signOut } from "next-auth/react"
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';

const SignIn = () => {

    const { data: session } = useSession()
    const router = useRouter()
    if(session) {
        router.push('/connector')
    }
    return (
        <div className='text'>
             <header className="w-full " style={{height: '60px'}}>
                <div className='container' style={{width:"650px",height:"450px", margin:"auto", textAlign:"center"}}>
                    <LogInLogo style={{margin:"auto"}}/>
                    <div className="p-4 bg-white border">
                    <Button onClick={() => signIn('keycloak')}>Sign in</Button>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default SignIn;