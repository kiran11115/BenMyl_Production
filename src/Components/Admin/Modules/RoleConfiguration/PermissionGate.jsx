import React from 'react';
import { usePermissions } from './usePermissions';

/**
 * A wrapper component that only renders its children if the user has the required permission.
 * 
 * @param {string} module - The module name (e.g., "Talent Pool")
 * @param {string} action - The action required (e.g., "view", "edit", "delete")
 * @param {React.ReactNode} children - The content to show if permitted
 * @param {React.ReactNode} fallback - Optional content to show if NOT permitted
 */
const PermissionGate = ({ module, action = 'view', children, fallback = null }) => {
    const { hasPermission, isLoading } = usePermissions();

    if (isLoading) return null; // Or a small skeleton/spinner if needed

    if (hasPermission(module, action)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default PermissionGate;
