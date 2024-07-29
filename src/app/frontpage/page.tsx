import React from 'react';
import Link from 'next/link';

const FrontPage = () => {
  return (
    <div className='flex flex-col gap-16  md:gap-28 justify-center items-center h-[100vh]'>
        <div className='px-8 flex items-center justify-center'>
            <span className=' md:text-5xl text-4xl font-semibold text-wrap'>Welcome to <span className='text-green-500'>farmer's friend</span></span>
        </div>
        <div className='flex flex-col w-[40vh] md:flex-row justify-center items-center md:h-[20vh] md:w-[90vh] bg-slate-200 rounded-3xl'>
            <div className='flex w-[80%] md:w-[50%] justify-center items-center md:p-8 p-4 border-b-[2px] border-r-[0px] md:border-b-[0px] md:border-r-[3px] border-slate-400'>
                <Link href="/usersignup" className='md:p-4 p-2 w-[20vh] flex items-center justify-center md:w-[80%] text-white text-lg font-medium bg-green-500 rounded-lg hover:scale-105 transition-transform'><button >User</button></Link>            </div>
            <div className='flex md:w-[50%] justify-center items-center md:p-8 p-4 '>
                <Link href="/adminsignup" className='md:p-4 p-2 w-[20vh] flex items-center justify-center md:w-[80%] text-white text-lg font-medium bg-green-500 rounded-lg hover:scale-105 transition-transform'><button >Admin</button></Link>
            </div>
        </div>
    </div>
  );
}

export default FrontPage;
