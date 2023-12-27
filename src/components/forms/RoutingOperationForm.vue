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

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        const routingId = this.$route.params.routingId;
        this.routing = this.$store.getters["routings/getRouting"](workspaceId, routingId);

        this.routingOperation.hasWorkspace = this.workspace.id;
        this.routingOperation.hasRouting = this.routing.id;

        this.woTActions = this.$store.getters["woTActions/getWoTActions"](workspaceId, this.woTThingDescription.id);

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
        <div class="mb-3">
            <label for="sequence-number" class="form-label">{{ Utils.capitalize($t("main.sequence_number")) }}</label>
            <input id="sequence-number" v-model="routingOperation.sequenceNumber" v-focus type="number" min="0" step="1" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="timer-before" class="form-label">{{ Utils.capitalize($t("main.timer_before")) }}</label>
            <input id="timer-before" v-model="routingOperation.timerBefore" type="number" min="0" step="1" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="timer-after" class="form-label">{{ Utils.capitalize($t("main.timer_after")) }}</label>
            <input id="timer-after" v-model="routingOperation.timerAfter" type="number" min="0" step="1" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="woTAction" class="form-label">{{ Utils.capitalize($t("main.woTAction")) }}</label>
            <select id="woTAction" v-model="routingOperation.hasWoTAction" class="form-select" required>
                <option v-for="woTAction in woTActions" :key="woTAction.id" :value="woTAction.id">{{ woTAction.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
