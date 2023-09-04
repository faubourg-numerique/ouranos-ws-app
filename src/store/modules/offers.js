export default {
    namespaced: true,
    state() {
        return {
            offers: {}
        }
    },
    getters: {
        getOffers(state) {
            return workspaceId => {
                if (!(workspaceId in state.offers)) return [];
                return state.offers[workspaceId];
            };
        },
        getOffer(state) {
            return (workspaceId, offerId) => {
                if (!(workspaceId in state.offers)) return null;
                return state.offers[workspaceId][offerId];
            };
        }
    },
    mutations: {
        setOffer(state, { workspaceId, offer }) {
            if (!(workspaceId in state.offers)) {
                state.offers[workspaceId] = {};
            }
            state.offers[workspaceId][offer.id] = offer;
        },
        removeOffer(state, { workspaceId, offer }) {
            if (!(workspaceId in state.offers)) return null;
            delete state.offers[workspaceId][offer.id];
        }
    },
    actions: {
        async fetchOffers({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/offers`);
            const offers = response.data;
            offers.forEach(offer => {
                commit("setOffer", { workspaceId, offer });
            });
        },
        async storeOffer({ commit }, { workspaceId, offer }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/offers`, offer);
            } catch (error) {
                throw error.response.data || {};
            }
            offer = response.data;
            commit("setOffer", { workspaceId, offer });
            return offer;
        },
        async destroyOffer({ commit }, { workspaceId, offer }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/offers/${offer.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeOffer", { workspaceId, offer });
        }
    }
};
