export default {
    namespaced: true,
    state() {
        return {
            services: {}
        }
    },
    getters: {
        getServices(state) {
            return state.services;
        },
        getService(state) {
            return serviceId => {
                return state.services[serviceId];
            };
        }
    },
    mutations: {
        setService(state, service) {
            state.services[service.id] = service;
        },
        removeService(state, service) {
            delete state.services[service.id];
        }
    },
    actions: {
        async fetchServices({ commit }) {
            const response = await this.$api.get("/services");
            const services = response.data;
            services.forEach(service => {
                commit("setService", service);
            });
        },
        async storeService({ commit }, service) {
            let response;
            try {
                response = await this.$api.post("/services", service);
            } catch (error) {
                throw error.response.data || {};
            }
            service = response.data;
            commit("setService", service);
            return service;
        },
        async updateService({ commit }, service) {
            service = JSON.parse(JSON.stringify(service));
            const serviceId = service.id;
            delete service.id;
            let response;
            try {
                response = await this.$api.put("/services/" + serviceId, service);
            } catch (error) {
                throw error.response.data || {};
            }
            service = response.data;
            commit("setService", service);
        },
        async destroyService({ commit }, service) {
            try {
                await this.$api.delete("/services/" + service.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeService", service);
        }
    }
};
