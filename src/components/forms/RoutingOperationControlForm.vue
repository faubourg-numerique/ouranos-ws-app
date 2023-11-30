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

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const routingId = this.$route.params.routingId;
        this.routing = this.$store.getters["routings/getRouting"](workspaceId, routingId);

        const routingOperationId = this.$route.params.routingOperationId;
        this.routingOperation = this.$store.getters["routingOperations/getRoutingOperation"](workspaceId, routingOperationId);

        this.routingOperationControl.hasWorkspace = this.workspace.id;
        this.routingOperationControl.hasRoutingOperation = this.routingOperation.id;

        this.controlledProperties = this.$store.getters["controlledProperties/getControlledProperties"](workspaceId, this.routingOperation.hasCapability);

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
        <div class="mb-3">
            <label for="controlled-property" class="form-label">{{ Utils.capitalize($t("main.controlled_property")) }}</label>
            <select id="controlled-property" v-model="routingOperationControl.hasControlledProperty" class="form-select" required>
                <option v-for="controlledProperty in controlledProperties" :key="controlledProperty.id" :value="controlledProperty.id">{{ controlledProperty.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="controlled-property-value" class="form-label">{{ Utils.capitalize($t("main.controlled_property_value")) }}</label>
            <input id="controlled-property-value" v-model="routingOperationControl.controlledPropertyValue" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
