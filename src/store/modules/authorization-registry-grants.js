export default {
    namespaced: true,
    state() {
        return {
            authorizationRegistryGrants: {}
        }
    },
    getters: {
        getAuthorizationRegistryGrants(state) {
            return state.authorizationRegistryGrants;
        },
        getAuthorizationRegistryGrant(state) {
            return authorizationRegistryGrantId => {
                return state.authorizationRegistryGrants[authorizationRegistryGrantId];
            };
        }
    },
    mutations: {
        setAuthorizationRegistryGrant(state, authorizationRegistryGrant) {
            state.authorizationRegistryGrants[authorizationRegistryGrant.id] = authorizationRegistryGrant;
        },
        removeAuthorizationRegistryGrant(state, authorizationRegistryGrant) {
            delete state.authorizationRegistryGrants[authorizationRegistryGrant.id];
        }
    },
    actions: {
        async fetchAuthorizationRegistryGrants({ commit }) {
            const response = await this.$api.get("/authorization-registry-grants");
            const authorizationRegistryGrants = response.data;
            authorizationRegistryGrants.forEach(authorizationRegistryGrant => {
                commit("setAuthorizationRegistryGrant", authorizationRegistryGrant);
            });
        },
        async storeAuthorizationRegistryGrant({ commit }, authorizationRegistryGrant) {
            let response;
            try {
                response = await this.$api.post("/authorization-registry-grants", authorizationRegistryGrant);
            } catch (error) {
                throw error.response.data || {};
            }
            authorizationRegistryGrant = response.data;
            commit("setAuthorizationRegistryGrant", authorizationRegistryGrant);
            return authorizationRegistryGrant;
        },
        async updateAuthorizationRegistryGrant({ commit }, authorizationRegistryGrant) {
            authorizationRegistryGrant = JSON.parse(JSON.stringify(authorizationRegistryGrant));
            const authorizationRegistryGrantId = authorizationRegistryGrant.id;
            delete authorizationRegistryGrant.id;
            let response;
            try {
                response = await this.$api.put("/authorization-registry-grants/" + authorizationRegistryGrantId, authorizationRegistryGrant);
            } catch (error) {
                throw error.response.data || {};
            }
            authorizationRegistryGrant = response.data;
            commit("setAuthorizationRegistryGrant", authorizationRegistryGrant);
        },
        async destroyAuthorizationRegistryGrant({ commit }, authorizationRegistryGrant) {
            try {
                await this.$api.delete("/authorization-registry-grants/" + authorizationRegistryGrant.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeAuthorizationRegistryGrant", authorizationRegistryGrant);
        }
    }
};
