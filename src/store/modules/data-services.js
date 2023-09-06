export default {
    namespaced: true,
    state() {
        return {
            dataServices: {}
        }
    },
    getters: {
        getDataServices(state) {
            return workspaceId => {
                if (!(workspaceId in state.dataServices)) return [];
                return state.dataServices[workspaceId];
            };
        },
        getDataService(state) {
            return (workspaceId, dataServiceId) => {
                if (!(workspaceId in state.dataServices)) return null;
                return state.dataServices[workspaceId][dataServiceId];
            };
        }
    },
    mutations: {
        setDataService(state, { workspaceId, dataService }) {
            if (!(workspaceId in state.dataServices)) {
                state.dataServices[workspaceId] = {};
            }
            state.dataServices[workspaceId][dataService.id] = dataService;
        },
        removeDataService(state, { workspaceId, dataService }) {
            if (!(workspaceId in state.dataServices)) return null;
            delete state.dataServices[workspaceId][dataService.id];
        }
    },
    actions: {
        async fetchDataServices({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/data-services`);
            const dataServices = response.data;
            dataServices.forEach(dataService => {
                commit("setDataService", { workspaceId, dataService });
            });
        },
        async storeDataService({ commit }, { workspaceId, dataService }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/data-services`, dataService);
            } catch (error) {
                throw error.response.data || {};
            }
            dataService = response.data;
            commit("setDataService", { workspaceId, dataService });
            return dataService;
        },
        async updateDataService({ commit, dispatch }, { workspaceId, dataService }) {
            dataService = JSON.parse(JSON.stringify(dataService));
            const dataServiceId = dataService.id;
            delete dataService.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/data-services/${dataServiceId}`, dataService);
            } catch (error) {
                throw error.response.data || {};
            }
            dataService = response.data;
            commit("setDataService", { workspaceId, dataService });
            try {
                await dispatch("contracts/fetchContract", { workspaceId, contractId: dataService.hasContract }, { root: true });
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async destroyDataService({ commit }, { workspaceId, dataService }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/data-services/${dataService.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeDataService", { workspaceId, dataService });
        }
    }
};
