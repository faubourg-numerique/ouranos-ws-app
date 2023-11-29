<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";
import BreadcrumbNav from "@/components/BreadcrumbNav";

export default {
    components: {
        ApiErrorAlert,
        BreadcrumbNav
    },
    data() {
        return {
            error: null
        };
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const routingId = this.$route.params.routingId;
        this.routing = this.$store.getters["routings/getRouting"](this.workspace.id, routingId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.routings")),
                route: {
                    name: "routings.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.routing"))
            }
        ];
    },
    methods: {
        async destroyRouting() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.routing_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("routings/destroyRouting", { workspaceId: this.workspace.id, routing: this.routing });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.routing_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "routings.index" });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ routing.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateRouting(workspace.id, routing.id)" :to="{ name: 'routings.edit', params: { name: routing.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyRouting(workspace.id, routing.id)" class="btn btn-danger btn-sm ms-3" @click="destroyRouting">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.id")) }}</dt>
                    <dd class="col-sm-8">{{ routing.id }}</dd>
                </dl>
            </div>
        </div>
    </div>
</template>
