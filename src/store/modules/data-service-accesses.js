export default {
    namespaced: true,
    state() {
        return {
            dataServiceAccesses: {}
        }
    },
    getters: {
        getDataServiceAccesses(state) {
            return (workspaceId, dataServiceId) => {
                if (!(workspaceId in state.dataServiceAccesses)) return [];
                return Object.values(state.dataServiceAccesses[workspaceId]).filter(dataServiceAccess => dataServiceAccess.hasDataService === dataServiceId);
            };
        },
        getDataServiceAccess(state) {
            return (workspaceId, dataServiceAccessId) => {
                if (!(workspaceId in state.dataServiceAccesses)) return null;
                return state.dataServiceAccesses[workspaceId][dataServiceAccessId];
            };
        }
    },
    mutations: {
        setDataServiceAccess(state, { workspaceId, dataServiceAccess }) {
            if (!(workspaceId in state.dataServiceAccesses)) {
                state.dataServiceAccesses[workspaceId] = {};
            }
            state.dataServiceAccesses[workspaceId][dataServiceAccess.id] = dataServiceAccess;
        },
        removeDataServiceAccess(state, { workspaceId, dataServiceAccess }) {
            if (!(workspaceId in state.dataServiceAccesses)) return null;
            delete state.dataServiceAccesses[workspaceId][dataServiceAccess.id];
        }
    },
    actions: {
        async fetchDataServiceAccesses({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/data-service-accesses`);
            const dataServiceAccesses = response.data;
            dataServiceAccesses.forEach(dataServiceAccess => {
                commit("setDataServiceAccess", { workspaceId, dataServiceAccess });
            });
        },
        async storeDataServiceAccess({ commit }, { workspaceId, dataServiceAccess }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/data-service-accesses`, dataServiceAccess);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceAccess = response.data;
            commit("setDataServiceAccess", { workspaceId, dataServiceAccess });
            return dataServiceAccess;
        },
        async updateDataServiceAccess({ commit, dispatch }, { workspaceId, dataServiceAccess }) {
            dataServiceAccess = JSON.parse(JSON.stringify(dataServiceAccess));
            const dataServiceAccessId = dataServiceAccess.id;
            delete dataServiceAccess.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/data-service-accesses/${dataServiceAccessId}`, dataServiceAccess);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceAccess = response.data;
            commit("setDataServiceAccess", { workspaceId, dataServiceAccess });
        },
        async destroyDataServiceAccess({ commit }, { workspaceId, dataServiceAccess }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/data-service-accesses/${dataServiceAccess.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeDataServiceAccess", { workspaceId, dataServiceAccess });
        }
    }
};
