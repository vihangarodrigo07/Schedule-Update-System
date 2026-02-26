import React, { useState } from 'react';
import { X, AlertTriangle, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { lectureAPI } from '../services/api';

const CancelLectureModal = ({ isOpen, onClose, lecture, onCancelled }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !lecture) return null;

  const handleCancel = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await lectureAPI.cancelLecture(lecture.id, reason);
      
      toast.success('Lecture cancelled successfully');
      
      if (onCancelled) {
        onCancelled(result.lecture);
      }
      
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to cancel lecture';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Cancel Lecture</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Lecture Details */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">{lecture.title}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Course:</span>
              <span className="ml-2 text-gray-900">{lecture.course_code}</span>
            </div>
            <div>
              <span className="text-gray-500">Room:</span>
              <span className="ml-2 text-gray-900">{lecture.room}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="ml-2 text-gray-900">{new Date(lecture.date).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Time:</span>
              <span className="ml-2 text-gray-900">{lecture.start_time} - {lecture.end_time}</span>
            </div>
          </div>
        </div>

        {/* Reason Input */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cancellation Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="Please provide a reason for cancelling this lecture..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            rows="4"
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Keep Lecture
          </button>
          <button
            onClick={handleCancel}
            disabled={loading || !reason.trim()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelLectureModal;