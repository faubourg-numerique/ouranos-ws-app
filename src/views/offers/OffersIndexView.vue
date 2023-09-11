<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.offers = this.$store.getters["offers/getOffers"](this.workspace.id);
    },
    methods: {
        getType(typeId) {
            return this.$store.getters["types/getType"](this.workspace.id, typeId);
        }
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.contracts")) }}</span>
                <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspace.id }, query: { activeTab: 'subscriptions' } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-bolt" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(offers).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_offer") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                            <th>{{ Utils.capitalize($t("main.type")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="offer in offers" :key="offer.id">
                            <td>
                                <RouterLink :to="{ name: 'offers.show', params: { workspaceId: workspace.id, offerId: offer.id } }">{{ offer.name }}</RouterLink>
                            </td>
                            <td>
                                <RouterLink :to="{ name: 'types.show', params: { workspaceId: workspace.id, typeId: offer.hasType } }">{{ getType(offer.hasType).name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
