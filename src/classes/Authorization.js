import Utils from "@/classes/Utils";

export class Authorization {
    constructor() {
        this.permissions = {};
    }

    loadPermissions(permissions) {
        permissions.forEach(permission => {
            const action = permission.action.toUpperCase();
            if (!this.permissions[action]) {
                this.permissions[action] = [];
            }
            this.permissions[action].push(permission.resource);
        });
    }

    canIndexWorkspaces() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/workspaces")) {
                return true;
            }
        }
        return false;
    }

    canStoreWorkspace() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/workspaces")) {
                return true;
            }
        }
        return false;
    }

    canShowWorkspace(workspaceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspaces/${workspaceId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateWorkspace(workspaceId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspaces/${workspaceId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyWorkspace(workspaceId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspaces/${workspaceId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexServices() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/services")) {
                return true;
            }
        }
        return false;
    }

    canStoreService() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/services")) {
                return true;
            }
        }
        return false;
    }

    canShowService(serviceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/services/${serviceId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateService(serviceId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/services/${serviceId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyService(serviceId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/services/${serviceId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexContextBrokers() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/context-brokers")) {
                return true;
            }
        }
        return false;
    }

    canStoreContextBroker() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/context-brokers")) {
                return true;
            }
        }
        return false;
    }

    canShowContextBroker(contextBrokerId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/context-brokers/${contextBrokerId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateContextBroker(contextBrokerId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/context-brokers/${contextBrokerId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyContextBroker(contextBrokerId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/context-brokers/${contextBrokerId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexIdentityManagers() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/identity-managers")) {
                return true;
            }
        }
        return false;
    }

    canStoreIdentityManager() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/identity-managers")) {
                return true;
            }
        }
        return false;
    }

    canShowIdentityManager(identityManagerId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/identity-managers/${identityManagerId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateIdentityManager(identityManagerId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/identity-managers/${identityManagerId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyIdentityManager(identityManagerId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/identity-managers/${identityManagerId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexIdentityManagerGrants() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/identity-manager-grants")) {
                return true;
            }
        }
        return false;
    }

    canStoreIdentityManagerGrant() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/identity-manager-grants")) {
                return true;
            }
        }
        return false;
    }

    canShowIdentityManagerGrant(identityManagerGrantId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/identity-manager-grants/${identityManagerGrantId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateIdentityManagerGrant(identityManagerGrantId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/identity-manager-grants/${identityManagerGrantId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyIdentityManagerGrant(identityManagerGrantId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/identity-manager-grants/${identityManagerGrantId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexTemporalServices() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/temporal-services")) {
                return true;
            }
        }
        return false;
    }

    canStoreTemporalService() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/temporal-services")) {
                return true;
            }
        }
        return false;
    }

    canShowTemporalService(temporalServiceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/temporal-services/${temporalServiceId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateTemporalService(temporalServiceId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/temporal-services/${temporalServiceId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyTemporalService(temporalServiceId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/temporal-services/${temporalServiceId}`)) {
                return true;
            }
        }
        return false;
    }

    canGenerateDataModel(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-model/generate`)) {
                return true;
            }
        }
        return false;
    }

    canIndexTypes(workspaceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/types`)) {
                return true;
            }
        }
        return false;
    }

    canStoreType(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/types`)) {
                return true;
            }
        }
        return false;
    }

    canShowType(workspaceId, typeId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/types/${typeId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateType(workspaceId, typeId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/types/${typeId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyType(workspaceId, typeId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/types/${typeId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateTypePositionInChart(workspaceId, typeId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/types/${typeId}/position-in-chart`)) {
                return true;
            }
        }
        return false;
    }

    canIndexProperties(workspaceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/properties`)) {
                return true;
            }
        }
        return false;
    }

    canStoreProperty(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/properties`)) {
                return true;
            }
        }
        return false;
    }

    canShowProperty(workspaceId, propertyId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/properties/${propertyId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateProperty(workspaceId, propertyId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/properties/${propertyId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyProperty(workspaceId, propertyId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/properties/${propertyId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexEntities(workspaceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/entities`)) {
                return true;
            }
        }
        return false;
    }

    canStoreEntity(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/entities`)) {
                return true;
            }
        }
        return false;
    }

    canShowEntity(workspaceId, entityId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/entities/${entityId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateEntity(workspaceId, entityId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/entities/${entityId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyEntity(workspaceId, entityId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/entities/${entityId}`)) {
                return true;
            }
        }
        return false;
    }

    canShowTemporalEntity(workspaceId, temporalEntityId, propertyId, temporalServiceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/temporal-entities/${temporalEntityId}/properties/${propertyId}/temporal-services/${temporalServiceId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexSubscriptions(workspaceId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/subscriptions`)) {
                return true;
            }
        }
        return false;
    }

    canStoreSubscription(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/subscriptions`)) {
                return true;
            }
        }
        return false;
    }

    canShowSubscription(workspaceId, subscriptionId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/subscriptions/${subscriptionId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateSubscription(workspaceId, subscriptionId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/subscriptions/${subscriptionId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroySubscription(workspaceId, subscriptionId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/subscriptions/${subscriptionId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexAuthorizationRegistries() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/authorization-registries")) {
                return true;
            }
        }
        return false;
    }

    canStoreAuthorizationRegistry() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/authorization-registries")) {
                return true;
            }
        }
        return false;
    }

    canShowAuthorizationRegistry(authorizationRegistryId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/authorization-registries/${authorizationRegistryId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateAuthorizationRegistry(authorizationRegistryId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/authorization-registries/${authorizationRegistryId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyAuthorizationRegistry(authorizationRegistryId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/authorization-registries/${authorizationRegistryId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexAuthorizationRegistryGrants() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/authorization-registry-grants")) {
                return true;
            }
        }
        return false;
    }

    canStoreAuthorizationRegistryGrant() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/authorization-registry-grants")) {
                return true;
            }
        }
        return false;
    }

    canShowAuthorizationRegistryGrant(authorizationRegistryGrantId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/authorization-registry-grants/${authorizationRegistryGrantId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateAuthorizationRegistryGrant(authorizationRegistryGrantId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/authorization-registry-grants/${authorizationRegistryGrantId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyAuthorizationRegistryGrant(authorizationRegistryGrantId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/authorization-registry-grants/${authorizationRegistryGrantId}`)) {
                return true;
            }
        }
        return false;
    }

    canUseAuthorizationRegistriesTool() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/proxies/authorization-registry/create-policy")) {
                return true;
            }
            if (Utils.regexMatch(pattern, "/proxies/authorization-registry/request-delegation")) {
                return true;
            }
        }
        return false;
    }

    canStoreDataService(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-services`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateDataService(workspaceId, dataServiceId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-services/${dataServiceId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyDataService(workspaceId, dataServiceId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-services/${dataServiceId}`)) {
                return true;
            }
        }
        return false;
    }

    isInShowroomMode() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (pattern === "/showroom") {
                return true;
            }
        }
        return false;
    }

    canStoreDataServiceOffer(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-service-offers`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateDataServiceOffer(workspaceId, dataServiceOfferId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-service-offers/${dataServiceOfferId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyDataServiceOffer(workspaceId, dataServiceOfferId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-service-offers/${dataServiceOfferId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreDataServiceAccess(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-service-accesses`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateDataServiceAccess(workspaceId, dataServiceAccessId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-service-accesses/${dataServiceAccessId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyDataServiceAccess(workspaceId, dataServiceAccessId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/data-service-accesses/${dataServiceAccessId}`)) {
                return true;
            }
        }
        return false;
    }

    canIndexVCVerifiers() {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, "/api/vc-verifiers")) {
                return true;
            }
        }
        return false;
    }

    canStoreVCVerifier() {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, "/api/vc-verifiers")) {
                return true;
            }
        }
        return false;
    }

    canShowVCVerifier(vcVerifierId) {
        if (!this.permissions.GET) {
            return false;
        }
        for (const pattern of this.permissions.GET) {
            if (Utils.regexMatch(pattern, `/api/vc-verifiers/${vcVerifierId}`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateVCVerifier(vcVerifierId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/vc-verifiers/${vcVerifierId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyVCVerifier(vcVerifierId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/vc-verifiers/${vcVerifierId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreWoTAction(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-actions`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateWoTAction(workspaceId, woTActionId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-actions/${woTActionId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyWoTAction(workspaceId, woTActionId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-actions/${woTActionId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreWoTProperty(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-properties`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateWoTProperty(workspaceId, woTPropertyId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-properties/${woTPropertyId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyWoTProperty(workspaceId, woTPropertyId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-properties/${woTPropertyId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreRouting(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routings`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateRouting(workspaceId, routingId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routings/${routingId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyRouting(workspaceId, routingId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routings/${routingId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreRoutingOperation(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routing-operations`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateRoutingOperation(workspaceId, routingOperationId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routing-operations/${routingOperationId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyRoutingOperation(workspaceId, routingOperationId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routing-operations/${routingOperationId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreRoutingOperationControl(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routing-operation-controls`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateRoutingOperationControl(workspaceId, routingOperationControlId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routing-operation-controls/${routingOperationControlId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyRoutingOperationControl(workspaceId, routingOperationControlId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/routing-operation-controls/${routingOperationControlId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreWoTThingDescription(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-thing-descriptions`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateWoTThingDescription(workspaceId, woTThingDescriptionId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-thing-descriptions/${woTThingDescriptionId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyWoTThingDescription(workspaceId, woTThingDescriptionId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-thing-descriptions/${woTThingDescriptionId}`)) {
                return true;
            }
        }
        return false;
    }

    canStoreWoTEvent(workspaceId) {
        if (!this.permissions.POST) {
            return false;
        }
        for (const pattern of this.permissions.POST) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-events`)) {
                return true;
            }
        }
        return false;
    }

    canUpdateWoTEvent(workspaceId, woTEventId) {
        if (!this.permissions.PUT) {
            return false;
        }
        for (const pattern of this.permissions.PUT) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-events/${woTEventId}`)) {
                return true;
            }
        }
        return false;
    }

    canDestroyWoTEvent(workspaceId, woTEventId) {
        if (!this.permissions.DELETE) {
            return false;
        }
        for (const pattern of this.permissions.DELETE) {
            if (Utils.regexMatch(pattern, `/api/workspace/${workspaceId}/wot-events/${woTEventId}`)) {
                return true;
            }
        }
        return false;
    }
}
