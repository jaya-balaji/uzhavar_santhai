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
                className='p-1'
            />
        </div>
    );
}

export default MyDatePicker;
