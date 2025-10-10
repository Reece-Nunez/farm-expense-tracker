import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlus, FaEnvelope, FaShieldAlt, FaCog, FaSearch, FaFilter, FaEllipsisV, FaCircle, FaTimes, FaClock, FaCrown, FaUser, FaEye } from 'react-icons/fa';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useFarm } from '../context/FarmContext';
import { getCurrentUser } from '../utils/getCurrentUser';
import toast from 'react-hot-toast';

const TeamPage = () => {
  const { 
    currentFarm, 
    userRole, 
    teamMembers, 
    pendingInvitations,
    loading,
    canManageTeam,
    canInviteMembers,
    inviteTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
    cancelInvitation,
    resendInvitation
  } = useFarm();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');


  const getRoleIcon = (role) => {
    const iconMap = {
      OWNER: FaCrown,
      ADMIN: FaShieldAlt,
      MANAGER: FaUser,
      EMPLOYEE: FaUsers,
      VIEWER: FaEye,
      CONTRACTOR: FaCog
    };
    return iconMap[role] || FaUsers;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      OWNER: 'text-purple-600 bg-purple-100',
      ADMIN: 'text-red-600 bg-red-100',
      MANAGER: 'text-blue-600 bg-blue-100',
      EMPLOYEE: 'text-green-600 bg-green-100',
      VIEWER: 'text-gray-600 bg-gray-100',
      CONTRACTOR: 'text-yellow-600 bg-yellow-100'
    };
    return colorMap[role] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      PENDING: FaClock,
      ACCEPTED: FaCircle,
      REJECTED: FaTimes,
      EXPIRED: FaTimes,
      CANCELLED: FaTimes
    };
    return iconMap[status] || FaClock;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING: 'text-yellow-600 bg-yellow-100',
      ACCEPTED: 'text-green-600 bg-green-100',
      REJECTED: 'text-red-600 bg-red-100',
      EXPIRED: 'text-gray-600 bg-gray-100',
      CANCELLED: 'text-gray-600 bg-gray-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleInviteMember = async (inviteData) => {
    try {
      await inviteTeamMember(inviteData);
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeTeamMember(memberId);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await updateTeamMemberRole(memberId, newRole);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const filteredTeam = teamMembers.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !selectedRole || member.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FaUsers className="h-8 w-8 text-indigo-600" />
                Team Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your farm team and permissions
              </p>
            </div>
            {canInviteMembers() && (
              <Button onClick={() => setShowInviteModal(true)}>
                <FaPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Roles</option>
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="CONTRACTOR">Contractor</option>
                </select>
              </div>
            </Card>

            {/* Team Members List */}
            <Card className="overflow-visible">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Team Members ({filteredTeam.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-visible">
                {filteredTeam.map((member) => {
                  const RoleIcon = getRoleIcon(member.role);
                  return (
                    <div key={member.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative overflow-visible">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {member.firstName} {member.lastName}
                              {/* TODO: Add user identification logic */}
                              {(member.userId === getCurrentUser()?.sub || member.id === 'current-user') && (
                                <span className="ml-2 text-sm text-gray-500">(You)</span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                                <RoleIcon className="h-3 w-3" />
                                {member.role.toLowerCase()}
                              </div>
                              <span className="text-xs text-gray-500">
                                Last seen: {formatLastSeen(member.lastLoginAt)}
                              </span>
                              {!member.isActive && (
                                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {canManageTeam() && (
                          <div className="flex items-center gap-2">
                            <TeamMemberActions
                              member={member}
                              onUpdateRole={handleUpdateRole}
                              onRemove={handleRemoveMember}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Invitations */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaEnvelope className="h-5 w-5" />
                Pending Invitations
              </h3>
              {pendingInvitations.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No pending invitations
                </p>
              ) : (
                <div className="space-y-3">
                  {pendingInvitations.map((invitation) => {
                    const StatusIcon = getStatusIcon(invitation.status);
                    return (
                      <div key={invitation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {invitation.email}
                          </span>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(invitation.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            {invitation.status.toLowerCase()}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p>Role: {invitation.role.toLowerCase()}</p>
                          <p>Invited by: {invitation.invitedByName}</p>
                          <p>Expires: {new Date(invitation.expiresAt).toLocaleDateString()}</p>
                        </div>
                        {canManageTeam() && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => resendInvitation(invitation.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Resend
                            </button>
                            <button
                              onClick={() => cancelInvitation(invitation.id)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Team Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Team Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Members</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{teamMembers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Members</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{teamMembers.filter(m => m.isActive).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending Invites</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{pendingInvitations.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <InviteMemberModal
          onClose={() => setShowInviteModal(false)}
          onSubmit={handleInviteMember}
        />
      )}
    </div>
  );
};

// Team Member Actions Dropdown Component
const TeamMemberActions = ({ member, onUpdateRole, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'EMPLOYEE', label: 'Employee' },
    { value: 'VIEWER', label: 'Viewer' },
    { value: 'CONTRACTOR', label: 'Contractor' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <FaEllipsisV className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]">
          <div className="py-2">
            <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
              Change Role
            </div>
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => {
                  onUpdateRole(member.id, role.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {role.label}
              </button>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={() => {
                onRemove(member.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Remove Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Invite Member Modal Component
const InviteMemberModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'EMPLOYEE',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'ADMIN', label: 'Admin', description: 'Can manage team and view/edit most data' },
    { value: 'MANAGER', label: 'Manager', description: 'Can view/edit operational data' },
    { value: 'EMPLOYEE', label: 'Employee', description: 'Can add expenses/income, view assigned data' },
    { value: 'VIEWER', label: 'Viewer', description: 'Read-only access to assigned data' },
    { value: 'CONTRACTOR', label: 'Contractor', description: 'Limited access to specific projects' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      setFormData({ email: '', role: 'EMPLOYEE', message: '' });
    } catch (error) {
      console.error('Error submitting invite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite Team Member
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {roles.find(r => r.value === formData.role)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Add a personal message to the invitation..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Send Invitation
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TeamPage;