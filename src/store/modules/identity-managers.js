export default {
    namespaced: true,
    state() {
        return {
            identityManagers: {}
        }
    },
    getters: {
        getIdentityManagers(state) {
            return state.identityManagers;
        },
        getIdentityManager(state) {
            return identityManagerId => {
                return state.identityManagers[identityManagerId];
            };
        }
    },
    mutations: {
        setIdentityManager(state, identityManager) {
            state.identityManagers[identityManager.id] = identityManager;
        },
        removeIdentityManager(state, identityManager) {
            delete state.identityManagers[identityManager.id];
        }
    },
    actions: {
        async fetchIdentityManagers({ commit }) {
            const response = await this.$api.get("/identity-managers");
            const identityManagers = response.data;
            identityManagers.forEach(identityManager => {
                commit("setIdentityManager", identityManager);
            });
        },
        async storeIdentityManager({ commit }, identityManager) {
            let response;
            try {
                response = await this.$api.post("/identity-managers", identityManager);
            } catch (error) {
                throw error.response.data || {};
            }
            identityManager = response.data;
            commit("setIdentityManager", identityManager);
            return identityManager;
        },
        async updateIdentityManager({ commit }, identityManager) {
            identityManager = JSON.parse(JSON.stringify(identityManager));
            const identityManagerId = identityManager.id;
            delete identityManager.id;
            let response;
            try {
                response = await this.$api.put("/identity-managers/" + identityManagerId, identityManager);
            } catch (error) {
                throw error.response.data || {};
            }
            identityManager = response.data;
            commit("setIdentityManager", identityManager);
        },
        async destroyIdentityManager({ commit }, identityManager) {
            try {
                await this.$api.delete("/identity-managers/" + identityManager.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeIdentityManager", identityManager);
        }
    }
};
