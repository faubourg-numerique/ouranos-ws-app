import { Subscription } from "@/classes/Subscription";

export default {
    namespaced: true,
    actions: {
        async indexSubscriptions(context, { workspaceId, query }) {
            try {
                const response = await this.$api.get(`/workspace/${workspaceId}/subscriptions`, { params: query });
                const subscriptions = {};
                response.data.forEach(subscription => {
                    subscriptions[subscription.id] = new Subscription(subscription);
                });
                return subscriptions;
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async storeSubscription(context, { workspaceId, subscription }) {
            try {
                const response = await this.$api.post(`/workspace/${workspaceId}/subscriptions`, subscription.toObject());
                return new Subscription(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async showSubscription(context, { workspaceId, subscriptionId }) {
            try {
                const response = await this.$api.get(`/workspace/${workspaceId}/subscriptions/${subscriptionId}`);
                return new Subscription(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async updateSubscription(context, { workspaceId, subscription }) {
            try {
                const response = await this.$api.put(`/workspace/${workspaceId}/subscriptions/${subscription.getId()}`, subscription.toObjectWithoutIdAndType());
                return new Subscription(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async destroySubscription(context, { workspaceId, subscription }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/subscriptions/${subscription.getId()}`);
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
