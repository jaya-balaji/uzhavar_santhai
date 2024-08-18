"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { ItemType } from "../../type.d.ts";
import type { counts } from "../../type.d.ts";
import { MdDashboard } from "react-icons/md";
import { FaShoppingBag } from "react-icons/fa";
import CalenderDate from "../Component/Calender";
import { AiOutlineStock } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import type { UserType } from "../../type.d.ts";

const Page = () => {
  const [fetchedData, setFetchedData] = useState<ItemType[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [Counts, setCounts] = useState<counts>();
  const [rowsPerPage, setrowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempRowsPerPage, settempRowsPerPage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStringDate, setselectedStringDate] = useState<string | null>(
    ""
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    ""
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [message, setmessage] = useState("No data found");
  const [UserData, setUserData] = useState<UserType | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("usertoken");
      const headers: Record<string, string | undefined> = {
        Authorization: `Bearer ${token}`,
        "X-Selected-Date": selectedStringDate || "",
        location: selectedLocation || "",
      };
      try {
        const res = await axios.get(`https://uzhavar-santhai-backend.vercel.app/userItem/get`, {
          headers,
        });
        res.data.message
          ? setmessage(res.data.message)
          : setmessage("No data found for the location");
        res.data.filteredItems
          ? setFetchedData(res.data.filteredItems)
          : setFetchedData(res.data);
        res.data.counts ? setCounts(res.data.counts) : "";
        setLoader(true);
      } catch (error: any) {
        setError(error.message);
      }
    };
    if (selectedLocation !== "") fetchData();
  }, [selectedLocation, selectedStringDate]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("usertoken");
      const headers: Record<string, string | undefined> = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const res = await axios.get(`https://uzhavar-santhai-backend.vercel.app/user/userdata`, {
          headers,
        });

        res.data ? setUserData(res.data) : "";
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchUserData();
  },[]);

  const currentData = (fetchedData || []).slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(fetchedData.length / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (location: string): void => {
    setSelectedLocation(location);
    setIsOpen(false); // Close the dropdown after selection
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
    setSelectedDate(date);
    if (date) {
      const selectedDate = new Date(date);

      const formattedDate = `${String(selectedDate.getDate()).padStart(
        2,
        "0"
      )}-${String(selectedDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${selectedDate.getFullYear()}`;

      setselectedStringDate(formattedDate);
    } else {
      setselectedStringDate("");
      console.log("No date selected");
    }
  };

  if (error) {
    return (
      <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-white">
        <div className="flex flex-col my-20 gap-6 pl-4 w-full ">
          <div className="w-[90%] flex flex-col p-3 items-center justify- gap-4">
            <span className="text-4xl font-bold">Warm welcome!!!</span>
            <div className="w-full">
              <span className="text-green-600 font-bold text-4xl">
                {" "}
                {UserData?.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <div className="w-[90%] flex flex-row p-3 items-center gap-2 bg-slate-200 rounded-xl">
              <span className="text-lg font-semibold p-2">
                Email:
              </span>
              <div className="flex-1 overflow-x-auto">
                <span className="text-green-600 font-bold text-lg break-words">
                  {UserData?.email}
                </span>
              </div>
            </div>
            <div className="w-[90%] flex flex-row p-3 items-center gap-2 bg-slate-200 rounded-xl">
              <span className="text-lg font-semibold">Phone :</span>
              <span className="text-green-600 font-bold text-lg">
                {" "}
                {UserData?.phone}
              </span>
            </div>
          </div>
        </div>
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
        <div className="flex flex-col my-20 gap-6 pl-4 w-full ">
          <div className="w-[90%] flex flex-col p-3 items-center justify- gap-4">
            <span className="text-4xl font-bold">Warm welcome!!!</span>
            <div className="w-full">
              <span className="text-green-600 font-bold text-4xl">
                {" "}
                {UserData?.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <div className="w-[90%] flex flex-row p-3 items-center gap-2 bg-slate-200 rounded-xl">
              <span className="text-lg font-semibold p-2">
                Email:
              </span>
              <div className="flex-1 overflow-x-auto">
                <span className="text-green-600 font-bold text-lg break-words">
                  {UserData?.email}
                </span>
              </div>
            </div>
            <div className="w-[90%] flex flex-row p-3 items-center gap-2 bg-slate-200 rounded-xl">
              <span className="text-lg font-semibold">Phone :</span>
              <span className="text-green-600 font-bold text-lg">
                {" "}
                {UserData?.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/4 flex flex-col overflow-y-scroll bg-slate-200 p-16 gap-8">
        <div className="flex flex-row gap-4 items-center justify-start">
          <div>
            <MdDashboard className="scale-[200%]" />
          </div>
          <div>
            <span className="text-2xl font-bold">User Dashboard</span>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="p-6 bg-violet-400 rounded-xl h-[27vh] w-1/3 shadow-md shadow-black">
            <div className="flex flex-col gap-5">
              <div className="pl-2 pt-1">
                <FaShoppingBag className="scale-[180%]" />
              </div>
              <div className="flex flex-col gap-2 justify-between">
                <span className="text-2xl font-semibold">Total Stock</span>
                <span className="text-5xl font-bold">
                  {Counts?.totalStock ? Counts?.totalStock : 0}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-blue-400 rounded-xl h-[27vh] w-1/3 shadow-md shadow-black">
            <div className="flex flex-col gap-3">
              <div className="pl-2">
                <AiOutlineStock className="scale-[150%] text-2xl" />
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-2xl font-semibold">Stock change</span>
                <span className="text-5xl font-bold">
                  {Counts?.SCpercentage ? Counts?.SCpercentage : 0}%
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-orange-300 rounded-xl h-[27vh] w-1/3 shadow-md shadow-black">
            <div className="flex flex-col gap-2">
              <div className="pl-2">
                <MdOutlineCategory className="scale-[150%] text-2xl" />
              </div>
              <div>
                <span className="text-2xl font-semibold">Categories </span>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-24 w-[70%]">
                  <span>Fruits</span>
                  <span className="font-semibold">
                    : {Counts?.fCount ? Counts?.fCount : 0}
                  </span>
                </div>
                <div className="flex flex-row gap-14 w-[70%]">
                  <span>Vegetables</span>
                  <span className="font-semibold">
                    : {Counts?.fCount ? Counts?.vCount : 0}
                  </span>
                </div>
                <div className="flex flex-row gap-3 w-[70%]">
                  <span>Leafy Vegetables</span>
                  <span className="font-semibold">
                    : {Counts?.fCount ? Counts?.lCount : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-[100%]">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-row items-center">
              <div className="flex items-center">
                <form className="flex flex-row gap-3">
                  <button
                    type="submit"
                    onClick={handleRowsPerPageChange}
                    className="text-base hover:scale-105 bg-yellow-300 p-1 px-2 rounded-lg"
                  >
                    Set rows
                  </button>
                  <input
                    type="number"
                    placeholder="Enter rows"
                    value={tempRowsPerPage}
                    onChange={(e: any) => settempRowsPerPage(e.target.value)}
                    className="focus:outline-blue-600  rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2"
                  />
                </form>
              </div>
              <div className="flex justify-center items-center">
                <CalenderDate
                  selectedDate={selectedDate}
                  setSelectedDate={handleDateChange}
                />
              </div>
              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <input
                  type="text"
                  placeholder="Select a location"
                  readOnly
                  value={selectedLocation || ""}
                  onClick={toggleDropdown}
                  className="inline-flex justify-center focus:outline-blue-600 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2"
                />
                {isOpen && (
                  <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {UserData?.location.map((location, index) => (
                        <label
                          key={index}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="location"
                            className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={selectedLocation === location}
                            onChange={() => handleCheckboxChange(location)}
                          />
                          <span>{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {fetchedData.length > 0 ? (
              <div>
                <div className="bg-white rounded-2xl">
                  <div className="flex border-b-2 rounded-t-2xl">
                    <div className="py-5 px-3 w-1/3 flex justify-center items-center">
                      Name
                    </div>
                    <div className="py-5 px-4 w-1/3 flex justify-center items-center gap-1">
                      <span>Price(Rs)</span>
                    </div>
                    <div className="py-5 px-4 w-1/3 flex justify-center items-center">
                      Stock(kg)
                    </div>
                  </div>
                  {currentData.map((item: ItemType) => (
                    <div
                      key={item.id}
                      className="flex items-center hover:bg-gray-100 border-b-2"
                    >
                      <div className="py-5 px-4 w-1/3 flex justify-center items-center overflow-x-auto">
                        {item.name}
                      </div>
                      <div className="py-5 px-4 w-1/3 flex justify-center items-center overflow-x-auto">
                        {item.price}
                      </div>
                      <div className="py-5 px-4 w-1/3 flex justify-center items-center overflow-x-auto">
                        {item.stock}
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
              <div>{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
