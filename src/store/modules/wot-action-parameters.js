export default {
    namespaced: true,
    state() {
        return {
            woTActionParameters: {}
        }
    },
    getters: {
        getWoTActionParameters(state) {
            return (workspaceId, woTActionId) => {
                if (!(workspaceId in state.woTActionParameters)) return [];
                return Object.values(state.woTActionParameters[workspaceId]).filter((woTActionParameter) => woTActionParameter.hasWoTAction === woTActionId);
            };
        },
        getWoTActionParameter(state) {
            return (workspaceId, woTActionParameterId) => {
                if (!(workspaceId in state.woTActionParameters)) return null;
                return state.woTActionParameters[workspaceId][woTActionParameterId];
            };
        }
    },
    mutations: {
        setWoTActionParameter(state, { workspaceId, woTActionParameter }) {
            if (!(workspaceId in state.woTActionParameters)) {
                state.woTActionParameters[workspaceId] = {};
            }
            state.woTActionParameters[workspaceId][woTActionParameter.id] = woTActionParameter;
        },
        removeWoTActionParameter(state, { workspaceId, woTActionParameter }) {
            if (!(workspaceId in state.woTActionParameters)) return null;
            delete state.woTActionParameters[workspaceId][woTActionParameter.id];
        }
    },
    actions: {
        async fetchWoTActionParameters({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/wot-action-parameters`);
            const woTActionParameters = response.data;
            woTActionParameters.forEach(woTActionParameter => {
                commit("setWoTActionParameter", { workspaceId, woTActionParameter });
            });
        },
        async storeWoTActionParameter({ commit }, { workspaceId, woTActionParameter }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/wot-action-parameters`, woTActionParameter);
            } catch (error) {
                throw error.response.data || {};
            }
            woTActionParameter = response.data;
            commit("setWoTActionParameter", { workspaceId, woTActionParameter });
            return woTActionParameter;
        },
        async updateWoTActionParameter({ commit, dispatch }, { workspaceId, woTActionParameter }) {
            woTActionParameter = JSON.parse(JSON.stringify(woTActionParameter));
            const woTActionParameterId = woTActionParameter.id;
            delete woTActionParameter.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/wot-action-parameters/${woTActionParameterId}`, woTActionParameter);
            } catch (error) {
                throw error.response.data || {};
            }
            woTActionParameter = response.data;
            commit("setWoTActionParameter", { workspaceId, woTActionParameter });
        },
        async destroyWoTActionParameter({ commit }, { workspaceId, woTActionParameter }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/wot-action-parameters/${woTActionParameter.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWoTActionParameter", { workspaceId, woTActionParameter });
        }
    }
};
