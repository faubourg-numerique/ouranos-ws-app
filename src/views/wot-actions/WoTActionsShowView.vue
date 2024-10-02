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
            error: null,
            selectedWoTPropertyId: null
        };
    },
    computed: {
        woTProperties() {
            const dataServiceProperties = this.$store.getters["dataServiceProperties/getDataServicePropertiesByDataServiceId"](this.workspace.id, this.woTAction.hasDataService);
            const woTProperties = this.$store.getters["woTProperties/getWoTProperties"](this.workspace.id, this.woTThingDescription.id);
            const propertyIds = dataServiceProperties.map((dataServiceProperty) => dataServiceProperty.hasProperty);
            return woTProperties.filter((woTProperty) => propertyIds.includes(woTProperty.hasProperty));
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const woTActionId = this.$route.params.woTActionId;
        this.woTAction = this.$store.getters["woTActions/getWoTAction"](this.workspace.id, woTActionId);

        this.woTActionInputProperties = this.$store.getters["woTActionInputProperties/getWoTActionInputProperties"](this.workspace.id, this.woTAction.id);

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
                title: this.$t("dialogs.wot_action_deletion_question"),
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
                    title: this.$t("dialogs.wot_action_deletion_failure"),
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
        },
        dataServiceName(dataServiceId) {
            const dataService = this.$store.getters["dataServices/getDataService"](this.workspace.id, dataServiceId);
            return dataService.name ?? dataService.id;
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ woTAction.name }}</span>
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
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.properties")) }}</span>
                <RouterLink :to="{ name: 'woTActionInputProperties.create', params: { workspaceId: workspace.id, woTActionId: woTAction.id } }" class="btn btn-primary btn-sm ms-3">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <div v-if="!woTActionInputProperties.length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_input_properties") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <td>{{ Utils.capitalize($t("main.name")) }}</td>
                            <td>{{ Utils.capitalize($t("main.type")) }}</td>
                            <td>{{ Utils.capitalize($t("main.minimum")) }}</td>
                            <td>{{ Utils.capitalize($t("main.maximum")) }}</td>
                            <td>{{ Utils.capitalize($t("main.enum")) }}</td>
                            <td>{{ Utils.capitalize($t("main.required")) }}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="woTActionInputProperty in woTActionInputProperties" :key="woTActionInputProperty.id">
                            <td>
                                <RouterLink :to="{ name: 'woTActionInputProperties.show', params: { woTActionInputPropertyId: woTActionInputProperty.id } }">{{ woTActionInputProperty.name }}</RouterLink>
                            </td>
                            <td>{{ woTActionInputProperty.propertyType }}</td>
                            <td>{{ woTActionInputProperty.minimum }}</td>
                            <td>{{ woTActionInputProperty.maximum }}</td>
                            <td>{{ woTActionInputProperty.enum }}</td>
                            <td class="text-center">
                                <BooleanIcon :value="woTActionInputProperty.required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
