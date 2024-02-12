export default {
    namespaced: true,
    state() {
        return {
            trustedIssuersLists: {}
        }
    },
    getters: {
        getTrustedIssuersLists(state) {
            return state.trustedIssuersLists;
        },
        getTrustedIssuersList(state) {
            return trustedIssuersListId => {
                return state.trustedIssuersLists[trustedIssuersListId];
            };
        }
    },
    mutations: {
        setTrustedIssuersList(state, trustedIssuersList) {
            state.trustedIssuersLists[trustedIssuersList.id] = trustedIssuersList;
        },
        removeTrustedIssuersList(state, trustedIssuersList) {
            delete state.trustedIssuersLists[trustedIssuersList.id];
        }
    },
    actions: {
        async fetchTrustedIssuersLists({ commit }) {
            const response = await this.$api.get("/trusted-issuers-lists");
            const trustedIssuersLists = response.data;
            trustedIssuersLists.forEach(trustedIssuersList => {
                commit("setTrustedIssuersList", trustedIssuersList);
            });
        },
        async storeTrustedIssuersList({ commit }, trustedIssuersList) {
            let response;
            try {
                response = await this.$api.post("/trusted-issuers-lists", trustedIssuersList);
            } catch (error) {
                throw error.response.data || {};
            }
            trustedIssuersList = response.data;
            commit("setTrustedIssuersList", trustedIssuersList);
            return trustedIssuersList;
        },
        async updateTrustedIssuersList({ commit }, trustedIssuersList) {
            trustedIssuersList = JSON.parse(JSON.stringify(trustedIssuersList));
            const trustedIssuersListId = trustedIssuersList.id;
            delete trustedIssuersList.id;
            let response;
            try {
                response = await this.$api.put("/trusted-issuers-lists/" + trustedIssuersListId, trustedIssuersList);
            } catch (error) {
                throw error.response.data || {};
            }
            trustedIssuersList = response.data;
            commit("setTrustedIssuersList", trustedIssuersList);
        },
        async destroyTrustedIssuersList({ commit }, trustedIssuersList) {
            try {
                await this.$api.delete("/trusted-issuers-lists/" + trustedIssuersList.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeTrustedIssuersList", trustedIssuersList);
        }
    }
};
