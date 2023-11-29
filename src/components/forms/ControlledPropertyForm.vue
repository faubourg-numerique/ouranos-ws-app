<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        controlledPropertyProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            controlledProperty: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.controlledProperty.hasWorkspace = this.workspace.id;

        if (this.controlledPropertyProp) {
            this.update = true;
            Object.assign(this.controlledProperty, this.controlledPropertyProp);
        }
    },
    methods: {
        async storeControlledProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.controlledProperty = await this.$store.dispatch("controlledProperties/storeControlledProperty", { workspaceId: this.workspace.id, controlledProperty: this.controlledProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.controlled_property_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "controlledProperties.show", params: { controlledPropertyId: this.controlledProperty.id } });
        },
        async updateControlledProperty() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("controlledProperties/updateControlledProperty", { workspaceId: this.workspace.id, controlledProperty: this.controlledProperty });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.controlled_property_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "controlledProperties.show", params: { controlledPropertyId: this.controlledProperty.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateControlledProperty() : storeControlledProperty()">
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
