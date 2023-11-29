<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        woTThingDescriptionProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            woTThingDescription: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.woTThingDescription.hasWorkspace = this.workspace.id;

        if (this.woTThingDescriptionProp) {
            this.update = true;
            Object.assign(this.woTThingDescription, this.woTThingDescriptionProp);
        }
    },
    methods: {
        async storeWoTThingDescription() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.woTThingDescription = await this.$store.dispatch("woTThingDescriptions/storeWoTThingDescription", { workspaceId: this.workspace.id, woTThingDescription: this.woTThingDescription });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_thing_description_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show", params: { woTThingDescriptionId: this.woTThingDescription.id } });
        },
        async updateWoTThingDescription() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("woTThingDescriptions/updateWoTThingDescription", { workspaceId: this.workspace.id, woTThingDescription: this.woTThingDescription });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.wot_thing_description_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "woTThingDescriptions.show", params: { woTThingDescriptionId: this.woTThingDescription.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateWoTThingDescription() : storeWoTThingDescription()">
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
