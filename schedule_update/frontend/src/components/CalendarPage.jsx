import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

// Single Calendar Component
function Calendar({ calendar, currentDate, onSelectDate, selectedDate, showEvents = true }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">{calendar.name}</h2>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => day && onSelectDate(day)}
            className="h-20 border cursor-pointer relative hover:bg-gray-50 p-1"
          >
            {day && (
              <span
                className={`absolute top-1 left-1 text-sm ${
                  selectedDate?.day === day
                    ? `bg-${calendar.color}-600 text-white rounded-full w-6 h-6 flex items-center justify-center`
                    : "text-gray-700"
                }`}
              >
                {day}
              </span>
            )}

            {/* Show events */}
            {showEvents && day && calendar.events[day] && (
              <div className="mt-6 flex flex-col gap-0.5 overflow-y-auto max-h-16">
                {calendar.events[day].map((event, i) => (
                  <div
                    key={i}
                    className={`text-xs px-1 rounded text-white bg-${calendar.color}-400`}
                  >
                    {event}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Calendar App
export default function MyCalendars() {
  const initialCalendars = {
    lecture: {
      name: "Lecture Schedule",
      color: "blue",
      events: {
        3: ["Math 101", "Physics 101"],
        5: ["Chemistry Lab"],
        12: ["Computer Science Lecture"],
      },
    },
    personal: {
      name: "Personal Calendar",
      color: "green",
      events: {
        2: ["Buy books"],
        14: ["Gym session"],
      },
    },
    working: {
      name: "Working Calendar",
      color: "orange",
      events: {
        4: ["Team meeting"],
        10: ["Project deadline"],
      },
    },
  };

  const [calendars] = useState(initialCalendars);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({});
  const [focusedCalendar, setFocusedCalendar] = useState(null); // null = show all
  const [showModal, setShowModal] = useState(false);

  const prevMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleSelectDate = (calendarKey, day) => {
    setSelectedDates((prev) => ({
      ...prev,
      [calendarKey]: { day, events: calendars[calendarKey].events[day] || [] },
    }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays /> My Calendars
        </h1>

        <div className="flex gap-2">
          {Object.keys(calendars).map((key) => (
            <button
              key={key}
              onClick={() => {
                setFocusedCalendar(key);
                setShowModal(true);
              }}
              className="px-3 py-1 rounded bg-white shadow-sm hover:bg-gray-100"
            >
              {calendars[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-center items-center gap-4 mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-medium">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* All Calendars */}
      {!showModal && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(calendars).map((key) => (
            <Calendar
              key={key}
              calendar={calendars[key]}
              currentDate={currentDate}
              selectedDate={selectedDates[key]}
              onSelectDate={(day) => handleSelectDate(key, day)}
            />
          ))}
        </div>
      )}

      {/* Modal for focused calendar */}
      {showModal && focusedCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-3xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <Calendar
              calendar={calendars[focusedCalendar]}
              currentDate={currentDate}
              selectedDate={selectedDates[focusedCalendar]}
              onSelectDate={(day) => handleSelectDate(focusedCalendar, day)}
              showEvents={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
