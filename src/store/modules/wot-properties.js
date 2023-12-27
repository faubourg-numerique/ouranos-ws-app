export default {
    namespaced: true,
    state() {
        return {
            woTProperties: {}
        }
    },
    getters: {
        getWoTProperties(state) {
            return (workspaceId, woTThingDescriptionId) => {
                if (!(workspaceId in state.woTProperties)) return [];
                return Object.values(state.woTProperties[workspaceId]).filter((woTProperty) => woTProperty.hasWoTThingDescription === woTThingDescriptionId);
            };
        },
        getWoTProperty(state) {
            return (workspaceId, woTPropertyId) => {
                if (!(workspaceId in state.woTProperties)) return null;
                return state.woTProperties[workspaceId][woTPropertyId];
            };
        }
    },
    mutations: {
        setWoTProperty(state, { workspaceId, woTProperty }) {
            if (!(workspaceId in state.woTProperties)) {
                state.woTProperties[workspaceId] = {};
            }
            state.woTProperties[workspaceId][woTProperty.id] = woTProperty;
        },
        removeWoTProperty(state, { workspaceId, woTProperty }) {
            if (!(workspaceId in state.woTProperties)) return null;
            delete state.woTProperties[workspaceId][woTProperty.id];
        }
    },
    actions: {
        async fetchWoTProperties({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/wot-properties`);
            const woTProperties = response.data;
            woTProperties.forEach(woTProperty => {
                commit("setWoTProperty", { workspaceId, woTProperty });
            });
        },
        async storeWoTProperty({ commit }, { workspaceId, woTProperty }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/wot-properties`, woTProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            woTProperty = response.data;
            commit("setWoTProperty", { workspaceId, woTProperty });
            return woTProperty;
        },
        async updateWoTProperty({ commit, dispatch }, { workspaceId, woTProperty }) {
            woTProperty = JSON.parse(JSON.stringify(woTProperty));
            const woTPropertyId = woTProperty.id;
            delete woTProperty.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/wot-properties/${woTPropertyId}`, woTProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            woTProperty = response.data;
            commit("setWoTProperty", { workspaceId, woTProperty });
        },
        async destroyWoTProperty({ commit }, { workspaceId, woTProperty }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/wot-properties/${woTProperty.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWoTProperty", { workspaceId, woTProperty });
        }
    }
};
