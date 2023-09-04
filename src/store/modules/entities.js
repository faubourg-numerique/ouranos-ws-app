import { Entity } from "@/classes/Entity";

export default {
    namespaced: true,
    actions: {
        async indexEntities(context, { workspaceId, query }) {
            try {
                const response = await this.$api.get(`/workspace/${workspaceId}/entities`, { params: query });
                const entities = {};
                response.data.forEach(entity => {
                    entities[entity.id] = new Entity(entity);
                });
                return entities;
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async storeEntity(context, { workspaceId, entity }) {
            try {
                const response = await this.$api.post(`/workspace/${workspaceId}/entities`, entity.toObject());
                return new Entity(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async showEntity(context, { workspaceId, entityId }) {
            try {
                const response = await this.$api.get(`/workspace/${workspaceId}/entities/${entityId}`);
                return new Entity(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async updateEntity(context, { workspaceId, entity }) {
            try {
                const response = await this.$api.put(`/workspace/${workspaceId}/entities/${entity.getId()}`, entity.toObjectWithoutIdAndType());
                return new Entity(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async destroyEntity(context, { workspaceId, entity }) {
            try {
                await this.$api.delete(`/workspace/${workspaceId}/entities/${entity.getId()}`);
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
