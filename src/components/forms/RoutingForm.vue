<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        routingProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            routing: {
            }
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const woTThingDescriptionId = this.$route.params.woTThingDescriptionId;
        this.woTThingDescription = this.$store.getters["woTThingDescriptions/getWoTThingDescription"](workspaceId, woTThingDescriptionId);

        this.routing.hasWorkspace = this.workspace.id;
        this.routing.hasWoTThingDescription = this.woTThingDescription.id;

        if (this.routingProp) {
            this.update = true;
            Object.assign(this.routing, this.routingProp);
        }
    },
    methods: {
        async storeRouting() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.routing = await this.$store.dispatch("routings/storeRouting", { workspaceId: this.workspace.id, routing: this.routing });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routings.show", params: { routingId: this.routing.id } });
        },
        async updateRouting() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("routings/updateRouting", { workspaceId: this.workspace.id, routing: this.routing });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routings.show", params: { routingId: this.routing.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateRouting() : storeRouting()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="routing.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="routing.description" class="form-control" rows="3" />
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
