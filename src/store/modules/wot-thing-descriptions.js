export default {
    namespaced: true,
    state() {
        return {
            woTThingDescriptions: {}
        }
    },
    getters: {
        getWoTThingDescriptions(state) {
            return workspaceId => {
                if (!(workspaceId in state.woTThingDescriptions)) return [];
                return state.woTThingDescriptions[workspaceId];
            };
        },
        getWoTThingDescription(state) {
            return (workspaceId, woTThingDescriptionId) => {
                if (!(workspaceId in state.woTThingDescriptions)) return null;
                return state.woTThingDescriptions[workspaceId][woTThingDescriptionId];
            };
        }
    },
    mutations: {
        setWoTThingDescription(state, { workspaceId, woTThingDescription }) {
            if (!(workspaceId in state.woTThingDescriptions)) {
                state.woTThingDescriptions[workspaceId] = {};
            }
            state.woTThingDescriptions[workspaceId][woTThingDescription.id] = woTThingDescription;
        },
        removeWoTThingDescription(state, { workspaceId, woTThingDescription }) {
            if (!(workspaceId in state.woTThingDescriptions)) return null;
            delete state.woTThingDescriptions[workspaceId][woTThingDescription.id];
        }
    },
    actions: {
        async fetchWoTThingDescriptions({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/wot-thing-descriptions`);
            const woTThingDescriptions = response.data;
            woTThingDescriptions.forEach(woTThingDescription => {
                commit("setWoTThingDescription", { workspaceId, woTThingDescription });
            });
        },
        async storeWoTThingDescription({ commit }, { workspaceId, woTThingDescription }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/wot-thing-descriptions`, woTThingDescription);
            } catch (error) {
                throw error.response.data || {};
            }
            woTThingDescription = response.data;
            commit("setWoTThingDescription", { workspaceId, woTThingDescription });
            return woTThingDescription;
        },
        async updateWoTThingDescription({ commit, dispatch }, { workspaceId, woTThingDescription }) {
            woTThingDescription = JSON.parse(JSON.stringify(woTThingDescription));
            const woTThingDescriptionId = woTThingDescription.id;
            delete woTThingDescription.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/wot-thing-descriptions/${woTThingDescriptionId}`, woTThingDescription);
            } catch (error) {
                throw error.response.data || {};
            }
            woTThingDescription = response.data;
            commit("setWoTThingDescription", { workspaceId, woTThingDescription });
        },
        async destroyWoTThingDescription({ commit }, { workspaceId, woTThingDescription }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/wot-thing-descriptions/${woTThingDescription.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWoTThingDescription", { workspaceId, woTThingDescription });
        }
    }
};
