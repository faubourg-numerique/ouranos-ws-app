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
        const contextBrokerId = this.$route.params.contextBrokerId;
        this.contextBroker = this.$store.getters["contextBrokers/getContextBroker"](contextBrokerId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.context_brokers")),
                route: {
                    name: "contextBrokers.index"
                }
            },
            {
                active: true,
                name: this.contextBroker.name
            }
        ];
    },
    methods: {
        async destroyContextBroker() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.context_broker_deletion_question"),
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
                await this.$store.dispatch("contextBrokers/destroyContextBroker", this.contextBroker);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.context_broker_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contextBrokers.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ contextBroker.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateContextBroker(contextBroker.id)" :to="{ name: 'contextBrokers.edit', params: { contextBrokerId: contextBroker.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pen-to-square" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyContextBroker(contextBroker.id)" class="btn btn-danger btn-sm ms-3" @click="destroyContextBroker">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.id }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.name }}</dd>
                    <template v-if="contextBroker.description">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ contextBroker.description }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.scheme")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.scheme }}</dd>
                    <template v-if="contextBroker.scheme === 'https'">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.disable_certificate_verification")) }}</dt>
                        <dd class="col-sm-8">
                            <BooleanIcon :value="contextBroker.disableCertificateVerification" />
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.host")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.host }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.port")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.port }}</dd>
                    <template v-if="contextBroker.path">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.path")) }}</dt>
                        <dd class="col-sm-8">{{ contextBroker.path }}</dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.multi_tenancy_enabled")) }}</dt>
                    <dd class="col-sm-8">
                        <BooleanIcon :value="contextBroker.multiTenancyEnabled" />
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.pagination_max_limit")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.paginationMaxLimit }}</dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.implementation_name")) }}</dt>
                    <dd class="col-sm-8">{{ contextBroker.implementationName }}</dd>
                    <dt class="col-sm-4" :class="{ 'mb-0': Utils.isEmpty(contextBroker.customHeaders) }">{{ Utils.capitalize($t("main.implementation_version")) }}</dt>
                    <dd class="col-sm-8" :class="{ 'mb-0': Utils.isEmpty(contextBroker.customHeaders) }">{{ contextBroker.implementationVersion }}</dd>
                    <template v-if="!Utils.isEmpty(contextBroker.customHeaders)">
                        <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.custom_headers")) }}</dt>
                        <dd class="col-sm-8 mb-0">
                            <table class="table table-sm mb-0">
                                <thead>
                                    <tr>
                                        <th>{{ Utils.capitalize($t("main.name")) }}</th>
                                        <th>{{ Utils.capitalize($t("main.value")) }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(value, name) in contextBroker.customHeaders" :key="name">
                                        <td>{{ name }}</td>
                                        <td>{{ value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </dd>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
