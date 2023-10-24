export default {
    namespaced: true,
    actions: {
        async generateDataModel(context, workspaceId) {
            try {
                await this.$api.post("/workspace/" + workspaceId + "/data-model/generate");
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async autoDiscoverDataModel(context, workspaceId) {
            try {
                await this.$api.post("/workspace/" + workspaceId + "/data-model/auto-discover");
                await this.dispatch("workspaces/fetchWorkspace", workspaceId);
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
