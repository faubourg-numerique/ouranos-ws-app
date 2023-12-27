export default {
    namespaced: true,
    state() {
        return {
            woTActions: {}
        }
    },
    getters: {
        getWoTActions(state) {
            return (workspaceId, woTThingDescriptionId) => {
                if (!(workspaceId in state.woTActions)) return [];
                return Object.values(state.woTActions[workspaceId]).filter((woTAction) => woTAction.hasWoTThingDescription === woTThingDescriptionId);
            };
        },
        getWoTAction(state) {
            return (workspaceId, woTActionId) => {
                if (!(workspaceId in state.woTActions)) return null;
                return state.woTActions[workspaceId][woTActionId];
            };
        }
    },
    mutations: {
        setWoTAction(state, { workspaceId, woTAction }) {
            if (!(workspaceId in state.woTActions)) {
                state.woTActions[workspaceId] = {};
            }
            state.woTActions[workspaceId][woTAction.id] = woTAction;
        },
        removeWoTAction(state, { workspaceId, woTAction }) {
            if (!(workspaceId in state.woTActions)) return null;
            delete state.woTActions[workspaceId][woTAction.id];
        }
    },
    actions: {
        async fetchWoTActions({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/wot-actions`);
            const woTActions = response.data;
            woTActions.forEach(woTAction => {
                commit("setWoTAction", { workspaceId, woTAction });
            });
        },
        async storeWoTAction({ commit }, { workspaceId, woTAction }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/wot-actions`, woTAction);
            } catch (error) {
                throw error.response.data || {};
            }
            woTAction = response.data;
            commit("setWoTAction", { workspaceId, woTAction });
            return woTAction;
        },
        async updateWoTAction({ commit, dispatch }, { workspaceId, woTAction }) {
            woTAction = JSON.parse(JSON.stringify(woTAction));
            const woTActionId = woTAction.id;
            delete woTAction.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/wot-actions/${woTActionId}`, woTAction);
            } catch (error) {
                throw error.response.data || {};
            }
            woTAction = response.data;
            commit("setWoTAction", { workspaceId, woTAction });
        },
        async destroyWoTAction({ commit }, { workspaceId, woTAction }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/wot-actions/${woTAction.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWoTAction", { workspaceId, woTAction });
        }
    }
};
