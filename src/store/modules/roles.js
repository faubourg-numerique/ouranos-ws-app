export default {
    namespaced: true,
    state() {
        return {
            roles: {}
        }
    },
    getters: {
        getRoles(state) {
            return workspaceId => {
                if (!(workspaceId in state.roles)) return [];
                return state.roles[workspaceId];
            };
        },
        getRole(state) {
            return (workspaceId, roleId) => {
                if (!(workspaceId in state.roles)) return null;
                return state.roles[workspaceId][roleId];
            };
        }
    },
    mutations: {
        setRole(state, { workspaceId, role }) {
            if (!(workspaceId in state.roles)) {
                state.roles[workspaceId] = {};
            }
            state.roles[workspaceId][role.id] = role;
        },
        removeRole(state, { workspaceId, role }) {
            if (!(workspaceId in state.roles)) return null;
            delete state.roles[workspaceId][role.id];
        }
    },
    actions: {
        async fetchRoles({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/roles`);
            const roles = response.data;
            roles.forEach(role => {
                commit("setRole", { workspaceId, role });
            });
        },
        async storeRole({ commit }, { workspaceId, role }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/roles`, role);
            } catch (error) {
                throw error.response.data || {};
            }
            role = response.data;
            commit("setRole", { workspaceId, role });
            return role;
        },
        async updateRole({ commit, dispatch }, { workspaceId, role }) {
            role = JSON.parse(JSON.stringify(role));
            const roleId = role.id;
            delete role.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/roles/${roleId}`, role);
            } catch (error) {
                throw error.response.data || {};
            }
            role = response.data;
            commit("setRole", { workspaceId, role });
        },
        async destroyRole({ commit }, { workspaceId, role }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/roles/${role.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeRole", { workspaceId, role });
        },
        async synchronizeRole({ dispatch }, { workspaceId, role, permit }) {
            const data = { effect: permit ? "Permit" : "Deny" };
            try {
                await this.$api.post(`/workspace/${workspaceId}/roles/${role.id}/synchronize`, data);
                await dispatch("fetchRoles", { workspaceId });
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
