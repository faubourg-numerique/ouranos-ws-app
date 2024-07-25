import { createStore } from "vuex";

import identityManagerGrants from "@/store/modules/identity-manager-grants";
import identityManagers from "@/store/modules/identity-managers";
import contextBrokers from "@/store/modules/context-brokers";
import services from "@/store/modules/services";
import temporalServices from "@/store/modules/temporal-services";
import workspaces from "@/store/modules/workspaces";
import types from "@/store/modules/types";
import properties from "@/store/modules/properties";
import entities from "@/store/modules/entities";
import temporalEntityProperties from "@/store/modules/temporal-entity-properties";
import subscriptions from "@/store/modules/subscriptions";
import dataModel from "@/store/modules/data-model";
import authentication from "@/store/modules/authentication";
import authorizationRegistryGrants from "@/store/modules/authorization-registry-grants";
import authorizationRegistries from "@/store/modules/authorization-registries";
import authorizationRegistryProxy from "@/store/modules/proxies/authorization-registry";
import contracts from "@/store/modules/contracts";
import contractDetails from "@/store/modules/contract-details";
import dataActions from "@/store/modules/data-actions";
import dataServices from "@/store/modules/data-services";
import dataServiceActions from "@/store/modules/data-service-actions";
import dataServiceProperties from "@/store/modules/data-service-properties";
import dataServiceOffers from "@/store/modules/data-service-offers";
import dataServiceAccesses from "@/store/modules/data-service-accesses";
import vcVerifiers from "@/store/modules/vc-verifiers";
import trustedIssuersLists from "@/store/modules/trusted-issuers-lists";
import googleSheetsProxy from "@/store/modules/proxies/google-sheets";
import woTActions from "@/store/modules/wot-actions";
import woTProperties from "@/store/modules/wot-properties";
import routings from "@/store/modules/routings";
import routingOperations from "@/store/modules/routing-operations";
import routingOperationControls from "@/store/modules/routing-operation-controls";
import woTThingDescriptions from "@/store/modules/wot-thing-descriptions";
import woTEvents from "@/store/modules/wot-events";
import roles from "@/store/modules/roles";
import users from "@/store/modules/users";

export default createStore({
    state() {
        return {
            displayLoadingScreen: false,
            openWorkspaces: []
        };
    },
    getters: {
        getDisplayLoadingScreen(state) {
            return state.displayLoadingScreen;
        },
        getOpenWorkspaces(state) {
            return state.openWorkspaces;
        },
        isWorkspaceOpen(state) {
            return workspaceId => {
                return state.openWorkspaces.includes(workspaceId);
            };
        }
    },
    mutations: {
        setDisplayLoadingScreen(state, displayLoadingScreen) {
            state.displayLoadingScreen = displayLoadingScreen;
        },
        openWorkspace(state, workspaceId) {
            state.openWorkspaces.push(workspaceId);
        },
        closeWorkspace(state, workspaceId) {
            state.openWorkspaces = state.openWorkspaces.filter(id => id !== workspaceId);
        }
    },
    actions: {
        setDisplayLoadingScreen({ commit }, displayLoadingScreen) {
            commit("setDisplayLoadingScreen", displayLoadingScreen);
        },
        openWorkspace({ commit }, workspaceId) {
            commit("openWorkspace", workspaceId);
        },
        closeWorkspace({ commit }, workspaceId) {
            commit("closeWorkspace", workspaceId);
        }
    },
    modules: {
        identityManagerGrants,
        identityManagers,
        contextBrokers,
        services,
        temporalServices,
        workspaces,
        types,
        properties,
        entities,
        temporalEntityProperties,
        subscriptions,
        dataModel,
        authentication,
        authorizationRegistryGrants,
        authorizationRegistries,
        authorizationRegistryProxy,
        contracts,
        contractDetails,
        dataActions,
        dataServices,
        dataServiceActions,
        dataServiceProperties,
        dataServiceOffers,
        dataServiceAccesses,
        vcVerifiers,
        trustedIssuersLists,
        googleSheetsProxy,
        woTActions,
        woTProperties,
        routings,
        routingOperations,
        routingOperationControls,
        woTThingDescriptions,
        woTEvents,
        roles,
        users
    }
});
