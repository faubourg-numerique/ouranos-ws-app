<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        routingOperationControlProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            routingOperationControl: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.routingOperationControl.hasWorkspace = this.workspace.id;

        if (this.routingOperationControlProp) {
            this.update = true;
            Object.assign(this.routingOperationControl, this.routingOperationControlProp);
        }
    },
    methods: {
        async storeRoutingOperationControl() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.routingOperationControl = await this.$store.dispatch("routingOperationControls/storeRoutingOperationControl", { workspaceId: this.workspace.id, routingOperationControl: this.routingOperationControl });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_operation_control_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routingOperationControls.show", params: { routingOperationControlId: this.routingOperationControl.id } });
        },
        async updateRoutingOperationControl() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("routingOperationControls/updateRoutingOperationControl", { workspaceId: this.workspace.id, routingOperationControl: this.routingOperationControl });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_operation_control_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routingOperationControls.show", params: { routingOperationControlId: this.routingOperationControl.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateRoutingOperationControl() : storeRoutingOperationControl()">
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
