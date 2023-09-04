export default {
    namespaced: true,
    state() {
        return {
            contextBrokers: {}
        }
    },
    getters: {
        getContextBrokers(state) {
            return state.contextBrokers;
        },
        getContextBroker(state) {
            return contextBrokerId => {
                return state.contextBrokers[contextBrokerId];
            };
        }
    },
    mutations: {
        setContextBroker(state, contextBroker) {
            state.contextBrokers[contextBroker.id] = contextBroker;
        },
        removeContextBroker(state, contextBroker) {
            delete state.contextBrokers[contextBroker.id];
        }
    },
    actions: {
        async fetchContextBrokers({ commit }) {
            const response = await this.$api.get("/context-brokers");
            const contextBrokers = response.data;
            contextBrokers.forEach(contextBroker => {
                commit("setContextBroker", contextBroker);
            });
        },
        async storeContextBroker({ commit }, contextBroker) {
            let response;
            try {
                response = await this.$api.post("/context-brokers", contextBroker);
            } catch (error) {
                throw error.response.data || {};
            }
            contextBroker = response.data;
            commit("setContextBroker", contextBroker);
            return contextBroker;
        },
        async updateContextBroker({ commit }, contextBroker) {
            contextBroker = JSON.parse(JSON.stringify(contextBroker));
            const contextBrokerId = contextBroker.id;
            delete contextBroker.id;
            let response;
            try {
                response = await this.$api.put("/context-brokers/" + contextBrokerId, contextBroker);
            } catch (error) {
                throw error.response.data || {};
            }
            contextBroker = response.data;
            commit("setContextBroker", contextBroker);
        },
        async destroyContextBroker({ commit }, contextBroker) {
            try {
                await this.$api.delete("/context-brokers/" + contextBroker.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeContextBroker", contextBroker);
        }
    }
};
