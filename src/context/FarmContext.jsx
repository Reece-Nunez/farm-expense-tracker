import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from '../utils/getCurrentUser';
import { listFarms, getFarm, teamMembersByFarm, teamInvitationsByFarm } from '../graphql/teamQueries';
import { createFarm, updateFarm, createTeamMember, updateTeamMember, deleteTeamMember, createTeamInvitation, updateTeamInvitation } from '../graphql/teamMutations';
import { updateUser, createUser } from '../graphql/mutations';
import toast from 'react-hot-toast';

const FarmContext = createContext();

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

export const FarmProvider = ({ children }) => {
  const [currentFarm, setCurrentFarm] = useState(null);
  const [farms, setFarms] = useState([]);
  const [userRole, setUserRole] = useState('VIEWER');
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  useEffect(() => {
    initializeFarmData();
  }, []);

  const initializeFarmData = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      // Load user's farms and set default
      await loadUserFarms(user);
    } catch (error) {
      console.error('Error initializing farm data:', error);
      toast.error('Failed to load farm data');
    } finally {
      setLoading(false);
    }
  };

  const loadUserFarms = async (user) => {
    try {
      const client = generateClient();
      
      // First, try to get existing farms owned by this user
      const existingFarms = await client.graphql({
        query: listFarms,
        variables: {
          filter: {
            ownerSub: { eq: user.sub }
          }
        }
      });

      let farms = existingFarms.data.listFarms.items;
      let currentUserFarm = null;

      // If no farms exist, create one for the user
      if (farms.length === 0) {
        const farmInput = {
          ownerSub: user.sub,
          name: user.farmName || `${user.username || 'My'} Farm`,
          farmType: 'MIXED',
          description: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US',
          acres: 0,
          establishedYear: new Date().getFullYear(),
          website: '',
          businessRegistration: '',
          taxId: '',
          phoneNumber: user.phone || '',
          email: user.email || '',
          isActive: true
        };

        const newFarmResult = await client.graphql({
          query: createFarm,
          variables: {
            input: farmInput
          }
        });

        currentUserFarm = newFarmResult.data.createFarm;
        farms = [currentUserFarm];
      } else {
        currentUserFarm = farms[0]; // Use the first farm found
      }

      // Add role information (user is always OWNER of their own farms)
      const farmsWithRole = farms.map(farm => ({
        ...farm,
        role: 'OWNER'
      }));

      setFarms(farmsWithRole);
      setCurrentFarm({ ...currentUserFarm, role: 'OWNER' });
      setUserRole('OWNER');
      await loadTeamMembers(currentUserFarm.id);
      await loadPendingInvitations(currentUserFarm.id);
    } catch (error) {
      console.error('Error loading farms:', error);
      throw error;
    }
  };

  const loadTeamMembers = async (farmId) => {
    try {
      const client = generateClient();
      const user = await getCurrentUser();
      
      // Fetch real team members from the database
      const teamMembersResult = await client.graphql({
        query: teamMembersByFarm,
        variables: {
          farmID: farmId,
          filter: {
            isActive: { eq: true }
          }
        }
      });

      let teamMembers = teamMembersResult.data.teamMembersByFarm.items;
      
      // If no team members exist, create one for the current user (farm owner)
      if (teamMembers.length === 0 && user) {
        const ownerMemberInput = {
          farmID: farmId,
          userID: user.id,
          userSub: user.sub,
          role: 'OWNER',
          permissions: ['ALL'],
          isActive: true,
          joinedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          invitedBy: user.sub,
          notes: 'Farm Owner'
        };

        const newMemberResult = await client.graphql({
          query: createTeamMember,
          variables: {
            input: ownerMemberInput
          }
        });

        teamMembers = [newMemberResult.data.createTeamMember];
      }

      // Transform the data to match the expected format for the UI
      const transformedMembers = teamMembers.map(member => ({
        id: member.id,
        farmId: member.farmID,
        userId: member.userID || member.userSub,
        userSub: member.userSub,
        email: member.user?.email || user?.email || '',
        firstName: member.user?.firstName || user?.firstName || user?.username?.split(' ')[0] || 'User',
        lastName: member.user?.lastName || user?.lastName || user?.username?.split(' ')[1] || '',
        role: member.role,
        permissions: member.permissions,
        isActive: member.isActive,
        joinedAt: member.joinedAt,
        lastLoginAt: member.lastLoginAt,
        invitedBy: member.invitedBy,
        notes: member.notes
      }));

      console.log('Loading team members from database:', transformedMembers);
      setTeamMembers(transformedMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
      // If there's an error, set empty array instead of showing mock data
      setTeamMembers([]);
    }
  };

  const loadPendingInvitations = async (farmId) => {
    try {
      const client = generateClient();
      
      // Fetch pending invitations from the database
      const invitationsResult = await client.graphql({
        query: teamInvitationsByFarm,
        variables: {
          farmID: farmId,
          filter: {
            status: { eq: 'PENDING' }
          }
        }
      });

      const invitations = invitationsResult.data.teamInvitationsByFarm.items;
      console.log('Loading pending invitations from database:', invitations);
      setPendingInvitations(invitations);
    } catch (error) {
      console.error('Error loading pending invitations:', error);
      setPendingInvitations([]);
    }
  };

  const switchFarm = async (farm) => {
    try {
      setLoading(true);
      setCurrentFarm(farm);
      
      // Update user role for the selected farm
      setUserRole(farm.role);
      
      // Load team members for the new farm
      await loadTeamMembers(farm.id);
      await loadPendingInvitations(farm.id);
      
      // TODO: Update user's current farm in the database
      console.log('Switched to farm:', farm.name);
      
      toast.success(`Switched to ${farm.name}`);
    } catch (error) {
      console.error('Error switching farm:', error);
      toast.error('Failed to switch farm');
    } finally {
      setLoading(false);
    }
  };

  const createFarmAction = async (farmData) => {
    try {
      const client = generateClient();
      const user = await getCurrentUser();
      
      const farmInput = {
        ownerSub: user.sub,
        name: farmData.name,
        farmType: farmData.farmType || 'MIXED',
        description: farmData.description || '',
        address: farmData.address || '',
        city: farmData.city || '',
        state: farmData.state || '',
        zipCode: farmData.zipCode || '',
        country: farmData.country || 'US',
        acres: farmData.acres || 0,
        establishedYear: farmData.establishedYear || new Date().getFullYear(),
        website: farmData.website || '',
        businessRegistration: farmData.businessRegistration || '',
        taxId: farmData.taxId || '',
        phoneNumber: farmData.phoneNumber || '',
        email: farmData.email || user.email || '',
        isActive: true
      };

      const newFarmResult = await client.graphql({
        query: createFarm,
        variables: {
          input: farmInput
        }
      });

      const newFarm = { ...newFarmResult.data.createFarm, role: 'OWNER' };
      setFarms(prev => [...prev, newFarm]);
      await switchFarm(newFarm);
      
      toast.success('Farm created successfully!');
      return newFarm;
    } catch (error) {
      console.error('Error creating farm:', error);
      toast.error('Failed to create farm');
      throw error;
    }
  };

  const updateFarmAction = async (farmId, updates) => {
    try {
      const client = generateClient();
      
      // Update local state first for immediate UI feedback
      setFarms(prev => prev.map(farm => 
        farm.id === farmId ? { ...farm, ...updates } : farm
      ));
      
      if (currentFarm?.id === farmId) {
        setCurrentFarm(prev => ({ ...prev, ...updates }));
      }

      // Update the farm in the database
      const updateInput = {
        id: farmId,
        ...updates
      };

      await client.graphql({
        query: updateFarm,
        variables: {
          input: updateInput
        }
      });
      
      toast.success('Farm updated successfully!');
    } catch (error) {
      console.error('Error updating farm:', error);
      toast.error('Failed to update farm');
      throw error;
    }
  };

  const inviteTeamMember = async (inviteData) => {
    try {
      if (!currentFarm) throw new Error('No farm selected');
      
      const client = generateClient();
      const user = await getCurrentUser();
      
      const invitationInput = {
        farmID: currentFarm.id,
        email: inviteData.email,
        role: inviteData.role,
        status: 'PENDING',
        invitedByUserSub: user.sub,
        invitedByName: user.username || user.firstName || 'Farm Owner',
        message: inviteData.message || `You have been invited to join ${currentFarm.name}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const invitationResult = await client.graphql({
        query: createTeamInvitation,
        variables: {
          input: invitationInput
        }
      });
      
      // Refresh the pending invitations list
      await loadPendingInvitations(currentFarm.id);
      
      toast.success(`Invitation sent to ${inviteData.email}`);
      return invitationResult.data.createTeamInvitation;
    } catch (error) {
      console.error('Error inviting team member:', error);
      toast.error('Failed to send invitation');
      throw error;
    }
  };

  const updateTeamMemberRole = async (memberId, newRole) => {
    try {
      const client = generateClient();
      
      // Update local state first for immediate UI feedback
      setTeamMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));

      // Update the team member in the database
      await client.graphql({
        query: updateTeamMember,
        variables: {
          input: {
            id: memberId,
            role: newRole
          }
        }
      });
      
      toast.success('Team member role updated successfully!');
    } catch (error) {
      console.error('Error updating team member role:', error);
      toast.error('Failed to update team member role');
      throw error;
    }
  };

  const removeTeamMember = async (memberId) => {
    try {
      const client = generateClient();
      
      // Update local state first for immediate UI feedback
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));

      // Delete the team member from the database
      await client.graphql({
        query: deleteTeamMember,
        variables: {
          input: {
            id: memberId
          }
        }
      });
      
      toast.success('Team member removed successfully!');
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error('Failed to remove team member');
      throw error;
    }
  };

  const cancelInvitation = async (invitationId) => {
    try {
      const client = generateClient();
      
      // Update the invitation status to CANCELLED
      await client.graphql({
        query: updateTeamInvitation,
        variables: {
          input: {
            id: invitationId,
            status: 'CANCELLED'
          }
        }
      });
      
      // Refresh the pending invitations list
      await loadPendingInvitations(currentFarm.id);
      
      toast.success('Invitation cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
      throw error;
    }
  };

  const resendInvitation = async (invitationId) => {
    try {
      const client = generateClient();
      
      // Update the invitation with a new expiry date
      const newExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      
      await client.graphql({
        query: updateTeamInvitation,
        variables: {
          input: {
            id: invitationId,
            expiresAt: newExpiryDate,
            status: 'PENDING'
          }
        }
      });
      
      // Refresh the pending invitations list
      await loadPendingInvitations(currentFarm.id);
      
      toast.success('Invitation resent successfully!');
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Failed to resend invitation');
      throw error;
    }
  };

  // Permission checking utilities
  const hasPermission = (permission) => {
    const rolePermissions = {
      OWNER: ['ALL'],
      ADMIN: [
        'VIEW_EXPENSES', 'CREATE_EXPENSES', 'EDIT_EXPENSES', 'DELETE_EXPENSES',
        'VIEW_INCOME', 'CREATE_INCOME', 'EDIT_INCOME', 'DELETE_INCOME',
        'VIEW_INVENTORY', 'CREATE_INVENTORY', 'EDIT_INVENTORY', 'MANAGE_STOCK',
        'VIEW_CUSTOMERS', 'CREATE_CUSTOMERS', 'EDIT_CUSTOMERS',
        'VIEW_INVOICES', 'CREATE_INVOICES', 'EDIT_INVOICES',
        'VIEW_TEAM', 'INVITE_MEMBERS', 'EDIT_MEMBERS', 'MANAGE_ROLES',
        'VIEW_FARM_SETTINGS', 'EDIT_FARM_SETTINGS',
        'VIEW_BASIC_REPORTS', 'VIEW_ADVANCED_REPORTS', 'EXPORT_DATA'
      ],
      MANAGER: [
        'VIEW_EXPENSES', 'CREATE_EXPENSES', 'EDIT_EXPENSES',
        'VIEW_INCOME', 'CREATE_INCOME', 'EDIT_INCOME',
        'VIEW_INVENTORY', 'CREATE_INVENTORY', 'EDIT_INVENTORY', 'MANAGE_STOCK',
        'VIEW_CUSTOMERS', 'CREATE_CUSTOMERS', 'EDIT_CUSTOMERS',
        'VIEW_INVOICES', 'CREATE_INVOICES', 'EDIT_INVOICES',
        'VIEW_TEAM', 'INVITE_MEMBERS',
        'VIEW_BASIC_REPORTS', 'EXPORT_DATA'
      ],
      EMPLOYEE: [
        'VIEW_EXPENSES', 'CREATE_EXPENSES',
        'VIEW_INCOME', 'CREATE_INCOME',
        'VIEW_INVENTORY',
        'VIEW_CUSTOMERS',
        'VIEW_BASIC_REPORTS'
      ],
      VIEWER: [
        'VIEW_EXPENSES', 'VIEW_INCOME', 'VIEW_INVENTORY', 'VIEW_CUSTOMERS', 'VIEW_BASIC_REPORTS'
      ],
      CONTRACTOR: [
        'VIEW_EXPENSES', 'CREATE_EXPENSES', 'VIEW_BASIC_REPORTS'
      ]
    };

    const userPermissions = rolePermissions[userRole] || [];
    return userPermissions.includes('ALL') || userPermissions.includes(permission);
  };

  const canManageTeam = () => hasPermission('MANAGE_ROLES');
  const canInviteMembers = () => hasPermission('INVITE_MEMBERS');
  const canEditFarmSettings = () => hasPermission('EDIT_FARM_SETTINGS');
  const canViewAdvancedReports = () => hasPermission('VIEW_ADVANCED_REPORTS');

  const value = {
    // State
    currentFarm,
    farms,
    userRole,
    loading,
    teamMembers,
    pendingInvitations,
    
    // Actions
    switchFarm,
    createFarm: createFarmAction,
    updateFarm: updateFarmAction,
    inviteTeamMember,
    updateTeamMemberRole,
    removeTeamMember,
    cancelInvitation,
    resendInvitation,
    
    // Utilities
    hasPermission,
    canManageTeam,
    canInviteMembers,
    canEditFarmSettings,
    canViewAdvancedReports
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};

export default FarmContext;