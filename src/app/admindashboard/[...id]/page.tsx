"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { ItemType } from "../../../type.d.ts";

const Page = () => {
  const { id } = useParams();
  const [fetchedData, setFetchedData] = useState<ItemType[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm,setshowForm] = useState<boolean>(false);
  const [commodity,setcommodidty] = useState<string>("")
  const [price,setprice] = useState<number>()
  const [stock,setstock] = useState<number>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ItemType[]>(`http://localhost:3001/item/get/${id[1]}`);
        console.log(res)
        setFetchedData(res.data);
        setLoader(true);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchData();
  }, [id,loader]);

  const addItem = async (e:any) => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:3001/item/create`,{name:commodity,price:price,stock:stock,creator:id[1]})
      .then(()=>{
        setLoader(false)
        setshowForm(false)
      })
      .catch(err=>console.log(err))
    } catch (error) {
      console.log("error while adding items")
    }
  }

  const handleDelete =async (id:string)=>{

    try {
      await axios.get(`http://localhost:3001/item/delete/${id}`)
      setLoader(false)
    } catch (error) {
      console.error("error while deleting item")
    }
  }

  if (error) {

    return (
      <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2>Left Container</h2>
      </div>
      <div className="flex w-3/4 h-screen justify-center items-center">Error: {error}</div>;
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <h2>Left Container</h2>
      </div>
      <div className="w-3/4 flex justify-center items-center">
        {loader ? (
          <div className="flex flex-col gap-6 w-4/5 overflow-x-auto">
          <div>
            {fetchedData.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200 text-center">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-center">Price</th>
                    <th className="py-2 px-4 border-b border-gray-200 text-center">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedData.map((item : ItemType) => (
                    <tr key={item._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b border-gray-200 text-center">{item.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200 text-center">{item.price}</td>
                      <td className="py-2 px-4 border-b border-gray-200 text-center">{item.stock}</td>
                      <div onClick={()=>handleDelete(item._id)} className="cursor-pointer">x</div>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No data found</div>
            )}
          </div>
          <div className="flex items-start justify-start cursor-pointer" onClick={()=>setshowForm(!showForm)}><span className="p-2 bg-green-500 rounded-lg">Add items</span></div>
          {showForm ?
            (<div>
              <form className="w-2/4 flex flex-col gap-3" onSubmit={addItem}>
                <div className="flex flex-col gap-2">
                  <label>Commodity</label>
                  <input type="text" placeholder="Enter commodity" className="p-2 border-2" onChange={(e:any)=>setcommodidty(e.target.value)}></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Price</label>
                  <input type="number" placeholder="Enter Price" className="p-2 border-2" onChange={(e:any)=>setprice(e.target.value)}></input>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Stock</label>
                  <input type="number" placeholder="Enter Stock" className="p-2 border-2" onChange={(e:any)=>setstock(e.target.value)}></input>
                </div>
                <div>
                  <input type="submit" className="p-2 bg-green-500 rounded-lg cursor-pointer"></input>
                </div>
              </form>
            </div>) : ""
          }
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Page;
