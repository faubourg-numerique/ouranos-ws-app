export default {
    namespaced: true,
    state() {
        return {
            routings: {}
        }
    },
    getters: {
        getRoutings(state) {
            return workspaceId => {
                if (!(workspaceId in state.routings)) return [];
                return state.routings[workspaceId];
            };
        },
        getRouting(state) {
            return (workspaceId, routingId) => {
                if (!(workspaceId in state.routings)) return null;
                return state.routings[workspaceId][routingId];
            };
        }
    },
    mutations: {
        setRouting(state, { workspaceId, routing }) {
            if (!(workspaceId in state.routings)) {
                state.routings[workspaceId] = {};
            }
            state.routings[workspaceId][routing.id] = routing;
        },
        removeRouting(state, { workspaceId, routing }) {
            if (!(workspaceId in state.routings)) return null;
            delete state.routings[workspaceId][routing.id];
        }
    },
    actions: {
        async fetchRoutings({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/routings`);
            const routings = response.data;
            routings.forEach(routing => {
                commit("setRouting", { workspaceId, routing });
            });
        },
        async storeRouting({ commit }, { workspaceId, routing }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/routings`, routing);
            } catch (error) {
                throw error.response.data || {};
            }
            routing = response.data;
            commit("setRouting", { workspaceId, routing });
            return routing;
        },
        async updateRouting({ commit, dispatch }, { workspaceId, routing }) {
            routing = JSON.parse(JSON.stringify(routing));
            const routingId = routing.id;
            delete routing.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/routings/${routingId}`, routing);
            } catch (error) {
                throw error.response.data || {};
            }
            routing = response.data;
            commit("setRouting", { workspaceId, routing });
        },
        async destroyRouting({ commit }, { workspaceId, routing }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/routings/${routing.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeRouting", { workspaceId, routing });
        }
    }
};
