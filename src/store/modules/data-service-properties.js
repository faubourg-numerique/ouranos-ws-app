export default {
    namespaced: true,
    state() {
        return {
            dataServiceProperties: {}
        }
    },
    getters: {
        getDataServiceProperties(state) {
            return workspaceId => {
                if (!(workspaceId in state.dataServiceProperties)) return [];
                return state.dataServiceProperties[workspaceId];
            };
        },
        getDataServicePropertiesByDataServiceId(state) {
            return (workspaceId, dataServiceId) => {
                if (!(workspaceId in state.dataServiceProperties)) return [];
                const dataServiceProperties = [];
                Object.values(state.dataServiceProperties[workspaceId]).forEach(dataServiceAction => {
                    if (dataServiceAction.hasDataService === dataServiceId) {
                        dataServiceProperties.push(dataServiceAction);
                    }
                });
                return dataServiceProperties;
            };
        },
        getDataServiceProperty(state) {
            return (workspaceId, dataServicePropertyId) => {
                if (!(workspaceId in state.dataServiceProperties)) return null;
                return state.dataServiceProperties[workspaceId][dataServicePropertyId];
            };
        }
    },
    mutations: {
        setDataServiceProperty(state, { workspaceId, dataServiceProperty }) {
            if (!(workspaceId in state.dataServiceProperties)) {
                state.dataServiceProperties[workspaceId] = {};
            }
            state.dataServiceProperties[workspaceId][dataServiceProperty.id] = dataServiceProperty;
        },
        removeDataServiceProperty(state, { workspaceId, dataServiceProperty }) {
            if (!(workspaceId in state.dataServiceProperties)) return null;
            delete state.dataServiceProperties[workspaceId][dataServiceProperty.id];
        }
    },
    actions: {
        async fetchDataServiceProperties({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/data-service-properties`);
            const dataServiceProperties = response.data;
            dataServiceProperties.forEach(dataServiceProperty => {
                commit("setDataServiceProperty", { workspaceId, dataServiceProperty });
            });
        },
        async storeDataServiceProperty({ commit }, { workspaceId, dataServiceProperty }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/data-service-properties`, dataServiceProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceProperty = response.data;
            commit("setDataServiceProperty", { workspaceId, dataServiceProperty });
            return dataServiceProperty;
        },
        async updateDataServiceProperty({ commit, dispatch }, { workspaceId, dataServiceProperty }) {
            dataServiceProperty = JSON.parse(JSON.stringify(dataServiceProperty));
            const dataServicePropertyId = dataServiceProperty.id;
            delete dataServiceProperty.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/data-service-properties/${dataServicePropertyId}`, dataServiceProperty);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceProperty = response.data;
            commit("setDataServiceProperty", { workspaceId, dataServiceProperty });
        },
        async destroyDataServiceProperty({ commit }, { workspaceId, dataServiceProperty }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/data-service-properties/${dataServiceProperty.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeDataServiceProperty", { workspaceId, dataServiceProperty });
        }
    }
};
