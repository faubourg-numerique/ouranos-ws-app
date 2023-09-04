export default {
    namespaced: true,
    state() {
        return {
            temporalServices: {}
        }
    },
    getters: {
        getTemporalServices(state) {
            return state.temporalServices;
        },
        getTemporalService(state) {
            return temporalServiceId => {
                return state.temporalServices[temporalServiceId];
            };
        }
    },
    mutations: {
        setTemporalService(state, temporalService) {
            state.temporalServices[temporalService.id] = temporalService;
        },
        removeTemporalService(state, temporalService) {
            delete state.temporalServices[temporalService.id];
        }
    },
    actions: {
        async fetchTemporalServices({ commit }) {
            const response = await this.$api.get("/temporal-services");
            const temporalServices = response.data;
            temporalServices.forEach(temporalService => {
                commit("setTemporalService", temporalService);
            });
        },
        async storeTemporalService({ commit }, temporalService) {
            let response;
            try {
                response = await this.$api.post("/temporal-services", temporalService);
            } catch (error) {
                throw error.response.data || {};
            }
            temporalService = response.data;
            commit("setTemporalService", temporalService);
            return temporalService;
        },
        async updateTemporalService({ commit }, temporalService) {
            temporalService = JSON.parse(JSON.stringify(temporalService));
            const temporalServiceId = temporalService.id;
            delete temporalService.id;
            let response;
            try {
                response = await this.$api.put("/temporal-services/" + temporalServiceId, temporalService);
            } catch (error) {
                throw error.response.data || {};
            }
            temporalService = response.data;
            commit("setTemporalService", temporalService);
        },
        async destroyTemporalService({ commit }, temporalService) {
            try {
                await this.$api.delete("/temporal-services/" + temporalService.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeTemporalService", temporalService);
        }
    }
};
