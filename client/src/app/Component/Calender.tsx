import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface MyDatePickerProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({ selectedDate, setSelectedDate }) => {
    return (
        <div>
            <label>Select Date: </label>
            <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText='Date'
                className='focus:outline-blue-600  rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2'
            />
        </div>
    );
}

export default MyDatePicker;
