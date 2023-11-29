export default {
    namespaced: true,
    state() {
        return {
            routingOperations: {}
        }
    },
    getters: {
        getRoutingOperations(state) {
            return workspaceId => {
                if (!(workspaceId in state.routingOperations)) return [];
                return state.routingOperations[workspaceId];
            };
        },
        getRoutingOperation(state) {
            return (workspaceId, routingOperationId) => {
                if (!(workspaceId in state.routingOperations)) return null;
                return state.routingOperations[workspaceId][routingOperationId];
            };
        }
    },
    mutations: {
        setRoutingOperation(state, { workspaceId, routingOperation }) {
            if (!(workspaceId in state.routingOperations)) {
                state.routingOperations[workspaceId] = {};
            }
            state.routingOperations[workspaceId][routingOperation.id] = routingOperation;
        },
        removeRoutingOperation(state, { workspaceId, routingOperation }) {
            if (!(workspaceId in state.routingOperations)) return null;
            delete state.routingOperations[workspaceId][routingOperation.id];
        }
    },
    actions: {
        async fetchRoutingOperations({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/routing-operations`);
            const routingOperations = response.data;
            routingOperations.forEach(routingOperation => {
                commit("setRoutingOperation", { workspaceId, routingOperation });
            });
        },
        async storeRoutingOperation({ commit }, { workspaceId, routingOperation }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/routing-operations`, routingOperation);
            } catch (error) {
                throw error.response.data || {};
            }
            routingOperation = response.data;
            commit("setRoutingOperation", { workspaceId, routingOperation });
            return routingOperation;
        },
        async updateRoutingOperation({ commit, dispatch }, { workspaceId, routingOperation }) {
            routingOperation = JSON.parse(JSON.stringify(routingOperation));
            const routingOperationId = routingOperation.id;
            delete routingOperation.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/routing-operations/${routingOperationId}`, routingOperation);
            } catch (error) {
                throw error.response.data || {};
            }
            routingOperation = response.data;
            commit("setRoutingOperation", { workspaceId, routingOperation });
        },
        async destroyRoutingOperation({ commit }, { workspaceId, routingOperation }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/routing-operations/${routingOperation.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeRoutingOperation", { workspaceId, routingOperation });
        }
    }
};
