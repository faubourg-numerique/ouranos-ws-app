<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);

        const dataServiceOfferId = this.$route.params.dataServiceOfferId;
        this.dataServiceOffer = this.$store.getters["dataServiceOffers/getDataServiceOffer"](this.workspace.id, dataServiceOfferId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.data_services")),
                route: {
                    name: "dataServices.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.dataService.name ?? this.dataService.id,
                route: {
                    name: "dataServices.show",
                    params: {
                        workspaceId: this.workspace.id,
                        dataServiceId: this.dataService.id
                    }
                }
            },
            {
                active: true,
                name: this.dataServiceOffer.description
            }
        ];
    },
    methods: {
        async destroyDataServiceOffer() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.data_service_offer_deletion_question"),
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
                await this.$store.dispatch("dataServiceOffers/destroyDataServiceOffer", { workspaceId: this.workspace.id, dataServiceOffer: this.dataServiceOffer });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_offer_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServices.show", params: { dataServiceId: this.dataService.id } });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ dataServiceOffer.description }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateDataServiceOffer(workspace.id, dataServiceOffer.id)" :to="{ name: 'dataServiceOffers.edit', params: { dataServiceId: dataService.id, dataServiceOfferId: dataServiceOffer.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyDataServiceOffer(workspace.id, dataServiceOffer.id)" class="btn btn-danger btn-sm ms-3" @click="destroyDataServiceOffer">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                    <dd class="col-sm-8">{{ dataServiceOffer.description }}</dd>
                    <dt class="col-sm-4 mb-0">{{ Utils.capitalize($t("main.url")) }}</dt>
                    <dd class="col-sm-8 mb-0"><a :href="dataServiceOffer.url" target="_blank">{{ dataServiceOffer.url }}</a></dd>
                </dl>
            </div>
        </div>
    </div>
</template>
