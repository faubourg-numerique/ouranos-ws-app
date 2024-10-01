export default {
    namespaced: true,
    state() {
        return {
            woTActionInputProperties: {}
        }
    },
    getters: {
        getWoTActionInputProperties(state) {
            return (workspaceId, woTActionInputPropertyId) => {
                if (!(workspaceId in state.woTActionInputProperties)) return [];
                return Object.values(state.woTActionInputProperties[workspaceId]).filter((woTActionInputProperty) => woTActionInputProperty.hasWoTAction === woTActionInputPropertyId);
            };
        },
        getWoTActionInputProperty(state) {
            return (workspaceId, woTActionInputPropertyId) => {
                if (!(workspaceId in state.woTActionInputProperties)) return null;
                return state.woTActionInputProperties[workspaceId][woTActionInputPropertyId];
            };
        }
    },
    mutations: {
        setWoTActionInputProperty(state, { workspaceId, woTActionInputProperty }) {
            if (!(workspaceId in state.woTActionInputProperties)) {
                state.woTActionInputProperties[workspaceId] = {};
            }
            state.woTActionInputProperties[workspaceId][woTActionInputProperty.id] = woTActionInputProperty;
        },
        removeWoTActionInputProperty(state, { workspaceId, woTActionInputProperty }) {
            if (!(workspaceId in state.woTActionInputProperties)) return null;
            delete state.woTActionInputProperties[workspaceId][woTActionInputProperty.id];
        }
    },
    actions: {
        async fetchWoTActionInputProperties({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/wot-action-input-properties`);
            const woTActionInputProperties = response.data;
            woTActionInputProperties.forEach(woTActionInputProperty => {
                commit("setWoTActionInputProperty", { workspaceId, woTActionInputProperty });
            });
        },
        async storeWoTActionInputProperty({ commit }, { workspaceId, woTActionInputProperty }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/wot-action-input-properties`, woTActionInputProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            woTActionInputProperty = response.data;
            commit("setWoTActionInputProperty", { workspaceId, woTActionInputProperty });
            return woTActionInputProperty;
        },
        async updateWoTActionInputProperty({ commit, dispatch }, { workspaceId, woTActionInputProperty }) {
            woTActionInputProperty = JSON.parse(JSON.stringify(woTActionInputProperty));
            const woTActionInputPropertyId = woTActionInputProperty.id;
            delete woTActionInputProperty.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/wot-action-input-properties/${woTActionInputPropertyId}`, woTActionInputProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            woTActionInputProperty = response.data;
            commit("setWoTActionInputProperty", { workspaceId, woTActionInputProperty });
        },
        async destroyWoTActionInputProperty({ commit }, { workspaceId, woTActionInputProperty }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/wot-action-input-properties/${woTActionInputProperty.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWoTActionInputProperty", { workspaceId, woTActionInputProperty });
        }
    }
};
