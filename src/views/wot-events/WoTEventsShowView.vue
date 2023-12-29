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
            error: null,
            selectedWoTPropertyId: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTEventId = this.$route.params.woTEventId;
        this.woTEvent = this.$store.getters["woTEvents/getWoTEvent"](this.workspace.id, woTEventId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.wot_thing_descriptions")),
                route: {
                    name: "woTThingDescriptions.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.woTThingDescription.name,
                route: {
                    name: "woTThingDescriptions.show",
                    params: {
                        workspaceId: this.workspace.id,
                        woTThingDescriptionId: this.woTThingDescription.id
                    }
                }
            },
            {
                active: true,
                name: this.woTEvent.name
            }
        ];
    },
    methods: {
        async destroyWoTEvent() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.wot_event_deletion_question"),
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
                await this.$store.dispatch("woTEvents/destroyWoTEvent", { workspaceId: this.workspace.id, woTEvent: this.woTEvent });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_event_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show" });
        },
        woTPropertyName(woTPropertyId) {
            return this.$store.getters["woTProperties/getWoTProperty"](this.workspace.id, woTPropertyId).name;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTEvent.name }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateWoTEvent(workspace.id, woTEvent.id)" :to="{ name: 'woTEvents.edit', params: { name: woTEvent.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyWoTEvent(workspace.id, woTEvent.id)" class="btn btn-danger btn-sm ms-3" @click="destroyWoTEvent">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ woTEvent.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ woTEvent.name }}</dd>
                    <template v-if="woTEvent.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ woTEvent.description }}</dd>
                    </template>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.data_service")) }}</dt>
                    <dd class="col-sm-9">
                        <RouterLink :to="{ name: 'dataServices.show', params: { dataServiceId: woTEvent.hasDataService } }">{{ woTEvent.hasDataService }}</RouterLink>
                    </dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.property")) }}</dt>
                    <dd class="col-sm-9">
                        <RouterLink :to="{ name: 'woTProperties.show', params: { woTPropertyId: woTEvent.hasWoTProperty } }">{{ woTPropertyName(woTEvent.hasWoTProperty) }}</RouterLink>
                    </dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.capacity_type")) }}</dt>
                    <dd class="col-sm-9">{{ woTEvent.capacityType }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.capacity_value")) }}</dt>
                    <dd class="col-sm-9">{{ woTEvent.capacityValue }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
