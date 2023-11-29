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

        const controlledPropertyId = this.$route.params.controlledPropertyId;
        this.controlledProperty = this.$store.getters["controlledProperties/getControlledProperty"](this.workspace.id, controlledPropertyId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.controlled_properties")),
                route: {
                    name: "controlledProperties.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.controlled_property"))
            }
        ];
    },
    methods: {
        async destroyControlledProperty() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.controlled_property_deletion_question"),
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
                await this.$store.dispatch("controlledProperties/destroyControlledProperty", { workspaceId: this.workspace.id, controlledProperty: this.controlledProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.controlled_property_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "controlledProperties.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ controlledProperty.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateControlledProperty(workspace.id, controlledProperty.id)" :to="{ name: 'controlledProperties.edit', params: { name: controlledProperty.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyControlledProperty(workspace.id, controlledProperty.id)" class="btn btn-danger btn-sm ms-3" @click="destroyControlledProperty">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ controlledProperty.id }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
