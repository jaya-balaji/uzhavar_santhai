"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { ItemType } from "../../type.d.ts";
import type { counts } from "../../type.d.ts";
import { MdModeEdit } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CalenderDate from "../Component/Calender";
import { AiOutlineStock } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";



const Page = () => {
  const { id } = useParams();
  const [fetchedData, setFetchedData] = useState<ItemType[]>([]);
  const [itemData, setitemData] = useState<any | undefined>();
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setshowForm] = useState<boolean>(false);
  const [showUpdateForm, setshowUpdateForm] = useState<boolean>(false);
  const [Counts,setCounts] = useState<counts>()
  const [rowsPerPage, setrowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempRowsPerPage, settempRowsPerPage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStringDate, setselectedStringDate] = useState<string | null>('');

  const currentData = fetchedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(fetchedData.length / rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      const headers: Record<string, string | undefined> = {
        Authorization: `Bearer ${token}`,
        'X-Selected-Date': selectedStringDate || '',
      };
      try {
        const res = await axios.get(`http://localhost:3001/item/get`, {headers});
        res.data.filteredItems?setFetchedData(res.data.filteredItems):setFetchedData(res.data);
        res.data.counts?setCounts(res.data.counts):'';
        setLoader(true);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchData();
  }, [id, loader,selectedStringDate]);

  const getCurrentTime = ()=>{
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');     
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const year = now.getFullYear();                          
    const hours = String(now.getHours()).padStart(2, '0');   
    const minutes = String(now.getMinutes()).padStart(2, '0'); 
    
    const formattedTime = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedTime
  }

  const addItem = async (e: any) => {
    e.preventDefault();
    const date = getCurrentTime()
    const token = localStorage.getItem("token");
    try {
      const response = await axios
        .post(
          `http://localhost:3001/item/create`,
          {
            name: itemData.name,
            price: itemData.price,
            stock: itemData.stock,
            date:date    
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          setLoader(false);
          setshowForm(false);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("error while adding items");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.get(`http://localhost:3001/item/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: id,
        },
      });
      setLoader(false);
    } catch (error) {
      console.error("error while deleting item");
    }
  };

  const handleChange = async (item: ItemType) => {
    setitemData(item);
    setshowUpdateForm(!showUpdateForm);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setshowUpdateForm(false);
    const date = getCurrentTime()
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:3001/item/update`,
        {
          name: itemData.name,
          price: itemData.price,
          stock: itemData.stock,
          date:date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: itemData.id,
          },
        }
      );
      setLoader(false);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (e: any) => {
    e.preventDefault();
    const value = parseInt(tempRowsPerPage, 10);
    if (!isNaN(value) && value > 0) {
      setrowsPerPage(value);
    } else {
      setrowsPerPage(10);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    if (date) {
        const selectedDate = new Date(date);

        const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${selectedDate.getFullYear()}`;

        setselectedStringDate(formattedDate);
        console.log("Selected Date:", formattedDate);
    } else {
        setselectedStringDate(''); // or handle the null case as needed
        console.log("No date selected");
    }
};


  if (error) {
    return (
      <div className="flex h-screen">
        <div className="w-1/4 p-4 bg-gray-100">
          <h2>Left Container</h2>
        </div>
        <div className="flex w-3/4 h-screen justify-center items-center">
          Error: {error}
        </div>
        ;
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-white">
        <h2>Left Container</h2>
      </div>
      <div className="w-3/4 flex flex-col overflow-y-scroll bg-slate-100 p-16 gap-8">
        <div className="flex flex-row gap-4 items-center justify-start">
          <div>
            <MdDashboard className="scale-[200%]" />
          </div>
          <div>
            <span className="text-2xl font-bold">Admin Dashboard</span>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="p-6 bg-violet-400 rounded-xl h-[27vh] w-1/3">
            <div className="flex flex-col gap-5">
              <div className="pl-2 pt-1">
                <FaShoppingBag className="scale-[180%]" />
              </div>
              <div className="flex flex-col gap-2 justify-between">
                <span className="text-2xl font-semibold">Total Stock</span>
                <span className="text-5xl font-bold">{(Counts?.totalStock)?Counts?.totalStock:0}</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-blue-400 rounded-xl h-[27vh] w-1/3">
            <div className="flex flex-col gap-3">
              <div className="pl-2">
                <AiOutlineStock className="scale-[150%] text-2xl" />
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-2xl font-semibold">Stock change</span>
                <span className="text-5xl font-bold">{(Counts?.SCpercentage)?Counts?.SCpercentage:0}%</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-orange-300 rounded-xl h-[27vh] w-1/3">
            <div className="flex flex-col gap-2">
              <div className="pl-2">
                <MdOutlineCategory className="scale-[150%] text-2xl" />
              </div>
              <div>
                <span className="text-2xl font-semibold">Categories </span>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-24 w-[70%]">
                  <span>
                  Fruits
                </span>
                <span className="font-semibold">: {(Counts?.fCount)?Counts?.fCount:0}</span>
                </div>
                <div className="flex flex-row gap-14 w-[70%]">
                  <span>
                  Vegetables 
                </span>
                <span className="font-semibold">: {(Counts?.fCount)?Counts?.vCount:0}</span>
                </div>
                <div className="flex flex-row gap-3 w-[70%]">
                  <span>
                  Leafy Vegetables 
                </span>
                <span className="font-semibold">: {(Counts?.fCount)?Counts?.lCount:0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loader ? (
          <div className="flex flex-col gap-6 w-[100%]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex justify-start">
                  <span className="text-2xl font-semibold">Items</span>
                </div>
                <div className="flex items-center">
                  <form className="flex flex-row gap-3">
                    <button
                      type="submit"
                      onClick={handleRowsPerPageChange}
                      className="text-base hover:scale-105 bg-yellow-300 p-1 px-2 rounded-lg"
                    >
                      Items per page
                    </button>
                    <input
                      type="number"
                      placeholder="Enter rows"
                      value={tempRowsPerPage}
                      onChange={(e: any) => settempRowsPerPage(e.target.value)}
                      className="p-1 text-sm focus:outline-none"
                    />
                  </form>
                </div>
              </div>
              <div className="flex justify-between items-center">
              <span
                className="p-2 bg-green-500 rounded-lg cursor-pointer"
                onClick={() => setshowForm(!showForm)}
              >
                Add items
              </span>
              <CalenderDate selectedDate={selectedDate} setSelectedDate={handleDateChange}/>
            </div>
            {showForm ? (
              <div>
                <form className="w-2/4 flex flex-row gap-5" onSubmit={addItem}>
                  <div className="flex flex-col gap-2">
                    <label>Commodity</label>
                    <input
                      type="text"
                      placeholder="Enter commodity"
                      className="p-2 border-2"
                      onChange={(e: any) =>
                        setitemData({ ...itemData, name: e.target.value })
                      }
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Enter Price"
                      className="p-2 border-2"
                      onChange={(e: any) =>
                        setitemData({ ...itemData, price: e.target.value })
                      }
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Stock</label>
                    <input
                      type="number"
                      placeholder="Enter Stock"
                      className="p-2 border-2"
                      onChange={(e: any) =>
                        setitemData({ ...itemData, stock: e.target.value })
                      }
                    ></input>
                  </div>
                  <div className="flex items-end justify-center">
                    <input
                      type="submit"
                      className="p-2 bg-green-500 rounded-lg cursor-pointer"
                    ></input>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}
            {showUpdateForm ? (
              <div>
                <form
                  className="w-2/4 flex flex-row gap-5"
                  onSubmit={handleUpdate}
                >
                  <div className="flex flex-col gap-2">
                    <label>Commodity</label>
                    <input
                      type="text"
                      placeholder="Enter commodity"
                      className="p-2 border-2"
                      value={itemData?.name}
                      onChange={(e: any) =>
                        setitemData({ ...itemData, name: e.target.value })
                      }
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Enter Price"
                      className="p-2 border-2"
                      value={itemData?.price}
                      onChange={(e: any) =>
                        setitemData({ ...itemData, price: e.target.value })
                      }
                    ></input>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Stock</label>
                    <input
                      type="number"
                      placeholder="Enter Stock"
                      className="p-2 border-2"
                      value={itemData?.stock}
                      onChange={(e: any) =>
                        setitemData({ ...itemData, stock: e.target.value })
                      }
                    ></input>
                  </div>
                  <div className="flex items-end justify-center">
                    <button
                      type="submit"
                      className="p-2 bg-green-500 rounded-lg cursor-pointer"
                    >
                      <span>Update</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              ""
            )}
              {fetchedData.length > 0 ? (
                <div>
                  <div className="bg-white rounded-2xl">
                    <div className="flex border-b-2 rounded-t-2xl">
                      <div className="py-5 px-3 w-1/4 flex justify-center items-center">Name</div>
                      <div className="py-5 px-4 w-1/4 flex justify-center items-center gap-1">
                        <span>Price(Rs)</span>
                      </div>
                      <div className="py-5 px-4 w-1/4 flex justify-center items-center">Stock(kg)</div>
                      <div className="py-5 px-4 w-1/4 flex justify-center items-center">Actions</div>
                    </div>

                    {currentData.map((item: ItemType) => (
                      <div
                        key={item.id}
                        className="flex items-center hover:bg-gray-100 border-b-2"
                      >
                        <div className="py-5 px-4 w-1/4 flex justify-center items-center overflow-x-auto">
                          {item.name}
                        </div>
                        <div className="py-5 px-4 w-1/4 flex justify-center items-center overflow-x-auto">
                          {item.price}
                        </div>
                        <div className="py-5 px-4 w-1/4 flex justify-center items-center overflow-x-auto">
                          {item.stock}
                        </div>
                        <div className="px-4 w-1/4 flex justify-center gap-6">
                          <div
                            onClick={() => handleDelete(item.id)}
                            className="hover:bg-slate-300 cursor-pointer p-2 rounded-xl"
                          >
                            <MdDelete className="scale-[150%] text-red-500" />
                          </div>
                          <div
                            onClick={() => handleChange(item)}
                            className="hover:bg-slate-300 cursor-pointer p-2 rounded-xl"
                          >
                            <MdModeEdit className="scale-[150%]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500 border-blue-500"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>No data found</div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
