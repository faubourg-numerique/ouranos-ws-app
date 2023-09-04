export default {
    namespaced: true,
    state() {
        return {
            authorizationRegistries: {}
        }
    },
    getters: {
        getAuthorizationRegistries(state) {
            return state.authorizationRegistries;
        },
        getAuthorizationRegistry(state) {
            return authorizationRegistryId => {
                return state.authorizationRegistries[authorizationRegistryId];
            };
        }
    },
    mutations: {
        setAuthorizationRegistry(state, authorizationRegistry) {
            state.authorizationRegistries[authorizationRegistry.id] = authorizationRegistry;
        },
        removeAuthorizationRegistry(state, authorizationRegistry) {
            delete state.authorizationRegistries[authorizationRegistry.id];
        }
    },
    actions: {
        async fetchAuthorizationRegistries({ commit }) {
            const response = await this.$api.get("/authorization-registries");
            const authorizationRegistries = response.data;
            authorizationRegistries.forEach(authorizationRegistry => {
                commit("setAuthorizationRegistry", authorizationRegistry);
            });
        },
        async storeAuthorizationRegistry({ commit }, authorizationRegistry) {
            let response;
            try {
                response = await this.$api.post("/authorization-registries", authorizationRegistry);
            } catch (error) {
                throw error.response.data || {};
            }
            authorizationRegistry = response.data;
            commit("setAuthorizationRegistry", authorizationRegistry);
            return authorizationRegistry;
        },
        async updateAuthorizationRegistry({ commit }, authorizationRegistry) {
            authorizationRegistry = JSON.parse(JSON.stringify(authorizationRegistry));
            const authorizationRegistryId = authorizationRegistry.id;
            delete authorizationRegistry.id;
            let response;
            try {
                response = await this.$api.put("/authorization-registries/" + authorizationRegistryId, authorizationRegistry);
            } catch (error) {
                throw error.response.data || {};
            }
            authorizationRegistry = response.data;
            commit("setAuthorizationRegistry", authorizationRegistry);
        },
        async destroyAuthorizationRegistry({ commit }, authorizationRegistry) {
            try {
                await this.$api.delete("/authorization-registries/" + authorizationRegistry.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeAuthorizationRegistry", authorizationRegistry);
        }
    }
};
