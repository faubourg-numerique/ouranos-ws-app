<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        woTActionProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            woTAction: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        this.woTAction.hasWorkspace = this.workspace.id;
        this.woTAction.hasWoTThingDescription = this.woTThingDescription.id;

        if (this.woTActionProp) {
            this.update = true;
            Object.assign(this.woTAction, this.woTActionProp);
        }
    },
    methods: {
        async storeWoTAction() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.woTAction = await this.$store.dispatch("woTActions/storeWoTAction", { workspaceId: this.workspace.id, woTAction: this.woTAction });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_action_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTActions.show", params: { woTActionId: this.woTAction.id } });
        },
        async updateWoTAction() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("woTActions/updateWoTAction", { workspaceId: this.workspace.id, woTAction: this.woTAction });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_action_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTActions.show", params: { woTActionId: this.woTAction.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateWoTAction() : storeWoTAction()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="woTAction.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="woTAction.description" class="form-control" rows="3" />
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
