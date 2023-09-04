export default {
    namespaced: true,
    state() {
        return {
            contracts: {}
        }
    },
    getters: {
        getContracts(state) {
            return workspaceId => {
                if (!(workspaceId in state.contracts)) return [];
                return state.contracts[workspaceId];
            };
        },
        getContract(state) {
            return (workspaceId, contractId) => {
                if (!(workspaceId in state.contracts)) return null;
                return state.contracts[workspaceId][contractId];
            };
        }
    },
    mutations: {
        setContract(state, { workspaceId, contract }) {
            if (!(workspaceId in state.contracts)) {
                state.contracts[workspaceId] = {};
            }
            state.contracts[workspaceId][contract.id] = contract;
        },
        removeContract(state, { workspaceId, contract }) {
            if (!(workspaceId in state.contracts)) return null;
            delete state.contracts[workspaceId][contract.id];
        }
    },
    actions: {
        async fetchContract({ commit }, { workspaceId, contractId }) {
            const response = await this.$api.get(`/workspace/${workspaceId}/contracts/${contractId}`);
            const contract = response.data;
            commit("setContract", { workspaceId, contract });
        },
        async fetchContracts({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/contracts`);
            const contracts = response.data;
            contracts.forEach(contract => {
                commit("setContract", { workspaceId, contract });
            });
        },
        async storeContract({ commit }, { workspaceId, contract }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/contracts`, contract);
            } catch (error) {
                throw error.response.data || {};
            }
            contract = response.data;
            commit("setContract", { workspaceId, contract });
            return contract;
        },
        async destroyContract({ commit }, { workspaceId, contract }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/contracts/${contract.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeContract", { workspaceId, contract });
        },
        async synchronizeContract({ dispatch }, { workspaceId, contract }) {
            try {
                await this.$api.post(`/workspace/${workspaceId}/contracts/${contract.id}/synchronize`);
                await dispatch("fetchContract", { workspaceId, contractId: contract.id });
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
