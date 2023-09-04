export default {
    namespaced: true,
    state() {
        return {
            identityManagerGrants: {}
        }
    },
    getters: {
        getIdentityManagerGrants(state) {
            return state.identityManagerGrants;
        },
        getIdentityManagerGrant(state) {
            return identityManagerGrantId => {
                return state.identityManagerGrants[identityManagerGrantId];
            };
        }
    },
    mutations: {
        setIdentityManagerGrant(state, identityManagerGrant) {
            state.identityManagerGrants[identityManagerGrant.id] = identityManagerGrant;
        },
        removeIdentityManagerGrant(state, identityManagerGrant) {
            delete state.identityManagerGrants[identityManagerGrant.id];
        }
    },
    actions: {
        async fetchIdentityManagerGrants({ commit }) {
            const response = await this.$api.get("/identity-manager-grants");
            const identityManagerGrants = response.data;
            identityManagerGrants.forEach(identityManagerGrant => {
                commit("setIdentityManagerGrant", identityManagerGrant);
            });
        },
        async storeIdentityManagerGrant({ commit }, identityManagerGrant) {
            let response;
            try {
                response = await this.$api.post("/identity-manager-grants", identityManagerGrant);
            } catch (error) {
                throw error.response.data || {};
            }
            identityManagerGrant = response.data;
            commit("setIdentityManagerGrant", identityManagerGrant);
            return identityManagerGrant;
        },
        async updateIdentityManagerGrant({ commit }, identityManagerGrant) {
            identityManagerGrant = JSON.parse(JSON.stringify(identityManagerGrant));
            const identityManagerGrantId = identityManagerGrant.id;
            delete identityManagerGrant.id;
            let response;
            try {
                response = await this.$api.put("/identity-manager-grants/" + identityManagerGrantId, identityManagerGrant);
            } catch (error) {
                throw error.response.data || {};
            }
            identityManagerGrant = response.data;
            commit("setIdentityManagerGrant", identityManagerGrant);
        },
        async destroyIdentityManagerGrant({ commit }, identityManagerGrant) {
            try {
                await this.$api.delete("/identity-manager-grants/" + identityManagerGrant.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeIdentityManagerGrant", identityManagerGrant);
        }
    }
};
