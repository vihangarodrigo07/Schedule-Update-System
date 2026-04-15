import React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  BookOpen,
  GraduationCap,
  Home,
  Map,
  Globe,
  Hash,
  Calendar,
  Briefcase,
} from 'lucide-react';

const ProfileSections = ({ profileData }) => {
  if (!profileData) return null;

  // Format user type for display
  const userType = profileData.user_type?.toUpperCase() || 'STUDENT';
  const displayId = profileData.student_id || profileData.lecturer_id || 'N/A';

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="card">
        <div className="flex items-center">
          <div className="h-24 w-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {profileData.full_name}
            </h1>
            <div className="flex items-center mt-2">
              <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {userType}
              </div>
              <div className="ml-3 flex items-center text-gray-600">
                <Hash className="h-4 w-4 mr-1" />
                <span className="font-mono">{displayId}</span>
              </div>
            </div>
            <p className="text-gray-500 mt-2">{profileData.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.first_name || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label">Last Name</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.last_name || 'N/A'}
              </div>
            </div>
            <div className="col-span-2">
              <label className="label flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.email || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.phone_number || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label">NIC/Passport</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.nic_passport || 'N/A'}
              </div>
            </div>
            <div className="col-span-2">
              <label className="label">Gender</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="card">
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Academic Information
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label flex items-center">
                <GraduationCap className="h-4 w-4 mr-1" />
                Faculty
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.faculty || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                Department
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.department || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Batch ID
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.batch_id || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="card">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Address Information
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Address Line 1
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.address_line1 || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label flex items-center">
                <Map className="h-4 w-4 mr-1" />
                City
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.city || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label">District</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.district || 'N/A'}
              </div>
            </div>
            <div className="col-span-2">
              <label className="label flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Country
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.country || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Emergency Contact
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Contact Name</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.emergency_contact_name || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label">Relationship</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.relationship || 'N/A'}
              </div>
            </div>
            <div>
              <label className="label flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {profileData.emergency_contact_phone || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSections;