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
    computed: {
        woTActionParameters() {
            return this.$store.getters["woTActionParameters/getWoTActionParameters"](this.workspace.id, this.woTAction.id);
        },
        filteredWoTProperties() {
            const usedWoTPropertyIds = this.woTActionParameters.map((woTActionParameter) => woTActionParameter.hasWoTProperty);
            const woTProperties = this.$store.getters["woTProperties/getWoTProperties"](this.workspace.id, this.woTThingDescription.id);
            return woTProperties.filter((woTProperty) => !usedWoTPropertyIds.includes(woTProperty.id));
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](this.workspace.id, woTActionId);

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
                name: this.woTAction.name
            }
        ];
    },
    methods: {
        async destroyWoTAction() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.woTAction_deletion_question"),
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
                await this.$store.dispatch("woTActions/destroyWoTAction", { workspaceId: this.workspace.id, woTAction: this.woTAction });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.woTAction_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show" });
        },
        async storeWoTActionParameter() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                const woTActionParameter = {
                    hasWoTAction: this.woTAction.id,
                    hasWoTProperty: this.selectedWoTPropertyId,
                    hasWorkspace: this.workspace.id
                };
                await this.$store.dispatch("woTActionParameters/storeWoTActionParameter", { workspaceId: this.workspace.id, woTActionParameter });
                this.selectedWoTPropertyId = null;
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_action_parameter_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
        },
        async destroyWoTActionParameter(woTActionParameter) {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.wot_action_parameter_deletion_question"),
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
                await this.$store.dispatch("woTActionParameters/destroyWoTActionParameter", { workspaceId: this.workspace.id, woTActionParameter: woTActionParameter });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_action_parameter_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
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
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTAction.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateWoTAction(workspace.id, woTAction.id)" :to="{ name: 'woTActions.edit', params: { name: woTAction.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyWoTAction(workspace.id, woTAction.id)" class="btn btn-danger btn-sm ms-3" @click="destroyWoTAction">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-9">{{ woTAction.id }}</dd>
                    <dt class="col-sm-3">{{ Utils.capitalize($t("main.name")) }}</dt>
                    <dd class="col-sm-9">{{ woTAction.name }}</dd>
                    <template v-if="woTAction.description">
                        <dt class="col-sm-3">{{ Utils.capitalize($t("main.description")) }}</dt>
                        <dd class="col-sm-9">{{ woTAction.description }}</dd>
                    </template>
                </dl>
            </div>
        </div>
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">{{ Utils.capitalize($t("main.wot_properties")) }}</div>
            <div class="card-body">
                <table class="table table-sm align-middle mb-0">
                    <thead>
                        <tr>
                            <th>
                                <select v-model="selectedWoTPropertyId" class="form-select form-select-sm">
                                    <option v-for="woTProperty in filteredWoTProperties" :key="woTProperty.id" :value="woTProperty.id">{{ woTProperty.name }}</option>
                                </select>
                            </th>
                            <th style="max-width: 25px;">
                                <button class="btn btn-primary btn-sm w-100" :disabled="!selectedWoTPropertyId" @click="storeWoTActionParameter">{{ Utils.capitalize($t("main.add")) }}</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="woTActionParameter in woTActionParameters" :key="woTActionParameter.id">
                            <td>
                                <RouterLink :to="{ name: 'woTProperties.show', params: { woTPropertyId: woTActionParameter.hasWoTProperty } }">{{ woTPropertyName(woTActionParameter.hasWoTProperty) }}</RouterLink>
                            </td>
                            <td style="max-width: 25px;"><button class="btn btn-danger btn-sm w-100" @click="destroyWoTActionParameter(woTActionParameter)">{{ Utils.capitalize($t("main.remove")) }}</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
