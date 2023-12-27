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

        this.woTProperties = this.$store.getters["woTProperties/getWoTProperties"](workspaceId, this.woTThingDescription.id);

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
            <label for="wot-property" class="form-label">{{ Utils.capitalize($t("main.wot_property")) }}</label>
            <select id="wot-property" v-model="routingOperationControl.hasWoTProperty" class="form-select" required>
                <option v-for="woTProperty in woTProperties" :key="woTProperty.id" :value="woTProperty.id">{{ woTProperty.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="wot-property-value" class="form-label">{{ Utils.capitalize($t("main.wot_property_value")) }}</label>
            <input id="wot-property-value" v-model="routingOperationControl.woTPropertyValue" type="text" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
