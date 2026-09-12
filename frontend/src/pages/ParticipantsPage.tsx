import React, { useEffect, useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Participant } from '../types';
import { getParticipantsApi } from '../api/participants';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { AddParticipantModal } from '../components/AddParticipantModal';
import { ParticipantDetailModal } from '../components/ParticipantDetailModal';

export const ParticipantsPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchParticipants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getParticipantsApi({
        status: statusFilter || undefined,
        study_group: groupFilter || undefined,
      });
      setParticipants(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load participants';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [statusFilter, groupFilter]);

  // Client-side search filtering by subject_id
  const filteredParticipants = useMemo(() => {
    if (!searchTerm.trim()) return participants;
    const term = searchTerm.toLowerCase().trim();
    return participants.filter((p) => p.subject_id.toLowerCase().includes(term));
  }, [participants, searchTerm]);

  const handleViewDetails = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setGroupFilter('');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            Trial Participants
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage subject enrollment, arm assignment, and protocol compliance
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Enroll Participant
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Subject ID (e.g., P001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by Status"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
          </div>

          {/* Study Group Filter */}
          <div className="sm:col-span-3">
            <div className="relative">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                aria-label="Filter by Study Group"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="">All Study Groups</option>
                <option value="treatment">Treatment</option>
                <option value="control">Control</option>
              </select>
            </div>
          </div>

          {/* Refresh / Reset */}
          <div className="sm:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Participants Content */}
      {isLoading ? (
        <LoadingSpinner message="Loading participant registry..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchParticipants} />
      ) : filteredParticipants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No participants found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter || groupFilter
              ? 'No records match the selected search or filter criteria.'
              : 'No participants have been registered in this clinical trial yet.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {searchTerm || statusFilter || groupFilter ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Enroll First Participant
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50/75 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">Subject ID</th>
                  <th scope="col" className="px-6 py-4">Study Group</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Demographics</th>
                  <th scope="col" className="px-6 py-4">Enrollment Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredParticipants.map((p) => (
                  <tr
                    key={p.participant_id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {p.subject_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge studyGroup={p.study_group} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs">
                      <span className="font-medium text-slate-800">{p.age} yrs</span> •{' '}
                      <StatusBadge gender={p.gender} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                      {p.enrollment_date}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing {filteredParticipants.length} of {participants.length} participants</span>
            <button
              onClick={fetchParticipants}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddParticipantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchParticipants()}
      />

      <ParticipantDetailModal
        participant={selectedParticipant}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedParticipant(null);
        }}
      />
    </div>
  );
};
