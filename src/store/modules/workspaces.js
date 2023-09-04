export default {
    namespaced: true,
    state() {
        return {
            workspaces: {}
        }
    },
    getters: {
        getWorkspaces(state) {
            return state.workspaces;
        },
        getWorkspace(state) {
            return workspaceId => {
                return state.workspaces[workspaceId];
            };
        }
    },
    mutations: {
        setWorkspace(state, workspace) {
            state.workspaces[workspace.id] = workspace;
        },
        removeWorkspace(state, workspace) {
            delete state.workspaces[workspace.id];
        }
    },
    actions: {
        async fetchWorkspace({ commit }, workspaceId) {
            const response = await this.$api.get("/workspaces/" + workspaceId);
            const workspace = response.data;
            commit("setWorkspace", workspace);
        },
        async fetchWorkspaces({ commit }) {
            const response = await this.$api.get("/workspaces");
            const workspaces = response.data;
            workspaces.forEach(workspace => {
                commit("setWorkspace", workspace);
            });
        },
        async storeWorkspace({ commit }, workspace) {
            let response;
            try {
                response = await this.$api.post("/workspaces", workspace);
            } catch (error) {
                throw error.response.data || {};
            }
            workspace = response.data;
            commit("setWorkspace", workspace);
            return workspace;
        },
        async updateWorkspace({ commit }, workspace) {
            workspace = JSON.parse(JSON.stringify(workspace));
            const workspaceId = workspace.id;
            delete workspace.id;
            delete workspace.dataModelUpToDate;
            let response;
            try {
                response = await this.$api.put("/workspaces/" + workspaceId, workspace);
            } catch (error) {
                throw error.response.data || {};
            }
            workspace = response.data;
            commit("setWorkspace", workspace);
        },
        async destroyWorkspace({ commit }, workspace) {
            try {
                await this.$api.delete("/workspaces/" + workspace.id);
            } catch (error) {
                throw error.response.data || {};
            }
            commit("removeWorkspace", workspace);
        },
        async generateDataModel({ commit }, workspace) {
            workspace = JSON.parse(JSON.stringify(workspace));
            let response;
            try {
                await this.$api.post("/workspaces/" + workspace.id + "/data-model/generate");
                response = await this.$api.get("/workspaces/" + workspace.id);
            } catch (error) {
                throw error.response.data || {};
            }
            workspace = response.data;
            commit("setWorkspace", workspace);
        }
    }
};
