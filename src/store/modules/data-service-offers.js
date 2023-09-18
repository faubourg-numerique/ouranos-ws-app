export default {
    namespaced: true,
    state() {
        return {
            dataServiceOffers: {}
        }
    },
    getters: {
        getDataServiceOffers(state) {
            return (workspaceId, dataServiceId) => {
                if (!(workspaceId in state.dataServiceOffers)) return [];
                return Object.values(state.dataServiceOffers[workspaceId]).filter(dataServiceOffer => dataServiceOffer.hasDataService === dataServiceId);
            };
        },
        getDataServiceOffer(state) {
            return (workspaceId, dataServiceOfferId) => {
                if (!(workspaceId in state.dataServiceOffers)) return null;
                return state.dataServiceOffers[workspaceId][dataServiceOfferId];
            };
        }
    },
    mutations: {
        setDataServiceOffer(state, { workspaceId, dataServiceOffer }) {
            if (!(workspaceId in state.dataServiceOffers)) {
                state.dataServiceOffers[workspaceId] = {};
            }
            state.dataServiceOffers[workspaceId][dataServiceOffer.id] = dataServiceOffer;
        },
        removeDataServiceOffer(state, { workspaceId, dataServiceOffer }) {
            if (!(workspaceId in state.dataServiceOffers)) return null;
            delete state.dataServiceOffers[workspaceId][dataServiceOffer.id];
        }
    },
    actions: {
        async fetchDataServiceOffers({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/data-service-offers`);
            const dataServiceOffers = response.data;
            dataServiceOffers.forEach(dataServiceOffer => {
                commit("setDataServiceOffer", { workspaceId, dataServiceOffer });
            });
        },
        async storeDataServiceOffer({ commit }, { workspaceId, dataServiceOffer }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/data-service-offers`, dataServiceOffer);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceOffer = response.data;
            commit("setDataServiceOffer", { workspaceId, dataServiceOffer });
            return dataServiceOffer;
        },
        async updateDataServiceOffer({ commit, dispatch }, { workspaceId, dataServiceOffer }) {
            dataServiceOffer = JSON.parse(JSON.stringify(dataServiceOffer));
            const dataServiceOfferId = dataServiceOffer.id;
            delete dataServiceOffer.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/data-service-offers/${dataServiceOfferId}`, dataServiceOffer);
            } catch (error) {
                throw error.response.data || {};
            }
            dataServiceOffer = response.data;
            commit("setDataServiceOffer", { workspaceId, dataServiceOffer });
        },
        async destroyDataServiceOffer({ commit }, { workspaceId, dataServiceOffer }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/data-service-offers/${dataServiceOffer.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeDataServiceOffer", { workspaceId, dataServiceOffer });
        }
    }
};
