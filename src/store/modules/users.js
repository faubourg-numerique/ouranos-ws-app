export default {
    namespaced: true,
    actions: {
        async indexUsers({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/users`);
            return response.data;
        },
        async assignRole({ commit }, { workspaceId, userId, roleName }) {
            const response = await this.$api.post(`/workspace/${workspaceId}/users/${userId}/roles/${roleName}`);
            return response.data;
        },
        async removeRole({ commit }, { workspaceId, userId, roleName }) {
            const response = await this.$api.delete(`/workspace/${workspaceId}/users/${userId}/roles/${roleName}`);
            return response.data;
        }
    }
};
