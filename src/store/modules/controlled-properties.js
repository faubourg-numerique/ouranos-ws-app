export default {
    namespaced: true,
    state() {
        return {
            controlledProperties: {}
        }
    },
    getters: {
        getControlledProperties(state) {
            return workspaceId => {
                if (!(workspaceId in state.controlledProperties)) return [];
                return state.controlledProperties[workspaceId];
            };
        },
        getControlledProperty(state) {
            return (workspaceId, controlledPropertyId) => {
                if (!(workspaceId in state.controlledProperties)) return null;
                return state.controlledProperties[workspaceId][controlledPropertyId];
            };
        }
    },
    mutations: {
        setControlledProperty(state, { workspaceId, controlledProperty }) {
            if (!(workspaceId in state.controlledProperties)) {
                state.controlledProperties[workspaceId] = {};
            }
            state.controlledProperties[workspaceId][controlledProperty.id] = controlledProperty;
        },
        removeControlledProperty(state, { workspaceId, controlledProperty }) {
            if (!(workspaceId in state.controlledProperties)) return null;
            delete state.controlledProperties[workspaceId][controlledProperty.id];
        }
    },
    actions: {
        async fetchControlledProperties({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/controlled-properties`);
            const controlledProperties = response.data;
            controlledProperties.forEach(controlledProperty => {
                commit("setControlledProperty", { workspaceId, controlledProperty });
            });
        },
        async storeControlledProperty({ commit }, { workspaceId, controlledProperty }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/controlled-properties`, controlledProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            controlledProperty = response.data;
            commit("setControlledProperty", { workspaceId, controlledProperty });
            return controlledProperty;
        },
        async updateControlledProperty({ commit, dispatch }, { workspaceId, controlledProperty }) {
            controlledProperty = JSON.parse(JSON.stringify(controlledProperty));
            const controlledPropertyId = controlledProperty.id;
            delete controlledProperty.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/controlled-properties/${controlledPropertyId}`, controlledProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            controlledProperty = response.data;
            commit("setControlledProperty", { workspaceId, controlledProperty });
        },
        async destroyControlledProperty({ commit }, { workspaceId, controlledProperty }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/controlled-properties/${controlledProperty.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeControlledProperty", { workspaceId, controlledProperty });
        }
    }
};
