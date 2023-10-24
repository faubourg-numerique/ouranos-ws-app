<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    data() {
        return {
            error: null
        };
    },
    computed: {
        isDataModelUpToDate() {
            const workspace = this.$store.getters["workspaces/getWorkspace"](this.workspace.id);
            return workspace.dataModelUpToDate;
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.types = {};
        var types = Object.values(this.$store.getters["types/getTypes"](this.workspace.id));
        types = this.Utils.sortEntitiesByName(types);
        types.forEach(type => {
            this.types[type.id] = type;
        });
    },
    methods: {
        async generateDataModel() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.data_model_generation_question"),
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
                await this.$store.dispatch("dataModel/generateDataModel", this.workspace.id);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_model_generation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$swal.fire({
                title: this.$t("dialogs.data_model_generation_success"),
                icon: "success",
                heightAuto: false
            });
        },
        async autoDiscoverDataModel() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.data_model_auto_discover_question"),
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
                await this.$store.dispatch("dataModel/autoDiscoverDataModel", this.workspace.id);
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.data_model_auto_discover_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$swal.fire({
                title: this.$t("dialogs.data_model_auto_discover_success"),
                icon: "success",
                heightAuto: false
            });
        }
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.types")) }}</span>
                <span>
                    <button v-if="isDataModelUpToDate && $authorization.canGenerateDataModel(workspace.id)" class="btn btn-primary btn-sm" @click="autoDiscoverDataModel">
                        <i class="fa-solid fa-satellite-dish" />
                    </button>
                    <button v-if="$authorization.canGenerateDataModel(workspace.id)" class="btn btn-primary btn-sm ms-3" @click="generateDataModel">
                        <i class="fa-solid fa-gears" />
                    </button>
                    <RouterLink v-if="$authorization.canStoreType(workspace.id)" :to="{ name: 'types.create', params: { workspaceId: workspace.id } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-plus" />
                    </RouterLink>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(types).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_type") }}</div>
                <table v-else class="table mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="_type in types" :key="_type.id">
                            <td>
                                <RouterLink :to="{ name: 'types.show', params: { workspaceId: workspace.id, typeId: _type.id } }">{{ _type.name }}</RouterLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
