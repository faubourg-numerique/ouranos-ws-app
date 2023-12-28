export default {
    namespaced: true,
    state() {
        return {
            woTEvents: {}
        }
    },
    getters: {
        getWoTEvents(state) {
            return (workspaceId, woTThingDescriptionId) => {
                if (!(workspaceId in state.woTEvents)) return [];
                return Object.values(state.woTEvents[workspaceId]).filter((woTEvent) => woTEvent.hasWoTThingDescription === woTThingDescriptionId);
            };
        },
        getWoTEvent(state) {
            return (workspaceId, woTEventId) => {
                if (!(workspaceId in state.woTEvents)) return null;
                return state.woTEvents[workspaceId][woTEventId];
            };
        }
    },
    mutations: {
        setWoTEvent(state, { workspaceId, woTEvent }) {
            if (!(workspaceId in state.woTEvents)) {
                state.woTEvents[workspaceId] = {};
            }
            state.woTEvents[workspaceId][woTEvent.id] = woTEvent;
        },
        removeWoTEvent(state, { workspaceId, woTEvent }) {
            if (!(workspaceId in state.woTEvents)) return null;
            delete state.woTEvents[workspaceId][woTEvent.id];
        }
    },
    actions: {
        async fetchWoTEvents({ commit }, workspaceId) {
            const response = await this.$api.get(`/workspace/${workspaceId}/wot-events`);
            const woTEvents = response.data;
            woTEvents.forEach(woTEvent => {
                commit("setWoTEvent", { workspaceId, woTEvent });
            });
        },
        async storeWoTEvent({ commit }, { workspaceId, woTEvent }) {
            let response;
            try {
                response = await this.$api.post(`/workspace/${workspaceId}/wot-events`, woTEvent);
            } catch (error) {
                throw error.response.data || {};
            }
            woTEvent = response.data;
            commit("setWoTEvent", { workspaceId, woTEvent });
            return woTEvent;
        },
        async updateWoTEvent({ commit, dispatch }, { workspaceId, woTEvent }) {
            woTEvent = JSON.parse(JSON.stringify(woTEvent));
            const woTEventId = woTEvent.id;
            delete woTEvent.id;
            let response;
            try {
                response = await this.$api.put(`/workspace/${workspaceId}/wot-events/${woTEventId}`, woTEvent);
            } catch (error) {
                throw error.response.data || {};
            }
            woTEvent = response.data;
            commit("setWoTEvent", { workspaceId, woTEvent });
        },
        async destroyWoTEvent({ commit }, { workspaceId, woTEvent }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/wot-events/${woTEvent.id}`);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWoTEvent", { workspaceId, woTEvent });
        }
    }
};
