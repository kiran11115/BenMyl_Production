import React from 'react';
import { Outlet } from 'react-router-dom';
import { usePermissions } from './usePermissions';
import AccessDenied from './AccessDenied';

/**
 * Route wrapper that checks for module-level permissions.
 * Shows an Access Denied screen if permissions are missing.
 * @param {string} module - The module name
 * @param {string} action - The action required (default: 'view')
 */
const ModuleProtectedRoute = ({ module, action = 'view' }) => {
    const { hasPermission, isLoading } = usePermissions();

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc'
            }}>
                <div className="loader">Loading Permissions...</div>
            </div>
        );
    }

    if (hasPermission(module, action)) {
        return <Outlet />;
    }

    // If no permission, show the premium Access Denied screen
    console.warn(`Access denied for module: ${module}, action: ${action}`);
    return <AccessDenied module={module} action={action} />;
};

export default ModuleProtectedRoute;
