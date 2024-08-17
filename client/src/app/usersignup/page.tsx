"use client"
import React from "react";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const page = () => {
  const router = useRouter()
  const [name,setname] = useState("")
  const [phone,setphone] = useState("")
  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")

  const handleSubmit= (e: any) => {
    e.preventDefault()
    axios.post('http://localhost:3001/user/register',{name,phone,email,password})
    .then(res => {
          router.push(`/userlogin`);
    })
    .catch(err => console.log(err))
  }
  return (
    <div className="flex items-center justify-center h-[100vh] background">
      <form className="flex flex-col items-center justify-center gap-4 md:gap-8 bg-black p-10 md:p-16 rounded-3xl bg-opacity-70 md:w-[70vh]">
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="text" placeholder="Enter Name" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none small-placeholder " onChange={(e)=>setname(e.target.value)}></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="number" placeholder="Enter Phone" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none" onChange={(e)=>setphone(e.target.value)}></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="email" placeholder="Enter Email" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none" onChange={(e)=>setemail(e.target.value)}></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="password" placeholder="Enter Password" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none flex items-center justify-center" onChange={(e)=>setpassword(e.target.value)}></input>
        </div>
        <div className="text-white flex gap-2">
            <span className="text-sm md:text-base">Have an account ?</span>
            <button className="text-green-700 hover:underline text-sm md:text-base"><Link href="/userlogin">login</Link></button>
        </div>
        <div className="flex items-center justify-center w-[100%] ">
          <button type="submit" className="md:text-lg text-base md:font-medium text-white p-2 md:p-4 bg-green-700 rounded-2xl hover:scale-105 transition-transform " onClick={handleSubmit}>Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default page;
