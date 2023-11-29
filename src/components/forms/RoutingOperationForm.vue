<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        routingOperationProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            routingOperation: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.routingOperation.hasWorkspace = this.workspace.id;

        if (this.routingOperationProp) {
            this.update = true;
            Object.assign(this.routingOperation, this.routingOperationProp);
        }
    },
    methods: {
        async storeRoutingOperation() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.routingOperation = await this.$store.dispatch("routingOperations/storeRoutingOperation", { workspaceId: this.workspace.id, routingOperation: this.routingOperation });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_operation_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routingOperations.show", params: { routingOperationId: this.routingOperation.id } });
        },
        async updateRoutingOperation() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("routingOperations/updateRoutingOperation", { workspaceId: this.workspace.id, routingOperation: this.routingOperation });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_operation_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routingOperations.show", params: { routingOperationId: this.routingOperation.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateRoutingOperation() : storeRoutingOperation()">
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
