export default {
    namespaced: true,
    state() {
        return {
            dataActions: {}
        }
    },
    getters: {
        getDataActions(state) {
            return state.dataActions;
        },
        getDataAction(state) {
            return dataActionId => {
                return state.dataActions[dataActionId];
            };
        }
    },
    mutations: {
        setDataAction(state, dataAction) {
            state.dataActions[dataAction.id] = dataAction;
        },
        removeDataAction(state, dataAction) {
            delete state.dataActions[dataAction.id];
        }
    },
    actions: {
        async fetchDataActions({ commit }) {
            const response = await this.$api.get("/data-actions");
            const dataActions = response.data;
            dataActions.forEach(dataAction => {
                commit("setDataAction", dataAction);
            });
        },
        async storeDataAction({ commit }, dataAction) {
            let response;
            try {
                response = await this.$api.post("/data-actions", dataAction);
            } catch (error) {
                throw error.response.data || {};
            }
            dataAction = response.data;
            commit("setDataAction", dataAction);
            return dataAction;
        },
        async updateDataAction({ commit }, dataAction) {
            dataAction = JSON.parse(JSON.stringify(dataAction));
            const dataActionId = dataAction.id;
            delete dataAction.id;
            let response;
            try {
                response = await this.$api.put("/data-actions/" + dataActionId, dataAction);
            } catch (error) {
                throw error.response.data || {};
            }
            dataAction = response.data;
            commit("setDataAction", dataAction);
        },
        async destroyDataAction({ commit }, dataAction) {
            try {
                await this.$api.delete("/data-actions/" + dataAction.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeDataAction", dataAction);
        }
    }
};
