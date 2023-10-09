<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const serviceId = this.$route.params.serviceId;
        this.service = this.$store.getters["services/getService"](serviceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.services")),
                route: {
                    name: "services.index"
                }
            },
            {
                active: true,
                name: this.service.name
            }
        ];
    },
    methods: {
        async destroyService() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.service_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("services/destroyService", this.service);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.service_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "services.index" });
        },
        identityManagerGrant(identityManagerGrantId) {
            return this.$store.getters["identityManagerGrants/getIdentityManagerGrant"](identityManagerGrantId);
        },
        identityManager(identityManagerId) {
            return this.$store.getters["identityManagers/getIdentityManager"](identityManagerId);
        },
        vcVerifier(vcVerifierId) {
            return this.$store.getters["vcVerifiers/getVCVerifier"](vcVerifierId);
        },
        contextBroker(contextBrokerId) {
            return this.$store.getters["contextBrokers/getContextBroker"](contextBrokerId);
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.service")) }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateService(service.id)" :to="{ name: 'services.edit' }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyService(service.id)" class="btn btn-danger btn-sm ms-3" @click="destroyService">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ service.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ service.name }}</dd>
                    <template v-if="service.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ service.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.authorization_required")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="service.authorizationRequired" />
                    </dd>
                    <template v-if="service.authorizationRequired">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.authorization_mode")) }}</dt>
                        <dd class="col-sm-8">{{ service.authorizationMode }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.context_broker")) }}</dt>
                    <dd class="col-sm-8">
                        <RouterLink v-if="$authorization.canShowContextBroker(service.hasContextBroker)" :to="{ name: 'contextBrokers.show', params: { contextBrokerId: service.hasContextBroker } }">
                            {{ contextBroker(service.hasContextBroker).name }}
                        </RouterLink>
                        <template v-else>{{ contextBroker(service.hasContextBroker).name }}</template>
                    </dd>
                    <template v-if="service.authorizationRequired">
                        <template v-if="service.authorizationMode == 'oauth2'">
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.identity_manager")) }}</dt>
                            <dd class="col-sm-8">
                                <RouterLink v-if="$authorization.canShowIdentityManager(service.hasIdentityManager)" :to="{ name: 'identityManagers.show', params: { identityManagerId: service.hasIdentityManager } }">
                                    {{ identityManager(service.hasIdentityManager).name }}
                                </RouterLink>
                                <template v-else>{{ identityManager(service.hasIdentityManager).name }}</template>
                            </dd>
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.identity_manager_grant")) }}</dt>
                            <dd class="col-sm-8">
                                <RouterLink v-if="$authorization.canShowIdentityManagerGrant(service.hasIdentityManagerGrant)" :to="{ name: 'identityManagerGrants.show', params: { identityManagerGrantId: service.hasIdentityManagerGrant } }">
                                    {{ identityManagerGrant(service.hasIdentityManagerGrant).name }}
                                </RouterLink>
                                <template v-else>{{ identityManagerGrant(service.hasIdentityManagerGrant).name }}</template>
                            </dd>
                        </template>
                        <template v-if="service.authorizationMode == 'siop2'">
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.vc_verifier")) }}</dt>
                            <dd class="col-sm-8">
                                <RouterLink v-if="$authorization.canShowVCVerifier(service.hasVCVerifier)" :to="{ name: 'vcVerifiers.show', params: { vcVerifierId: service.hasVCVerifier } }">
                                    {{ vcVerifier(service.hasVCVerifier).name }}
                                </RouterLink>
                                <template v-else>{{ vcVerifier(service.hasVCVerifier).name }}</template>
                            </dd>
                        </template>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
