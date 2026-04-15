import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import ProfileSections from './ProfileSections';
import { profileAPI } from '../services/api';
import { getCurrentUserId } from '../utils/auth';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const data = await profileAPI.getProfile(userId);
        setProfileData(data);
      } catch (err) {
        setError('Failed to load profile data');
        toast.error('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Dashboard</h1>
            <p className="text-gray-600 mt-2">
              View and manage your personal and academic information
            </p>
          </div>

          {/* Profile Content */}
          {profileData ? (
            <ProfileSections profileData={profileData} />
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Profile Data
                </h3>
                <p className="text-gray-500">
                  Unable to load profile information. Please try again later.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} Agile University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;