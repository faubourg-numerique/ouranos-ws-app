<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        dataServiceOfferProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            dataServiceOffer: {},
            dataActionIds: [],
            propertyIds: []
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const dataServiceId = this.$route.params.dataServiceId;
        this.dataService = this.$store.getters["dataServices/getDataService"](workspaceId, dataServiceId);

        this.dataServiceAccesses = this.$store.getters["dataServiceAccesses/getDataServiceAccesses"](this.workspace.id, this.dataService.id);

        this.dataServiceOffer.hasDataService = this.dataService.id;
        this.dataServiceOffer.hasWorkspace = this.workspace.id;

        if (this.dataServiceOfferProp) {
            this.update = true;
            Object.assign(this.dataServiceOffer, this.dataServiceOfferProp);
        }
    },
    methods: {
        async storeDataServiceOffer() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.dataServiceOffer = await this.$store.dispatch("dataServiceOffers/storeDataServiceOffer", { workspaceId: this.workspace.id, dataServiceOffer: this.dataServiceOffer });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_offer_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServiceOffers.show", params: { dataServiceId: this.dataService.id, dataServiceOfferId: this.dataServiceOffer.id } });
        },
        async updateDataServiceOffer() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("dataServiceOffers/updateDataServiceOffer", { workspaceId: this.workspace.id, dataServiceOffer: this.dataServiceOffer });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_service_offer_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "dataServiceOffers.show", params: { dataServiceId: this.dataService.id, dataServiceOfferId: this.dataServiceOffer.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateDataServiceOffer() : storeDataServiceOffer()">
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <input id="description" v-model="dataServiceOffer.description" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="url" class="form-label">{{ Utils.capitalize($t("main.url")) }}</label>
            <input id="url" v-model="dataServiceOffer.url" type="url" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
