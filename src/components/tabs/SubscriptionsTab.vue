<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import SpinnerAnimation from "@/components/SpinnerAnimation";

export default {
    components: {
        ApiErrorAlert,
        SpinnerAnimation
    },
    data() {
        return {
            error: null,
            type: null,
            subscriptions: null
        };
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.init();
    },
    methods: {
        init() {
            this.error = null;
            this.type = null;
            this.subscriptions = null;

            const typeId = this.$route.query.typeId;
            if (!typeId) return;

            this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

            this.loadSubscriptions();
        },
        async loadSubscriptions() {
            this.subscriptionId = this.$route.query.subscriptionId;

            if (!this.subscriptionId) {
                const query = {
                    type: this.type.name
                };
                try {
                    this.subscriptions = await this.$store.dispatch("subscriptions/indexSubscriptions", { workspaceId: this.workspace.id, query });
                } catch (error) {
                    this.error = error;
                    return;
                }
                return;
            }
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <div v-else-if="!type" class="alert alert-info mb-0">
        <h5 class="alert-heading">{{ $t("dialogs.no_type_selected_title") }}</h5>
        <p class="mb-0">{{ $t("dialogs.no_type_selected_message") }}</p>
    </div>
    <div v-else class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>{{ type.name }}</span>
            <RouterLink v-if="$authorization.canStoreSubscription(workspace.id)" :to="{ name: 'subscriptions.create', params: { workspaceId: workspace.id }, query: { typeId: type.id } }" class="btn btn-primary btn-sm">
                <i class="fa-solid fa-plus" />
            </RouterLink>
        </div>
        <div class="card-body">
            <SpinnerAnimation v-if="!subscriptions" />
            <div v-else-if="!Object.keys(subscriptions).length" class="alert alert-info mb-0">{{ $t("dialogs.no_subscription") }}</div>
            <table v-else class="table font-monospace mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        <th>{{ Utils.capitalize($t("main.id")) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="subscription in subscriptions" :key="subscription.getId()">
                        <td><template v-if="subscription.getSubscriptionName()">{{ subscription.getSubscriptionName() }}</template></td>
                        <td>
                            <RouterLink :to="{ name: 'subscriptions.show', params: { workspaceId: workspace.id, subscriptionId: subscription.getId() }, query: { typeId: type.id } }">{{ subscription.getId() }}</RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
