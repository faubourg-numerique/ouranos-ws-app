export default {
    namespaced: true,
    state() {
        return {
            types: {}
        }
    },
    getters: {
        getTypes(state) {
            return workspaceId => {
                if (!(workspaceId in state.types)) return [];
                return state.types[workspaceId];
            };
        },
        getType(state) {
            return (workspaceId, typeId) => {
                if (!(workspaceId in state.types)) return null;
                return state.types[workspaceId][typeId];
            };
        }
    },
    mutations: {
        setType(state, { workspaceId, type }) {
            if (!(workspaceId in state.types)) {
                state.types[workspaceId] = {};
            }
            state.types[workspaceId][type.id] = type;
        },
        removeType(state, { workspaceId, type }) {
            if (!(workspaceId in state.types)) return null;
            delete state.types[workspaceId][type.id];
        }
    },
    actions: {
        async fetchType({ commit }, { workspaceId, typeId }) {
            const response = await this.$api.get(`/workspace/${workspaceId}/types/${typeId}`);
            const type = response.data;
            commit("setType", { workspaceId, type });
        },
        async fetchTypes({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/types`);
            const types = response.data;
            types.forEach(type => {
                commit("setType", { workspaceId, type });
            });
        },
        async storeType({ commit }, { workspaceId, type }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/types`, type);
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
            type = response.data;
            commit("setType", { workspaceId, type });
            return type;
        },
        async updateType({ commit }, { workspaceId, type }) {
            type = JSON.parse(JSON.stringify(type));
            const typeId = type.id;
            delete type.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/types/${typeId}`, type);
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
            type = response.data;
            commit("setType", { workspaceId, type });
        },
        async destroyType({ commit }, { workspaceId, type }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/types/${type.id}`);
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeType", { workspaceId, type });
        },
        async updatePositionInChart(context, { workspaceId, typeId, positionInChart }) {
            try {
                await this.$api.put(`/workspace/${workspaceId}/types/${typeId}/position-in-chart`, positionInChart);
                await this.dispatch("types/fetchType", { workspaceId, typeId });
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
