export default {
    namespaced: true,
    state() {
        return {
            vcVerifiers: {}
        }
    },
    getters: {
        getVCVerifiers(state) {
            return state.vcVerifiers;
        },
        getVCVerifier(state) {
            return vcVerifierId => {
                return state.vcVerifiers[vcVerifierId];
            };
        }
    },
    mutations: {
        setVCVerifier(state, vcVerifier) {
            state.vcVerifiers[vcVerifier.id] = vcVerifier;
        },
        removeVCVerifier(state, vcVerifier) {
            delete state.vcVerifiers[vcVerifier.id];
        }
    },
    actions: {
        async fetchVCVerifiers({ commit }) {
            const response = await this.$api.get("/vc-verifiers");
            const vcVerifiers = response.data;
            vcVerifiers.forEach(vcVerifier => {
                commit("setVCVerifier", vcVerifier);
            });
        },
        async storeVCVerifier({ commit }, vcVerifier) {
            let response;
            try {
                response = await this.$api.post("/vc-verifiers", vcVerifier);
            } catch (error) {
                throw error.response.data || {};
            }
            vcVerifier = response.data;
            commit("setVCVerifier", vcVerifier);
            return vcVerifier;
        },
        async updateVCVerifier({ commit }, vcVerifier) {
            vcVerifier = JSON.parse(JSON.stringify(vcVerifier));
            const vcVerifierId = vcVerifier.id;
            delete vcVerifier.id;
            let response;
            try {
                response = await this.$api.put("/vc-verifiers/" + vcVerifierId, vcVerifier);
            } catch (error) {
                throw error.response.data || {};
            }
            vcVerifier = response.data;
            commit("setVCVerifier", vcVerifier);
        },
        async destroyVCVerifier({ commit }, vcVerifier) {
            try {
                await this.$api.delete("/vc-verifiers/" + vcVerifier.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeVCVerifier", vcVerifier);
        }
    }
};
