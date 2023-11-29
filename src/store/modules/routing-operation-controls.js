export default {
    namespaced: true,
    state() {
        return {
            routingOperationControls: {}
        }
    },
    getters: {
        getRoutingOperationControls(state) {
            return workspaceId => {
                if (!(workspaceId in state.routingOperationControls)) return [];
                return state.routingOperationControls[workspaceId];
            };
        },
        getRoutingOperationControl(state) {
            return (workspaceId, routingOperationControlId) => {
                if (!(workspaceId in state.routingOperationControls)) return null;
                return state.routingOperationControls[workspaceId][routingOperationControlId];
            };
        }
    },
    mutations: {
        setRoutingOperationControl(state, { workspaceId, routingOperationControl }) {
            if (!(workspaceId in state.routingOperationControls)) {
                state.routingOperationControls[workspaceId] = {};
            }
            state.routingOperationControls[workspaceId][routingOperationControl.id] = routingOperationControl;
        },
        removeRoutingOperationControl(state, { workspaceId, routingOperationControl }) {
            if (!(workspaceId in state.routingOperationControls)) return null;
            delete state.routingOperationControls[workspaceId][routingOperationControl.id];
        }
    },
    actions: {
        async fetchRoutingOperationControls({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/routing-operation-controls`);
            const routingOperationControls = response.data;
            routingOperationControls.forEach(routingOperationControl => {
                commit("setRoutingOperationControl", { workspaceId, routingOperationControl });
            });
        },
        async storeRoutingOperationControl({ commit }, { workspaceId, routingOperationControl }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/routing-operation-controls`, routingOperationControl);
            } catch (error) {
                throw error.response.data || {};
            }
            routingOperationControl = response.data;
            commit("setRoutingOperationControl", { workspaceId, routingOperationControl });
            return routingOperationControl;
        },
        async updateRoutingOperationControl({ commit, dispatch }, { workspaceId, routingOperationControl }) {
            routingOperationControl = JSON.parse(JSON.stringify(routingOperationControl));
            const routingOperationControlId = routingOperationControl.id;
            delete routingOperationControl.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/routing-operation-controls/${routingOperationControlId}`, routingOperationControl);
            } catch (error) {
                throw error.response.data || {};
            }
            routingOperationControl = response.data;
            commit("setRoutingOperationControl", { workspaceId, routingOperationControl });
        },
        async destroyRoutingOperationControl({ commit }, { workspaceId, routingOperationControl }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/routing-operation-controls/${routingOperationControl.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeRoutingOperationControl", { workspaceId, routingOperationControl });
        }
    }
};
