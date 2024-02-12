import { createRouter, createWebHistory } from "vue-router";

import IdentityManagerGrantsIndexView from "@/views/identity-manager-grants/IdentityManagerGrantsIndexView";
import IdentityManagerGrantsCreateView from "@/views/identity-manager-grants/IdentityManagerGrantsCreateView";
import IdentityManagerGrantsShowView from "@/views/identity-manager-grants/IdentityManagerGrantsShowView";
import IdentityManagerGrantsEditView from "@/views/identity-manager-grants/IdentityManagerGrantsEditView";

import IdentityManagersIndexView from "@/views/identity-managers/IdentityManagersIndexView";
import IdentityManagersCreateView from "@/views/identity-managers/IdentityManagersCreateView";
import IdentityManagersShowView from "@/views/identity-managers/IdentityManagersShowView";
import IdentityManagersEditView from "@/views/identity-managers/IdentityManagersEditView";

import ContextBrokersIndexView from "@/views/context-brokers/ContextBrokersIndexView";
import ContextBrokersCreateView from "@/views/context-brokers/ContextBrokersCreateView";
import ContextBrokersShowView from "@/views/context-brokers/ContextBrokersShowView";
import ContextBrokersEditView from "@/views/context-brokers/ContextBrokersEditView";

import ServicesIndexView from "@/views/services/ServicesIndexView";
import ServicesCreateView from "@/views/services/ServicesCreateView";
import ServicesShowView from "@/views/services/ServicesShowView";
import ServicesEditView from "@/views/services/ServicesEditView";

import TemporalServicesIndexView from "@/views/temporal-services/TemporalServicesIndexView";
import TemporalServicesCreateView from "@/views/temporal-services/TemporalServicesCreateView";
import TemporalServicesShowView from "@/views/temporal-services/TemporalServicesShowView";
import TemporalServicesEditView from "@/views/temporal-services/TemporalServicesEditView";

import WorkspacesIndexView from "@/views/workspaces/WorkspacesIndexView";
import WorkspacesCreateView from "@/views/workspaces/WorkspacesCreateView";
import WorkspacesShowView from "@/views/workspaces/WorkspacesShowView";
import WorkspacesEditView from "@/views/workspaces/WorkspacesEditView";

import TypesIndexView from "@/views/types/TypesIndexView";
import TypesCreateView from "@/views/types/TypesCreateView";
import TypesShowView from "@/views/types/TypesShowView";
import TypesEditView from "@/views/types/TypesEditView";

import PropertiesCreateView from "@/views/properties/PropertiesCreateView";
import PropertiesShowView from "@/views/properties/PropertiesShowView";
import PropertiesEditView from "@/views/properties/PropertiesEditView";
import PropertiesImportView from "@/views/properties/PropertiesImportView";

import WorkspaceView from "@/views/WorkspaceView";

import EntitiesCreateView from "@/views/entities/EntitiesCreateView";

import EntitiesPropertiesCreateView from "@/views/entities-properties/EntitiesPropertiesCreateView";
import EntitiesPropertiesShowView from "@/views/entities-properties/EntitiesPropertiesShowView";
import EntitiesPropertiesEditView from "@/views/entities-properties/EntitiesPropertiesEditView";

import TemporalEntityPropertiesShowView from "@/views/temporal-entity-properties/TemporalEntityPropertiesShowView";

import SubscriptionsCreateView from "@/views/subscriptions/SubscriptionsCreateView";
import SubscriptionsShowView from "@/views/subscriptions/SubscriptionsShowView";

import AuthenticationView from "@/views/AuthenticationView";

import CallbacksAuthenticationView from "@/views/callbacks/CallbacksAuthenticationView";

import AuthorizationRegistryGrantsIndexView from "@/views/authorization-registry-grants/AuthorizationRegistryGrantsIndexView";
import AuthorizationRegistryGrantsCreateView from "@/views/authorization-registry-grants/AuthorizationRegistryGrantsCreateView";
import AuthorizationRegistryGrantsShowView from "@/views/authorization-registry-grants/AuthorizationRegistryGrantsShowView";
import AuthorizationRegistryGrantsEditView from "@/views/authorization-registry-grants/AuthorizationRegistryGrantsEditView";

import AuthorizationRegistriesIndexView from "@/views/authorization-registries/AuthorizationRegistriesIndexView";
import AuthorizationRegistriesCreateView from "@/views/authorization-registries/AuthorizationRegistriesCreateView";
import AuthorizationRegistriesShowView from "@/views/authorization-registries/AuthorizationRegistriesShowView";
import AuthorizationRegistriesEditView from "@/views/authorization-registries/AuthorizationRegistriesEditView";

import VCVerifiersIndexView from "@/views/vc-verifiers/VCVerifiersIndexView";
import VCVerifiersCreateView from "@/views/vc-verifiers/VCVerifiersCreateView";
import VCVerifiersShowView from "@/views/vc-verifiers/VCVerifiersShowView";
import VCVerifiersEditView from "@/views/vc-verifiers/VCVerifiersEditView";

import TrustedIssuersListsIndexView from "@/views/trusted-issuers-lists/TrustedIssuersListsIndexView";
import TrustedIssuersListsCreateView from "@/views/trusted-issuers-lists/TrustedIssuersListsCreateView";
import TrustedIssuersListsShowView from "@/views/trusted-issuers-lists/TrustedIssuersListsShowView";
import TrustedIssuersListsEditView from "@/views/trusted-issuers-lists/TrustedIssuersListsEditView";

import AuthorizationRegistriesToolHomeView from "@/views/tools/authorization-registries/AuthorizationRegistriesToolHomeView";

import OffersIndexView from "@/views/offers/OffersIndexView";
import OffersShowView from "@/views/offers/OffersShowView";

import ContractsShowView from "@/views/contracts/ContractsShowView";

import ContractDetailsShowView from "@/views/contract-details/ContractDetailsShowView";
import ContractDetailsEditView from "@/views/contract-details/ContractDetailsEditView";

import DataServicesIndexView from "@/views/data-services/DataServicesIndexView";
import DataServicesCreateView from "@/views/data-services/DataServicesCreateView";
import DataServicesShowView from "@/views/data-services/DataServicesShowView";
import DataServicesEditView from "@/views/data-services/DataServicesEditView";

import DataServiceOffersCreateView from "@/views/data-service-offers/DataServiceOffersCreateView";
import DataServiceOffersShowView from "@/views/data-service-offers/DataServiceOffersShowView";
import DataServiceOffersEditView from "@/views/data-service-offers/DataServiceOffersEditView";

import DataServiceAccessesCreateView from "@/views/data-service-accesses/DataServiceAccessesCreateView";
import DataServiceAccessesShowView from "@/views/data-service-accesses/DataServiceAccessesShowView";
import DataServiceAccessesEditView from "@/views/data-service-accesses/DataServiceAccessesEditView";

import WoTActionsCreateView from "@/views/wot-actions/WoTActionsCreateView";
import WoTActionsShowView from "@/views/wot-actions/WoTActionsShowView";
import WoTActionsEditView from "@/views/wot-actions/WoTActionsEditView";

import WoTEventsCreateView from "@/views/wot-events/WoTEventsCreateView";
import WoTEventsShowView from "@/views/wot-events/WoTEventsShowView";
import WoTEventsEditView from "@/views/wot-events/WoTEventsEditView";

import WoTPropertiesCreateView from "@/views/wot-properties/WoTPropertiesCreateView";
import WoTPropertiesShowView from "@/views/wot-properties/WoTPropertiesShowView";
import WoTPropertiesEditView from "@/views/wot-properties/WoTPropertiesEditView";

import RoutingsCreateView from "@/views/routings/RoutingsCreateView";
import RoutingsShowView from "@/views/routings/RoutingsShowView";
import RoutingsEditView from "@/views/routings/RoutingsEditView";

import RoutingOperationsCreateView from "@/views/routing-operations/RoutingOperationsCreateView";
import RoutingOperationsShowView from "@/views/routing-operations/RoutingOperationsShowView";
import RoutingOperationsEditView from "@/views/routing-operations/RoutingOperationsEditView";

import RoutingOperationControlsCreateView from "@/views/routing-operation-controls/RoutingOperationControlsCreateView";
import RoutingOperationControlsShowView from "@/views/routing-operation-controls/RoutingOperationControlsShowView";
import RoutingOperationControlsEditView from "@/views/routing-operation-controls/RoutingOperationControlsEditView";

import WoTThingDescriptionsIndexView from "@/views/wot-thing-descriptions/WoTThingDescriptionsIndexView";
import WoTThingDescriptionsCreateView from "@/views/wot-thing-descriptions/WoTThingDescriptionsCreateView";
import WoTThingDescriptionsShowView from "@/views/wot-thing-descriptions/WoTThingDescriptionsShowView";
import WoTThingDescriptionsEditView from "@/views/wot-thing-descriptions/WoTThingDescriptionsEditView";

export default createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/identity-manager-grants",
            name: "identityManagerGrants.index",
            component: IdentityManagerGrantsIndexView
        },
        {
            path: "/identity-manager-grants/create",
            name: "identityManagerGrants.create",
            component: IdentityManagerGrantsCreateView
        },
        {
            path: "/identity-manager-grants/:identityManagerGrantId",
            name: "identityManagerGrants.show",
            component: IdentityManagerGrantsShowView
        },
        {
            path: "/identity-manager-grants/:identityManagerGrantId/edit",
            name: "identityManagerGrants.edit",
            component: IdentityManagerGrantsEditView
        },
        {
            path: "/identity-managers",
            name: "identityManagers.index",
            component: IdentityManagersIndexView
        },
        {
            path: "/identity-managers/create",
            name: "identityManagers.create",
            component: IdentityManagersCreateView
        },
        {
            path: "/identity-managers/:identityManagerId",
            name: "identityManagers.show",
            component: IdentityManagersShowView
        },
        {
            path: "/identity-managers/:identityManagerId/edit",
            name: "identityManagers.edit",
            component: IdentityManagersEditView
        },
        {
            path: "/context-brokers",
            name: "contextBrokers.index",
            component: ContextBrokersIndexView
        },
        {
            path: "/context-brokers/create",
            name: "contextBrokers.create",
            component: ContextBrokersCreateView
        },
        {
            path: "/context-brokers/:contextBrokerId",
            name: "contextBrokers.show",
            component: ContextBrokersShowView
        },
        {
            path: "/context-brokers/:contextBrokerId/edit",
            name: "contextBrokers.edit",
            component: ContextBrokersEditView
        },
        {
            path: "/services",
            name: "services.index",
            component: ServicesIndexView
        },
        {
            path: "/services/create",
            name: "services.create",
            component: ServicesCreateView
        },
        {
            path: "/services/:serviceId",
            name: "services.show",
            component: ServicesShowView
        },
        {
            path: "/services/:serviceId/edit",
            name: "services.edit",
            component: ServicesEditView
        },
        {
            path: "/temporal-services",
            name: "temporalServices.index",
            component: TemporalServicesIndexView
        },
        {
            path: "/temporal-services/create",
            name: "temporalServices.create",
            component: TemporalServicesCreateView
        },
        {
            path: "/temporal-services/:temporalServiceId",
            name: "temporalServices.show",
            component: TemporalServicesShowView
        },
        {
            path: "/temporal-services/:temporalServiceId/edit",
            name: "temporalServices.edit",
            component: TemporalServicesEditView
        },
        {
            path: "/workspaces",
            name: "workspaces.index",
            component: WorkspacesIndexView
        },
        {
            path: "/workspaces/create",
            name: "workspaces.create",
            component: WorkspacesCreateView
        },
        {
            path: "/workspaces/:workspaceId",
            name: "workspaces.show",
            component: WorkspacesShowView
        },
        {
            path: "/workspaces/:workspaceId/edit",
            name: "workspaces.edit",
            component: WorkspacesEditView
        },
        {
            path: "/workspace/:workspaceId/types",
            name: "types.index",
            component: TypesIndexView
        },
        {
            path: "/workspace/:workspaceId/types/create",
            name: "types.create",
            component: TypesCreateView
        },
        {
            path: "/workspace/:workspaceId/types/:typeId",
            name: "types.show",
            component: TypesShowView
        },
        {
            path: "/workspace/:workspaceId/types/:typeId/edit",
            name: "types.edit",
            component: TypesEditView
        },
        {
            path: "/workspace/:workspaceId/types/:typeId/properties/create",
            name: "properties.create",
            component: PropertiesCreateView
        },
        {
            path: "/workspace/:workspaceId/types/:typeId/properties/:propertyId",
            name: "properties.show",
            component: PropertiesShowView
        },
        {
            path: "/workspace/:workspaceId/types/:typeId/properties/:propertyId/edit",
            name: "properties.edit",
            component: PropertiesEditView
        },
        {
            path: "/workspace/:workspaceId/types/:typeId/properties/import",
            name: "properties.import",
            component: PropertiesImportView
        },
        {
            path: "/workspace/:workspaceId",
            name: "workspace",
            component: WorkspaceView
        },
        {
            path: "/workspace/:workspaceId/entities/create",
            name: "entities.create",
            component: EntitiesCreateView
        },
        {
            path: "/workspace/:workspaceId/entities/:entityId/types/:typeId/properties/create",
            name: "entities.properties.create",
            component: EntitiesPropertiesCreateView
        },
        {
            path: "/workspace/:workspaceId/entities/:entityId/types/:typeId/properties/:propertyId/show",
            name: "entities.properties.show",
            component: EntitiesPropertiesShowView
        },
        {
            path: "/workspace/:workspaceId/entities/:entityId/types/:typeId/properties/:propertyId/edit",
            name: "entities.properties.edit",
            component: EntitiesPropertiesEditView
        },
        {
            path: "/workspace/:workspaceId/temporal-entities/:entityId/types/:typeId/properties/:propertyId/show",
            name: "temporalEntities.properties.show",
            component: TemporalEntityPropertiesShowView
        },
        {
            path: "/workspace/:workspaceId/subscriptions/create",
            name: "subscriptions.create",
            component: SubscriptionsCreateView
        },
        {
            path: "/workspace/:workspaceId/subscriptions/:subscriptionId",
            name: "subscriptions.show",
            component: SubscriptionsShowView
        },
        {
            path: "/authentication",
            name: "authentication",
            component: AuthenticationView
        },
        {
            path: "/callbacks/authentication",
            name: "callbacks.authentication",
            component: CallbacksAuthenticationView
        },
        {
            path: "/authorization-registry-grants",
            name: "authorizationRegistryGrants.index",
            component: AuthorizationRegistryGrantsIndexView
        },
        {
            path: "/authorization-registry-grants/create",
            name: "authorizationRegistryGrants.create",
            component: AuthorizationRegistryGrantsCreateView
        },
        {
            path: "/authorization-registry-grants/:authorizationRegistryGrantId",
            name: "authorizationRegistryGrants.show",
            component: AuthorizationRegistryGrantsShowView
        },
        {
            path: "/authorization-registry-grants/:authorizationRegistryGrantId/edit",
            name: "authorizationRegistryGrants.edit",
            component: AuthorizationRegistryGrantsEditView
        },
        {
            path: "/authorization-registries",
            name: "authorizationRegistries.index",
            component: AuthorizationRegistriesIndexView
        },
        {
            path: "/authorization-registries/create",
            name: "authorizationRegistries.create",
            component: AuthorizationRegistriesCreateView
        },
        {
            path: "/authorization-registries/:authorizationRegistryId",
            name: "authorizationRegistries.show",
            component: AuthorizationRegistriesShowView
        },
        {
            path: "/authorization-registries/:authorizationRegistryId/edit",
            name: "authorizationRegistries.edit",
            component: AuthorizationRegistriesEditView
        },
        {
            path: "/vc-verifiers",
            name: "vcVerifiers.index",
            component: VCVerifiersIndexView
        },
        {
            path: "/vc-verifiers/create",
            name: "vcVerifiers.create",
            component: VCVerifiersCreateView
        },
        {
            path: "/vc-verifiers/:vcVerifierId",
            name: "vcVerifiers.show",
            component: VCVerifiersShowView
        },
        {
            path: "/vc-verifiers/:vcVerifierId/edit",
            name: "vcVerifiers.edit",
            component: VCVerifiersEditView
        },
        {
            path: "/trusted-issuers-lists",
            name: "trustedIssuersLists.index",
            component: TrustedIssuersListsIndexView
        },
        {
            path: "/trusted-issuers-lists/create",
            name: "trustedIssuersLists.create",
            component: TrustedIssuersListsCreateView
        },
        {
            path: "/trusted-issuers-lists/:trustedIssuersListId",
            name: "trustedIssuersLists.show",
            component: TrustedIssuersListsShowView
        },
        {
            path: "/trusted-issuers-lists/:trustedIssuersListId/edit",
            name: "trustedIssuersLists.edit",
            component: TrustedIssuersListsEditView
        },
        {
            path: "/tools/authorization-registries",
            name: "tools.authorizationRegistries.home",
            component: AuthorizationRegistriesToolHomeView
        },
        {
            path: "/workspace/:workspaceId/offers",
            name: "offers.index",
            component: OffersIndexView
        },
        {
            path: "/workspace/:workspaceId/offers/:offerId",
            name: "offers.show",
            component: OffersShowView
        },
        {
            path: "/workspace/:workspaceId/contracts/:contractId",
            name: "contracts.show",
            component: ContractsShowView
        },
        {
            path: "/workspace/:workspaceId/contract-details/:contractDetailId",
            name: "contractDetails.show",
            component: ContractDetailsShowView
        },
        {
            path: "/workspace/:workspaceId/contract-details/:contractDetailId/edit",
            name: "contractDetails.edit",
            component: ContractDetailsEditView
        },
        {
            path: "/workspace/:workspaceId/data-services",
            name: "dataServices.index",
            component: DataServicesIndexView
        },
        {
            path: "/workspace/:workspaceId/data-services/create",
            name: "dataServices.create",
            component: DataServicesCreateView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId",
            name: "dataServices.show",
            component: DataServicesShowView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/edit",
            name: "dataServices.edit",
            component: DataServicesEditView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/data-service-offers/create",
            name: "dataServiceOffers.create",
            component: DataServiceOffersCreateView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/data-service-offers/:dataServiceOfferId",
            name: "dataServiceOffers.show",
            component: DataServiceOffersShowView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/data-service-offers/:dataServiceOfferId/edit",
            name: "dataServiceOffers.edit",
            component: DataServiceOffersEditView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/data-service-accesses/create",
            name: "dataServiceAccesses.create",
            component: DataServiceAccessesCreateView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/data-service-accesses/:dataServiceAccessId",
            name: "dataServiceAccesses.show",
            component: DataServiceAccessesShowView
        },
        {
            path: "/workspace/:workspaceId/data-services/:dataServiceId/data-service-accesses/:dataServiceAccessId/edit",
            name: "dataServiceAccesses.edit",
            component: DataServiceAccessesEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-actions/create",
            name: "woTActions.create",
            component: WoTActionsCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-actions/:woTActionId",
            name: "woTActions.show",
            component: WoTActionsShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-actions/:woTActionId/edit",
            name: "woTActions.edit",
            component: WoTActionsEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-events/create",
            name: "woTEvents.create",
            component: WoTEventsCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-events/:woTEventId",
            name: "woTEvents.show",
            component: WoTEventsShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-events/:woTEventId/edit",
            name: "woTEvents.edit",
            component: WoTEventsEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-properties/create",
            name: "woTProperties.create",
            component: WoTPropertiesCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-properties/:woTPropertyId",
            name: "woTProperties.show",
            component: WoTPropertiesShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/wot-properties/:woTPropertyId/edit",
            name: "woTProperties.edit",
            component: WoTPropertiesEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/create",
            name: "routings.create",
            component: RoutingsCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId",
            name: "routings.show",
            component: RoutingsShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/edit",
            name: "routings.edit",
            component: RoutingsEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/routing-operations/create",
            name: "routingOperations.create",
            component: RoutingOperationsCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/routing-operations/:routingOperationId",
            name: "routingOperations.show",
            component: RoutingOperationsShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/routing-operations/:routingOperationId/edit",
            name: "routingOperations.edit",
            component: RoutingOperationsEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/routing-operations/:routingOperationId/routing-operation-controls/create",
            name: "routingOperationControls.create",
            component: RoutingOperationControlsCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/routing-operations/:routingOperationId/routing-operation-controls/:routingOperationControlId",
            name: "routingOperationControls.show",
            component: RoutingOperationControlsShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/routings/:routingId/routing-operations/:routingOperationId/routing-operation-controls/:routingOperationControlId/edit",
            name: "routingOperationControls.edit",
            component: RoutingOperationControlsEditView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions",
            name: "woTThingDescriptions.index",
            component: WoTThingDescriptionsIndexView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/create",
            name: "woTThingDescriptions.create",
            component: WoTThingDescriptionsCreateView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId",
            name: "woTThingDescriptions.show",
            component: WoTThingDescriptionsShowView
        },
        {
            path: "/workspace/:workspaceId/wot-thing-descriptions/:woTThingDescriptionId/edit",
            name: "woTThingDescriptions.edit",
            component: WoTThingDescriptionsEditView
        }
    ]
});
