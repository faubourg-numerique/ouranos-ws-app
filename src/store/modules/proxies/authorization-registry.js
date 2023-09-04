export default {
    namespaced: true,
    actions: {
        async createPolicy(context, { authorizationRegistryId, authorizationRegistryGrantId, delegationEvidence }) {
            const config = {
                params: {
                    authorizationRegistryId,
                    authorizationRegistryGrantId
                }
            };
            try {
                await this.$api.post("/proxies/authorization-registry/create-policy", delegationEvidence, config);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async requestDelegation(context, { authorizationRegistryId, authorizationRegistryGrantId, delegationRequest }) {
            let response;
            const config = {
                params: {
                    authorizationRegistryId,
                    authorizationRegistryGrantId
                }
            };
            try {
                response = await this.$api.post("/proxies/authorization-registry/request-delegation", delegationRequest, config);
            } catch (error) {
                throw error.response.data || {};
            }
            const delegationEvidence = response.data;
            return delegationEvidence;
        }
    }
};
