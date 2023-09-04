<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BooleanIcon from "@/components/BooleanIcon";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import SpinnerAnimation from "@/components/SpinnerAnimation";

export default {
    components: {
        ApiErrorAlert,
        BooleanIcon,
        BreadcrumbNav,
        SpinnerAnimation
    },
    data() {
        return {
            error: null,
            subscription: null,
            typeId: null
        };
    },
    async created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.typeId = this.$route.query.typeId;

        const subscriptionId = this.$route.params.subscriptionId;

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.subscriptions")),
                route: {
                    name: "workspace",
                    params: {
                        workspaceId: this.workspace.id
                    },
                    query: {
                        activeTab: "subscriptions"
                    }
                }
            },
            {
                active: true,
                name: subscriptionId
            }
        ];

        this.subscription = await this.$store.dispatch("subscriptions/showSubscription", { workspaceId: this.workspace.id, subscriptionId });
    },
    methods: {
        async destroySubscription() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.subscription_deletion_question"),
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
                await this.$store.dispatch("subscriptions/destroySubscription", { workspaceId: this.workspace.id, subscription: this.subscription });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.subscription_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspace.id }, query: { typeId: this.typeId, activeTab: "subscriptions" } });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <ApiErrorAlert v-if="error" :error="error" />
        <SpinnerAnimation v-else-if="!subscription" />
        <div v-else class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ subscription.getSubscriptionName() ? subscription.getSubscriptionName() : subscription.getId() }}</span>
                <span>
                    <button v-if="$authorization.canDestroySubscription(workspace.id, subscription.getId())" class="btn btn-danger btn-sm" @click="destroySubscription">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <dl class="row mb-0">
                    <template v-if="subscription.getSubscriptionName()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.name")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getSubscriptionName() }}</dd>
                    </template>
                    <template v-if="subscription.getDescription()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getDescription() }}</dd>
                    </template>
                    <template v-if="!Utils.isEmpty(subscription.getEntities())">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.entities")) }}</dt>
                        <dd class="col-sm-8">
                            <table class="table table-sm align-middle">
                                <thead>
                                    <tr>
                                        <th>{{ Utils.capitalize($t("main.id")) }}</th>
                                        <th>{{ Utils.capitalize($t("main.id_pattern")) }}</th>
                                        <th>{{ Utils.capitalize($t("main.type")) }}</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(entity, index) in subscription.getEntities()" :key="index">
                                        <td>{{ entity.id }}</td>
                                        <td>{{ entity.idPattern }}</td>
                                        <td>{{ entity.type }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </dd>
                    </template>
                    <template v-if="!Utils.isEmpty(subscription.getWatchedAttributes())">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.watched_attributes")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getWatchedAttributes().join(", ") }}</dd>
                    </template>
                    <template v-if="subscription.getTimeInterval()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.time_interval")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getTimeInterval() }}</dd>
                    </template>
                    <template v-if="subscription.getQuery()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.query")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getQuery() }}</dd>
                    </template>
                    <template v-if="subscription.getGeoQuery()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.geo_query")) }}</dt>
                        <dd class="col-sm-8">
                            <dl class="row mb-0">
                                <template v-if="subscription.getGeoQuery().geometry">
                                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.geometry")) }}</dt>
                                    <dd class="col-sm-8">{{ subscription.getGeoQuery().geometry }}</dd>
                                </template>
                                <template v-if="subscription.getGeoQuery().coordinates">
                                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.coordinates")) }}</dt>
                                    <dd class="col-sm-8">{{ subscription.getGeoQuery().coordinates }}</dd>
                                </template>
                                <template v-if="subscription.getGeoQuery().georel">
                                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.geo_relationship")) }}</dt>
                                    <dd class="col-sm-8">{{ subscription.getGeoQuery().georel }}</dd>
                                </template>
                                <template v-if="subscription.getGeoQuery().geoproperty">
                                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.geo_property")) }}</dt>
                                    <dd class="col-sm-8">{{ subscription.getGeoQuery().geoproperty }}</dd>
                                </template>
                            </dl>
                        </dd>
                    </template>
                    <template v-if="subscription.getIsActive()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.enabled")) }}</dt>
                        <dd class="col-sm-8">
                            <BooleanIcon :value="subscription.getIsActive()" />
                        </dd>
                    </template>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.notification")) }}</dt>
                    <dd class="col-sm-8">
                        <dl class="row mb-0">
                            <template v-if="!Utils.isEmpty(subscription.getNotificationAttributes())">
                                <dt class="col-sm-4">{{ Utils.capitalize($t("main.attributes")) }}</dt>
                                <dd class="col-sm-8">{{ subscription.getNotificationAttributes().join(", ") }}</dd>
                            </template>
                            <dt class="col-sm-4">{{ Utils.capitalize($t("main.endpoint")) }}</dt>
                            <dd class="col-sm-8">
                                <dl class="row mb-0">
                                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.uri")) }}</dt>
                                    <dd class="col-sm-8">{{ subscription.getNotificationEndpoint().uri }}</dd>
                                    <template v-if="subscription.getNotificationEndpoint().accept">
                                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.accept")) }}</dt>
                                        <dd class="col-sm-8">{{ subscription.getNotificationEndpoint().accept }}</dd>
                                    </template>
                                </dl>
                            </dd>
                            <template v-if="subscription.getTimesSent()">
                                <dt class="col-sm-4">{{ Utils.capitalize($t("main.times_sent")) }}</dt>
                                <dd class="col-sm-8">{{ subscription.getTimesSent() }}</dd>
                            </template>
                            <template v-if="subscription.getLastNotification()">
                                <dt class="col-sm-4">{{ Utils.capitalize($t("main.last_notification")) }}</dt>
                                <dd class="col-sm-8">{{ subscription.getLastNotification() }}</dd>
                            </template>
                            <template v-if="subscription.getLastSuccess()">
                                <dt class="col-sm-4">{{ Utils.capitalize($t("main.last_success")) }}</dt>
                                <dd class="col-sm-8">{{ subscription.getLastSuccess() }}</dd>
                            </template>
                            <template v-if="subscription.getLastFailure()">
                                <dt class="col-sm-4">{{ Utils.capitalize($t("main.last_failure")) }}</dt>
                                <dd class="col-sm-8">{{ subscription.getLastFailure() }}</dd>
                            </template>
                        </dl>
                    </dd>
                    <template v-if="subscription.getExpiresAt()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.expires_at")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getExpiresAt() }}</dd>
                    </template>
                    <template v-if="subscription.getThrottling()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.throttling")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getThrottling() }}</dd>
                    </template>
                    <template v-if="subscription.getLang()">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.language")) }}</dt>
                        <dd class="col-sm-8">{{ subscription.getLang() }}</dd>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>

<style scoped>
table {
    table-layout: fixed;
    word-wrap: break-word;
}

table th,
table td {
    overflow: hidden;
}
</style>
