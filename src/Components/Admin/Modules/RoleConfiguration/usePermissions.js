import { useMemo } from 'react';
import { useGetUserPermissionsQuery } from '../../../../State-Management/Api/PermissionsApiSlice';

/**
 * Custom hook to check user permissions for specific modules and actions.
 */
export const usePermissions = () => {
    const authInfoId = localStorage.getItem("CompanyId");
    const userRole = localStorage.getItem("Role");
    
    // Fetch permissions for the logged-in user
    const { data: permissionsData, isLoading, isError, refetch } = useGetUserPermissionsQuery(authInfoId, {
        skip: !authInfoId,
    });

    /**
     * Helper to check if a value is truly "truthy" in the context of permissions.
     * Handles booleans, numbers (1/0), and strings ("true", "1", "false", "0").
     */
    const isTruthy = (value) => {
        if (value === true || value === 1) return true;
        if (value === false || value === 0 || value === null || value === undefined) return false;
        
        const strValue = String(value).toLowerCase().trim();
        return strValue === 'true' || strValue === '1' || strValue === 'yes';
    };

    /**
     * Checks if the user has a specific permission for a module.
     * @param {string} moduleName - The name of the module (e.g., "Talent Pool", "Main Dashboard")
     * @param {string} action - The action to check ("view", "edit", "delete", "approve", "ui")
     * @returns {boolean} - True if permission is granted, false otherwise.
     */
    const hasPermission = useMemo(() => (moduleName, action) => {
        // 1. Admin Bypass - Admins generally have all permissions
        if (userRole?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'super admin') {
            return true;
        }

        if (!permissionsData || !Array.isArray(permissionsData)) return false;
        
        // 2. Find module with trimming and case-insensitive comparison
        const modulePermission = permissionsData.find(
            (p) => p.moduleName?.trim().toLowerCase() === moduleName?.trim().toLowerCase()
        );
        
        if (!modulePermission) return false;
        
        // 3. Map action string to property name
        const actionMap = {
            view: 'canView',
            edit: 'canEdit',
            delete: 'canDelete',
            approve: 'canApprove',
            ui: 'isVisible'
        };

        const targetProperty = actionMap[action] || action;
        
        // 4. Case-insensitive property lookup on the module object
        // This handles cases where API might return "CanView" or "canview"
        const actualKey = Object.keys(modulePermission).find(
            key => key.toLowerCase() === targetProperty.toLowerCase()
        );

        if (!actualKey) return false;

        // 5. Robust truthiness check
        return isTruthy(modulePermission[actualKey]);
    }, [permissionsData, userRole]);

    return {
        hasPermission,
        isLoading,
        isError,
        permissions: permissionsData,
        userRole,
        refetch
    };
};
