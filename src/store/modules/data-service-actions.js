export default {
    namespaced: true,
    state() {
        return {
            dataServiceActions: {}
        }
    },
    getters: {
        getDataServiceActions(state) {
            return workspaceId => {
                if (!(workspaceId in state.dataServiceActions)) return [];
                return state.dataServiceActions[workspaceId];
            };
        },
        getDataServiceActionsByDataServiceId(state) {
            return (workspaceId, dataServiceId) => {
                if (!(workspaceId in state.dataServiceActions)) return [];
                const dataServiceActions = [];
                Object.values(state.dataServiceActions[workspaceId]).forEach(dataServiceAction => {
                    if (dataServiceAction.hasDataService === dataServiceId) {
                        dataServiceActions.push(dataServiceAction);
                    }
                });
                return dataServiceActions;
            };
        },
        getDataServiceAction(state) {
            return (workspaceId, dataServiceActionId) => {
                if (!(workspaceId in state.dataServiceActions)) return null;
                return state.dataServiceActions[workspaceId][dataServiceActionId];
            };
        }
    },
    mutations: {
        setDataServiceAction(state, { workspaceId, dataServiceAction }) {
            if (!(workspaceId in state.dataServiceActions)) {
                state.dataServiceActions[workspaceId] = {};
            }
            state.dataServiceActions[workspaceId][dataServiceAction.id] = dataServiceAction;
        },
        removeDataServiceAction(state, { workspaceId, dataServiceAction }) {
            if (!(workspaceId in state.dataServiceActions)) return null;
            delete state.dataServiceActions[workspaceId][dataServiceAction.id];
        }
    },
    actions: {
        async fetchDataServiceActions({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/data-service-actions`);
            const dataServiceActions = response.data;
            dataServiceActions.forEach(dataServiceAction => {
                commit("setDataServiceAction", { workspaceId, dataServiceAction });
            });
        },
        async storeDataServiceAction({ commit }, { workspaceId, dataServiceAction }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/data-service-actions`, dataServiceAction);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceAction = response.data;
            commit("setDataServiceAction", { workspaceId, dataServiceAction });
            return dataServiceAction;
        },
        async updateDataServiceAction({ commit, dispatch }, { workspaceId, dataServiceAction }) {
            dataServiceAction = JSON.parse(JSON.stringify(dataServiceAction));
            const dataServiceActionId = dataServiceAction.id;
            delete dataServiceAction.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/data-service-actions/${dataServiceActionId}`, dataServiceAction);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceAction = response.data;
            commit("setDataServiceAction", { workspaceId, dataServiceAction });
            try {
                await dispatch("contracts/fetchContract", { workspaceId, contractId: dataServiceAction.hasContract }, { root: true });
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async destroyDataServiceAction({ commit }, { workspaceId, dataServiceAction }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/data-service-actions/${dataServiceAction.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeDataServiceAction", { workspaceId, dataServiceAction });
        }
    }
};
