import { useNavigate } from "react-router-dom";
import { BookOpen, CalendarDays, Clock, Plus, Calendar } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 bg-gray-50 min-h-screen p-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to Agile University Schedule Management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Lectures" 
          value="0" 
          icon={<BookOpen />} 
          bg="bg-blue-100" 
          text="text-blue-600"
        />
        <StatCard 
          title="Published" 
          value="0" 
          icon={<CalendarDays />} 
          bg="bg-green-100" 
          text="text-green-600"
        />
        <StatCard 
          title="Drafts" 
          value="0" 
          icon={<Clock />} 
          bg="bg-orange-100" 
          text="text-orange-600"
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          icon={<Plus size={28} />}
          title="Create Lecture"
          description="Schedule a new lecture and assign halls & batches"
          onClick={() => navigate("/create-lecture")}
        />

        <ActionCard
          icon={<Calendar size={28} />}
          title="View Calendar"
          description="See all published lectures on the calendar"
          onClick={() => navigate("/calendar")}
        />
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({ title, value, icon, bg, text }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition">
      <div className={`p-4 rounded-xl ${bg} ${text}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      </div>
    </div>
  );
}

function ActionCard({ title, description, onClick, icon }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm p-10 cursor-pointer hover:shadow-md transition text-center"
    >
      <div className="flex justify-center mb-4">
        <div className="p-5 bg-blue-100 text-blue-600 rounded-full">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
