import { useState } from "react";
import { BookOpen, CalendarDays, Clock, MapPin } from "lucide-react";

export default function CreateLecture() {
  const [lectureName, setLectureName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hall, setHall] = useState("");
  const [batches, setBatches] = useState([]);

  const toggleBatch = (batch) => {
    if (batches.includes(batch)) {
      setBatches(batches.filter((b) => b !== batch));
    } else {
      setBatches([...batches, batch]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-8">
      
      {/* Header */}
      <div className="mb-8 w-full max-w-5xl">
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Lecture Schedule
          </h1>
        </div>
        <p className="text-gray-500 mt-2">
          Enter lecture details, assign hall and batches, then publish or save as draft.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-5xl mx-auto">
        
        {/* -------- LECTURE DETAILS -------- */}
        <h2 className="text-gray-600 font-semibold tracking-wide mb-6">
          LECTURE DETAILS
        </h2>

        {/* Lecture Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Lecture Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              placeholder="e.g. Software Engineering Fundamentals"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Lecture Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <hr className="mb-8" />

        {/* -------- ASSIGNMENT -------- */}
        <h2 className="text-gray-600 font-semibold tracking-wide mb-6">
          ASSIGNMENT
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Hall */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Lecture Hall <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a hall</option>
                <option value="Hall A">Hall A</option>
                <option value="Hall B">Hall B</option>
                <option value="Lab 1">Lab 1</option>
              </select>
            </div>
          </div>

          {/* Batches */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Student Batches <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4 border rounded-lg p-3">
              {["Y1S1", "Y1S2", "Y2S1", "Y2S2", "Y3S1"].map((batch) => (
                <label key={batch} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={batches.includes(batch)}
                    onChange={() => toggleBatch(batch)}
                    className="accent-blue-600"
                  />
                  {batch}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            Save as Draft
          </button>
          <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  );
}
