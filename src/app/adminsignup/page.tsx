import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex items-center justify-center h-[100vh] background">
      <form className="flex flex-col items-center justify-center gap-4 md:gap-8 bg-black p-10 md:p-16 rounded-3xl bg-opacity-70 md:w-[70vh]">
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="text" placeholder="Enter Name" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none "></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="text"  placeholder="Enter Location" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none"></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="number" placeholder="Enter Phone" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none"></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="email" placeholder="Enter Email" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none"></input>
        </div>
        <div className="flex flex-row gap-8 justify-between items-center">
          <input type="password" placeholder="Enter Password" className="rounded-sm p-1 md:p-2 md:w-[40vh] w-[25vh] outline-none flex items-center justify-center"></input>
        </div>
        <div className="text-white flex gap-2">
            <span className="text-sm md:text-base">Have an account ?</span>
            <button className="text-green-700 hover:underline text-sm md:text-base"><Link href="/adminlogin">login</Link></button>
        </div>
        <div className="flex items-center justify-center w-[100%] ">
          <button className="md:text-lg text-base md:font-medium text-white p-2 md:p-4 bg-green-700 rounded-2xl hover:scale-105 transition-transform ">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default page;

