export default {
    namespaced: true,
    actions: {
        async showTemporalEntityProperty(context, { workspaceId, entityId, propertyId, temporalServiceId, fromTime, toTime }) {
            try {
                const response = await this.$api.get(`/workspace/${workspaceId}/temporal-entities/${entityId}/properties/${propertyId}/temporal-services/${temporalServiceId}`, { params: { fromTime, toTime } });
                return response.data;
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
