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

        const routingOperationControlId = this.$route.params.routingOperationControlId;
        this.routingOperationControl = this.$store.getters["routingOperationControls/getRoutingOperationControl"](this.workspace.id, routingOperationControlId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.routing_operation_controls")),
                route: {
                    name: "routingOperationControls.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.routing_operation_control"))
            }
        ];
    },
    methods: {
        async destroyRoutingOperationControl() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.routing_operation_control_deletion_question"),
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
                await this.$store.dispatch("routingOperationControls/destroyRoutingOperationControl", { workspaceId: this.workspace.id, routingOperationControl: this.routingOperationControl });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_operation_control_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routingOperationControls.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ routingOperationControl.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateRoutingOperationControl(workspace.id, routingOperationControl.id)" :to="{ name: 'routingOperationControls.edit', params: { name: routingOperationControl.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyRoutingOperationControl(workspace.id, routingOperationControl.id)" class="btn btn-danger btn-sm ms-3" @click="destroyRoutingOperationControl">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ routingOperationControl.id }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
