import { apiSlice } from "./ApiSlice";

const PermissionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        roleListDetails: builder.query({
            query: () => ({
                url: "/api/uatcompany/roles",
                method: "GET",
            }),
        }),

        membersList: builder.query({
            query: (role) => ({
                url: `api/uatcompany/users-by-role/${role}`,
                method: "GET",
            }),
        }),

        saveUserPermissions: builder.mutation({
            query: (body) => ({
                url: "/api/uatcompany/save-user-permissions",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PermissionsGranted"],
        }),

        getUserPermissions: builder.query({
            query: (authInfoId) => ({
                url: `/api/uatcompany/user-permissions/${authInfoId}`,
                method: "GET",
            }),
            providesTags: ["PermissionsGranted"],
        }),

    }),
});

export const { useRoleListDetailsQuery, useMembersListQuery, useSaveUserPermissionsMutation, useGetUserPermissionsQuery } = PermissionsApiSlice;