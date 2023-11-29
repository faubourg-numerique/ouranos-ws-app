export default {
    namespaced: true,
    state() {
        return {
            capabilities: {}
        }
    },
    getters: {
        getCapabilities(state) {
            return workspaceId => {
                if (!(workspaceId in state.capabilities)) return [];
                return state.capabilities[workspaceId];
            };
        },
        getCapability(state) {
            return (workspaceId, capabilityId) => {
                if (!(workspaceId in state.capabilities)) return null;
                return state.capabilities[workspaceId][capabilityId];
            };
        }
    },
    mutations: {
        setCapability(state, { workspaceId, capability }) {
            if (!(workspaceId in state.capabilities)) {
                state.capabilities[workspaceId] = {};
            }
            state.capabilities[workspaceId][capability.id] = capability;
        },
        removeCapability(state, { workspaceId, capability }) {
            if (!(workspaceId in state.capabilities)) return null;
            delete state.capabilities[workspaceId][capability.id];
        }
    },
    actions: {
        async fetchCapabilities({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/capabilities`);
            const capabilities = response.data;
            capabilities.forEach(capability => {
                commit("setCapability", { workspaceId, capability });
            });
        },
        async storeCapability({ commit }, { workspaceId, capability }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/capabilities`, capability);
            } catch (error) {
                throw error.response.data || {};
            }
            capability = response.data;
            commit("setCapability", { workspaceId, capability });
            return capability;
        },
        async updateCapability({ commit, dispatch }, { workspaceId, capability }) {
            capability = JSON.parse(JSON.stringify(capability));
            const capabilityId = capability.id;
            delete capability.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/capabilities/${capabilityId}`, capability);
            } catch (error) {
                throw error.response.data || {};
            }
            capability = response.data;
            commit("setCapability", { workspaceId, capability });
        },
        async destroyCapability({ commit }, { workspaceId, capability }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/capabilities/${capability.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeCapability", { workspaceId, capability });
        }
    }
};
