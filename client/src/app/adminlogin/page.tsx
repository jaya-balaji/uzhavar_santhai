"use client"
import React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter()

  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const [showerr,setshowerr] = useState(false)

  const login = async (e : any) =>{
    e.preventDefault()
     await axios.post('https://uzhavar-santhai-backend.vercel.app/admin/authAdminData',{email:email,password:password}) 
    .then(res => {
      localStorage.setItem('token',res.data.id)
      if(!res.data.err){
          router.push(`/adminboard`);
        } else{
          console.log("Invalid Credential")
        }
    })
    .catch(err => console.log(err))
  }

  return (

    <div className="flex items-center justify-center h-[100vh] background">
      <form className="flex flex-col items-center justify-center gap-4 md:gap-8 bg-black p-10 md:p-16 rounded-3xl bg-opacity-70 md:w-[70vh]">
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="email" placeholder="Enter Email" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none" onChange={(e)=>setemail(e.target.value)}></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="password" placeholder="Enter Password" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none flex items-center justify-center" onChange={(e)=>setpassword(e.target.value)}></input>
        </div>
        <div className="flex items-center justify-center w-[100%] ">
          <button className="md:text-lg text-base md:font-medium text-white p-2 md:p-4 bg-green-700 rounded-2xl hover:scale-105 transition-transform " onClick={login}>Log in</button>
        </div>
      </form>
    </div>
  );
};

export default page;


