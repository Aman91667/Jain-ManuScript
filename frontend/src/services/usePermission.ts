import { useAuth } from '@/contexts/AuthContext';

export const usePermission = () => {
  const { user } = useAuth();

  const canAccessFull = (manuscriptType: 'normal' | 'detailed') => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (manuscriptType === 'normal') return true;
    return user.role === 'researcher' && user.isApproved;
  };

  const canEdit = (uploadedBy: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user._id === uploadedBy;
  };

  const canDelete = (uploadedBy: string) => {
    return canEdit(uploadedBy);
  };

  return {
    isAdmin: user?.role === 'admin',
    isResearcher: user?.role === 'researcher',
    isApprovedResearcher: user?.role === 'researcher' && user.isApproved,
    canAccessFull,
    canEdit,
    canDelete
  };
};