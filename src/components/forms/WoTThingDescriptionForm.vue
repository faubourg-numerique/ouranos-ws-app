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
                positionInChart: []
            }
        };
    },
    watch: {
        "woTThingDescription.description"(description) {
            if (description === "") {
                delete this.woTThingDescription.description;
            }
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.woTThingDescription.hasWorkspace = this.workspace.id;
        this.types = this.$store.getters["types/getTypes"](this.workspace.id);

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
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="woTThingDescription.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="woTThingDescription.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="has-type" class="form-label">{{ Utils.capitalize($t("main.type")) }}</label>
            <select id="has-type" v-model="woTThingDescription.hasType" class="form-select" required>
                <option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
