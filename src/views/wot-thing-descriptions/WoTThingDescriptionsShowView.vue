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

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](this.workspace.id, woTThingDescriptionId);

        this.capabilities = this.$store.getters["capabilities/getCapabilities"](this.workspace.id, this.woTThingDescription.id);
        this.routings = this.$store.getters["routings/getRoutings"](this.workspace.id, this.woTThingDescription.id);

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
                active: true,
                name: this.woTThingDescription.name
            }
        ];
    },
    methods: {
        async destroyWoTThingDescription() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.wot_thing_description_deletion_question"),
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
                await this.$store.dispatch("woTThingDescriptions/destroyWoTThingDescription", { workspaceId: this.workspace.id, woTThingDescription: this.woTThingDescription });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_thing_description_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTThingDescription.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateWoTThingDescription(workspace.id, woTThingDescription.id)" :to="{ name: 'woTThingDescriptions.edit', params: { name: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyWoTThingDescription(workspace.id, woTThingDescription.id)" class="btn btn-danger btn-sm ms-3" @click="destroyWoTThingDescription">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ woTThingDescription.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ woTThingDescription.name }}</dd>
                    <template v-if="woTThingDescription.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ woTThingDescription.description }}</dd>
                    </template>
                </dl>
            </div>
        </div>
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.capabilities")) }}</span>
                <RouterLink v-if="$authorization.canStoreCapability(workspace.id)" :to="{ name: 'capabilities.create', params: { woTThingDescriptionId: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(capabilities).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_capability") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="capability in capabilities" :key="capability.id">
                            <td>
                                <RouterLink :to="{ name: 'capabilities.show', params: { capabilityId: capability.id } }">{{ capability.name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.routings")) }}</span>
                <RouterLink v-if="$authorization.canStoreRouting(workspace.id)" :to="{ name: 'routings.create', params: { woTThingDescriptionId: woTThingDescription.id } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(routings).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_routing") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="routing in routings" :key="routing.id">
                            <td>
                                <RouterLink :to="{ name: 'routings.show', params: { routingId: routing.id } }">{{ routing.name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
