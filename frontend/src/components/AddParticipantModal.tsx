import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { ParticipantCreateInput, StudyGroup, ParticipantStatus, Gender } from '../types';
import { createParticipantApi } from '../api/participants';
import { ApiClientError } from '../api/client';

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<ParticipantCreateInput>({
    subject_id: '',
    study_group: 'treatment',
    enrollment_date: todayStr,
    status: 'active',
    age: 35,
    gender: 'F',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject_id.trim()) {
      newErrors.subject_id = 'Subject ID is required (e.g., P025).';
    } else if (formData.subject_id.length > 50) {
      newErrors.subject_id = 'Subject ID cannot exceed 50 characters.';
    }

    if (!formData.enrollment_date) {
      newErrors.enrollment_date = 'Enrollment date is required.';
    } else if (formData.enrollment_date > todayStr) {
      newErrors.enrollment_date = 'Enrollment date cannot be in the future.';
    }

    if (formData.age === undefined || formData.age === null || isNaN(formData.age)) {
      newErrors.age = 'Age is required.';
    } else if (formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Age must be between 0 and 120.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createParticipantApi({
        ...formData,
        subject_id: formData.subject_id.trim(),
        age: Number(formData.age),
      });
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setApiError(err.message);
        if (err.errors) {
          const fieldMap: Record<string, string> = {};
          err.errors.forEach((e) => {
            fieldMap[e.field] = e.message;
          });
          setErrors((prev) => ({ ...prev, ...fieldMap }));
        }
      } else {
        setApiError('An unexpected error occurred while saving participant.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Enroll New Participant</h3>
              <p className="text-xs text-slate-500">Add a verified trial candidate to the protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Subject ID */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Subject ID *
            </label>
            <input
              type="text"
              placeholder="e.g. P025"
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                errors.subject_id
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'
              }`}
            />
            {errors.subject_id && <p className="mt-1 text-xs text-rose-600">{errors.subject_id}</p>}
          </div>

          {/* Study Group & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Study Group *
              </label>
              <select
                value={formData.study_group}
                onChange={(e) => setFormData({ ...formData, study_group: e.target.value as StudyGroup })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="treatment">Treatment</option>
                <option value="control">Control</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ParticipantStatus })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Age (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.age
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                    : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'
                }`}
              />
              {errors.age && <p className="mt-1 text-xs text-rose-600">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="F">Female (F)</option>
                <option value="M">Male (M)</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Enrollment Date *
            </label>
            <input
              type="date"
              max={todayStr}
              value={formData.enrollment_date}
              onChange={(e) => setFormData({ ...formData, enrollment_date: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                errors.enrollment_date
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-300 focus:ring-sky-500 focus:border-sky-500'
              }`}
            />
            {errors.enrollment_date && (
              <p className="mt-1 text-xs text-rose-600">{errors.enrollment_date}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 shadow-xs transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Participant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
