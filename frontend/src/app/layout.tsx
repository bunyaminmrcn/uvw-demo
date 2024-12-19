'use client';
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { RootState, store } from '@/rtk/store';
import { Author } from "@/models/author";

import Cookie from 'js-cookie';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { useDispatch } from 'react-redux';
import { setAuth ,setToken, setAuthOp} from '@/rtk/slices/authSlice';
import { Toaster } from "@/components/ui/toaster"
const  NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export async function getMe(token: string): Promise<Author | null> {


  // Optionally, you can fetch the user data with this token using your Express backend
  let user = null;
  if (token) {
    const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      user = data.data;
    }
  }

  // Pass the token and user data to the page props
  return user;
}


export function App({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { isAuthenticated, token: localToken, setOK } = useSelector((state: RootState) => state.auth);
  const [called, setCalled] = useState(false)
  const authState = async () => {
    const token = Cookie.get('token') || localStorage.getItem('token');
    const user = await getMe(token as string);
    dispatch(setAuthOp());
    if(user) {
      console.log("user set")
      dispatch(setAuth({ user }));
      dispatch(setToken({ token: token as string }));
      setCalled(true)
    } else {
      console.log("no user set")
    }
  }

  useEffect(() => {
    console.log({ msg : 'call'})
    authState()
  }, [])

  useEffect(()=> {
    if(!setOK) {
      console.log("Reset Called")
      setCalled(prev => false);
    }
  }, [setOK])
  useEffect(() => {
    if(isAuthenticated && !called) {
      //alert("CALLED")
      console.log({ msg : 'auth call'})
      authState()
    } else {
      console.log({ isAuthenticated, called})
    }
  }, [isAuthenticated, called])

  return <>{children}</>
}
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider store={store}>
          <App>
            {children}
          </App>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
