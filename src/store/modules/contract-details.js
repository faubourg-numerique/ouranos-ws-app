export default {
    namespaced: true,
    state() {
        return {
            contractDetails: {}
        }
    },
    getters: {
        getContractDetails(state) {
            return workspaceId => {
                if (!(workspaceId in state.contractDetails)) return [];
                return state.contractDetails[workspaceId];
            };
        },
        getContractDetail(state) {
            return (workspaceId, contractDetailId) => {
                if (!(workspaceId in state.contractDetails)) return null;
                return state.contractDetails[workspaceId][contractDetailId];
            };
        }
    },
    mutations: {
        setContractDetail(state, { workspaceId, contractDetail }) {
            if (!(workspaceId in state.contractDetails)) {
                state.contractDetails[workspaceId] = {};
            }
            state.contractDetails[workspaceId][contractDetail.id] = contractDetail;
        },
        removeContractDetail(state, { workspaceId, contractDetail }) {
            if (!(workspaceId in state.contractDetails)) return null;
            delete state.contractDetails[workspaceId][contractDetail.id];
        }
    },
    actions: {
        async fetchContractDetails({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/contract-details`);
            const contractDetails = response.data;
            contractDetails.forEach(contractDetail => {
                commit("setContractDetail", { workspaceId, contractDetail });
            });
        },
        async storeContractDetail({ commit }, { workspaceId, contractDetail }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/contract-details`, contractDetail);
            } catch (error) {
                throw error.response.data || {};
            }
            contractDetail = response.data;
            commit("setContractDetail", { workspaceId, contractDetail });
            return contractDetail;
        },
        async updateContractDetail({ commit, dispatch }, { workspaceId, contractDetail }) {
            contractDetail = JSON.parse(JSON.stringify(contractDetail));
            const contractDetailId = contractDetail.id;
            delete contractDetail.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/contract-details/${contractDetailId}`, contractDetail);
            } catch (error) {
                throw error.response.data || {};
            }
            contractDetail = response.data;
            commit("setContractDetail", { workspaceId, contractDetail });
            try {
                await dispatch("contracts/fetchContract", { workspaceId, contractId: contractDetail.hasContract }, { root: true });
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async destroyContractDetail({ commit }, { workspaceId, contractDetail }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/contract-details/${contractDetail.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeContractDetail", { workspaceId, contractDetail });
        },
        async synchronizeContractDetail({ commit }, { workspaceId, contractDetail }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/contract-details/${contractDetail.id}/synchronize`);
                return response.data.details;
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
