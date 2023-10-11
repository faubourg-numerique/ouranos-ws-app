import { Entity } from "@/classes/Entity";

export default {
    namespaced: true,
    actions: {
        async indexEntities({ rootGetters }, { workspaceId, query }) {
            try {
                const headers = {};
                const accessToken = rootGetters["authentication/getSIOP2AccessToken"](workspaceId);
                if (accessToken) {
                    headers["Gateway-Authorization"] = `Bearer ${accessToken}`;
                }
                const response = await this.$api.get(`/workspace/${workspaceId}/entities`, { params: query, headers });
                const entities = {};
                response.data.forEach(entity => {
                    entities[entity.id] = new Entity(entity);
                });
                return entities;
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async storeEntity({ rootGetters }, { workspaceId, entity }) {
            try {
                const headers = {};
                const accessToken = rootGetters["authentication/getSIOP2AccessToken"](workspaceId);
                if (accessToken) {
                    headers["Gateway-Authorization"] = `Bearer ${accessToken}`;
                }
                const response = await this.$api.post(`/workspace/${workspaceId}/entities`, entity.toObject(), { headers });
                return new Entity(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async showEntity({ rootGetters }, { workspaceId, entityId }) {
            try {
                const headers = {};
                const accessToken = rootGetters["authentication/getSIOP2AccessToken"](workspaceId);
                if (accessToken) {
                    headers["Gateway-Authorization"] = `Bearer ${accessToken}`;
                }
                const response = await this.$api.get(`/workspace/${workspaceId}/entities/${entityId}`, { headers });
                return new Entity(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async updateEntity({ rootGetters }, { workspaceId, entity }) {
            try {
                const headers = {};
                const accessToken = rootGetters["authentication/getSIOP2AccessToken"](workspaceId);
                if (accessToken) {
                    headers["Gateway-Authorization"] = `Bearer ${accessToken}`;
                }
                const response = await this.$api.put(`/workspace/${workspaceId}/entities/${entity.getId()}`, entity.toObjectWithoutIdAndType(), { headers });
                return new Entity(response.data);
            } catch (error) {
                throw error.response.data || {};
            }
        },
        async destroyEntity({ rootGetters }, { workspaceId, entity }) {
            try {
                const headers = {};
                const accessToken = rootGetters["authentication/getSIOP2AccessToken"](workspaceId);
                if (accessToken) {
                    headers["Gateway-Authorization"] = `Bearer ${accessToken}`;
                }
                await this.$api.delete(`/workspace/${workspaceId}/entities/${entity.getId()}`, { headers });
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
