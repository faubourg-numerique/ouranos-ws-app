export default {
    namespaced: true,
    state() {
        return {
            properties: {}
        }
    },
    getters: {
        getProperties(state) {
            return (workspaceId, typeId) => {
                if (!(workspaceId in state.properties)) return [];
                if (!(typeId in state.properties[workspaceId])) return {};
                return state.properties[workspaceId][typeId];
            };
        },
        getProperty(state) {
            return (workspaceId, typeId, propertyId) => {
                if (!(workspaceId in state.properties)) return null;
                if (!(typeId in state.properties[workspaceId])) return null;
                return state.properties[workspaceId][typeId][propertyId];
            };
        },
        getPropertyById(state) {
            return (workspaceId, propertyId) => {
                if (!(workspaceId in state.properties)) return null;
                for (const properties of Object.values(state.properties[workspaceId])) {
                    for (const property of Object.values(properties)) {
                        if (property.id === propertyId) {
                            return property;
                        }
                    }
                }
                return null;
            };
        },
        getPropertyName(state) {
            return (workspaceId, typeId, propertyId) => {
                if (!(workspaceId in state.properties)) return null;
                if (!(typeId in state.properties[workspaceId])) return null;

                const properties = state.properties[workspaceId][typeId];
                var property = properties[propertyId];

                const names = [property.name];
                while (property.hasProperty) {
                    property = properties[property.hasProperty];
                    names.unshift(property.name);
                }

                return names.length === 1 ? names[0] : names;
            };
        },
        getPropertiesByTypes(state) {
            return (workspaceId) => {
                if (!(workspaceId in state.properties)) return [];
                return state.properties[workspaceId];
            };
        }
    },
    mutations: {
        setProperty(state, { workspaceId, property }) {
            if (!(workspaceId in state.properties)) {
                state.properties[workspaceId] = {};
            }
            if (!(property.hasType in state.properties[workspaceId])) {
                state.properties[workspaceId][property.hasType] = {};
            }
            state.properties[workspaceId][property.hasType][property.id] = property;
        },
        removeProperty(state, { workspaceId, typeId, property }) {
            if (!(workspaceId in state.properties)) return null;
            if (!(typeId in state.properties[workspaceId])) return null;
            delete state.properties[workspaceId][typeId][property.id];
        }
    },
    actions: {
        async fetchProperties({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/properties`);
            const properties = response.data;
            properties.forEach(property => {
                commit("setProperty", { workspaceId, property });
            });
        },
        async storeProperty({ commit }, { workspaceId, property }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/properties`, property);
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
            property = response.data;
            commit("setProperty", { workspaceId, property });
            return property;
        },
        async updateProperty({ commit }, { workspaceId, property }) {
            property = JSON.parse(JSON.stringify(property));
            const propertyId = property.id;
            delete property.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/properties/${propertyId}`, property);
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
            property = response.data;
            commit("setProperty", { workspaceId, property });
        },
        async destroyProperty({ commit }, { workspaceId, property }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/properties/${property.id}`);
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeProperty", { workspaceId, typeId: property.hasType, property });
        }
    }
};
