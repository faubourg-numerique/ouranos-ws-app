<script>
import "bootstrap";

import LoadingScreen from "@/components/LoadingScreen";

export default {
    components: {
        LoadingScreen
    },
    computed: {
        displayLoadingScreen() {
            return this.$store.getters["getDisplayLoadingScreen"];
        },
        showNavigation() {
            return this.$route.name !== "authentication" && this.$route.name !== "callbacks.authentication";
        },
        openWorkspaces() {
            return this.$store.getters["getOpenWorkspaces"];
        },
        activeWorkspace() {
            return this.$route.params.workspaceId;
        }
    },
    methods: {
        getWorkspaceName(workspaceId) {
            const workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);
            if (!workspace) return null;
            return workspace.name;
        },
        setLocale(locale) {
            this.$i18n.locale = locale;
        }
    }
}
</script>

<template>
    <LoadingScreen v-if="displayLoadingScreen" />
    <template v-if="showNavigation">
        <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">OURANOS-WS 2</a>
                <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar-collapse">
                    <span class="navbar-toggler-icon" />
                </button>
                <div id="navbar-collapse" class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <RouterLink :to="{ name: 'workspaces.index' }" class="nav-link" active-class="active">{{ Utils.capitalize($t("main.workspaces")) }}</RouterLink>
                        </li>
                        <template v-if="!$authorization.isInShowroomMode()">
                            <li v-if="I4TRUST_MODULE_ENABLED" class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">{{ Utils.capitalize($t("main.tools")) }}</a>
                                <ul class="dropdown-menu">
                                    <li v-if="$authorization.canUseAuthorizationRegistriesTool()">
                                        <RouterLink :to="{ name: 'tools.authorizationRegistries.home' }" class="dropdown-item">{{ Utils.capitalize($t("main.authorization_registries")) }}</RouterLink>
                                    </li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">{{ Utils.capitalize($t("main.administration")) }}</a>
                                <ul class="dropdown-menu">
                                    <li>
                                        <RouterLink :to="{ name: 'services.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.services")) }}</RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink :to="{ name: 'temporalServices.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.temporal_services")) }}</RouterLink>
                                    </li>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li>
                                        <RouterLink :to="{ name: 'contextBrokers.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.context_brokers")) }}</RouterLink>
                                    </li>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li>
                                        <RouterLink :to="{ name: 'identityManagers.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.identity_managers")) }}</RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink :to="{ name: 'identityManagerGrants.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.identity_manager_grants")) }}</RouterLink>
                                    </li>
                                    <template v-if="I4TRUST_MODULE_ENABLED">
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li>
                                            <RouterLink :to="{ name: 'authorizationRegistries.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.authorization_registries")) }}</RouterLink>
                                        </li>
                                        <li>
                                            <RouterLink :to="{ name: 'authorizationRegistryGrants.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.authorization_registry_grants")) }}</RouterLink>
                                        </li>
                                    </template>
                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                    <li>
                                        <RouterLink :to="{ name: 'vcVerifiers.index' }" class="dropdown-item">{{ Utils.capitalize($t("main.vc_verifiers")) }}</RouterLink>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                    <div class="ms-auto">
                        <span role="button" @click="setLocale('en')"><img src="@/assets/images/country-flags/united-kingdom.png"></span>
                        <span role="button" class="ms-3" @click="setLocale('fr')"><img src="@/assets/images/country-flags/france.png"></span>
                    </div>
                </div>
            </div>
        </nav>
        <nav v-if="openWorkspaces.length > 0" class="navbar navbar-dark bg-primary navbar-expand-lg">
            <div class="container-fluid">
                <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#open-workspaces">
                    <span class="navbar-toggler-icon" />
                </button>
                <div id="open-workspaces" class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <li v-for="workspaceId in openWorkspaces" :key="workspaceId" class="nav-item">
                            <RouterLink class="nav-link" :to="{ name: 'workspace', params: { workspaceId: workspaceId } }" :class="{ 'active': workspaceId === activeWorkspace }">{{ getWorkspaceName(workspaceId) }}</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </template>
    <RouterView :key="$route.fullPath" />
</template>

<style>
@import "bootswatch/dist/zephyr/bootstrap.min.css";
@import "@fortawesome/fontawesome-free/css/all.min.css";

html,
body,
#app {
    width: 100%;
    height: 100%;
}

fieldset,
legend {
    all: revert;
}

fieldset {
    border-color: #d2d2d2;
    border-style: solid;
    border-radius: 5px;
}

.container-small {
    max-width: 1000px;
}
</style>
