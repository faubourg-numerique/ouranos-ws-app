<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        typeProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            type: {
                standardDataModelBased: false,
                dataModelGroup: null,
                scopeName: null
            }
        };
    },
    watch: {
        "type.name"(name, oldName) {
            if ((!this.update || !this.Utils.isUndefined(oldName)) && this.workspace.defaultDataModelUrl) {
                this.type.url = this.workspace.defaultDataModelUrl + name;
            }
        },
        "type.description"(description) {
            if (description === "") {
                delete this.type.description;
            }
        },
        "type.url"(url) {
            if (url === "") {
                delete this.type.url;
            }
        },
        "type.standardDataModelBased"(standardDataModelBased) {
            if (!standardDataModelBased) {
                delete this.type.standardDataModelType;
                delete this.type.standardDataModelDefinitionUrl;
            }
        },
        "type.scopeName"(scopeName) {
            if (!scopeName) {
                this.type.scopeName = null;
            }
        }
    },
    created() {
        if (this.typeProp) {
            this.update = true;
            Object.assign(this.type, this.typeProp);
        }

        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.workspaces = this.$store.getters["workspaces/getWorkspaces"];

        if (!this.update) {
            this.type.hasWorkspace = this.workspace.id;
            if (this.workspace.defaultDataModelUrl) {
                this.type.url = this.workspace.defaultDataModelUrl;
            }
        }
    },
    methods: {
        async storeType() {
            if (this.type.url === this.workspace.defaultDataModelUrl) {
                this.$swal.fire({
                    title: this.$t("dialogs.default_url_error"),
                    icon: "warning",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                this.type = await this.$store.dispatch("types/storeType", { workspaceId: this.workspace.id, type: this.type });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.type_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "types.show", params: { workspaceId: this.workspace.id, typeId: this.type.id } });
        },
        async updateType() {
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("types/updateType", { workspaceId: this.workspace.id, type: this.type });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.type_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "types.show", params: { workspaceId: this.workspace.id, typeId: this.type.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateType() : storeType()">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="type.name" v-focus type="text" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="type.description" class="form-control" rows="3" />
        </div>
        <div class="mb-3">
            <label for="url" class="form-label">{{ Utils.capitalize($t("main.url")) }}</label>
            <input id="url" v-model="type.url" type="url" class="form-control">
        </div>
        <div class="mb-3">
            <label for="data-model-group" class="form-label">{{ Utils.capitalize($t("main.data_model_group")) }}</label>
            <select id="data-model-group" v-model="type.dataModelGroup" class="form-select">
                <option :value="null">{{ Utils.capitalize($t("main.unset")) }}</option>
                <option value="equipment">{{ Utils.capitalize($t("main.equipment")) }}</option>
                <option value="equipment-model">{{ Utils.capitalize($t("main.equipment_model")) }}</option>
                <option value="infrastructure">{{ Utils.capitalize($t("main.infrastructure")) }}</option>
                <option value="control">{{ Utils.capitalize($t("main.control")) }}</option>
                <option value="observation-data-collection">{{ Utils.capitalize($t("main.observation_data_collection")) }}</option>
            </select>
        </div>
        <div class="mb-3">
            <div class="form-check">
                <input id="standard-data-model-based" v-model="type.standardDataModelBased" class="form-check-input" type="checkbox">
                <label for="standard-data-model-based" class="form-check-label">{{ Utils.capitalize($t("main.standard_data_model_based")) }}</label>
            </div>
        </div>
        <template v-if="type.standardDataModelBased">
            <div class="mb-3">
                <label for="standard-data-model-type" class="form-label">{{ Utils.capitalize($t("main.standard_data_model_type")) }}</label>
                <select id="standard-data-model-type" v-model="type.standardDataModelType" class="form-select" required>
                    <option value="smart-data-models">Smart Data Models</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="standard-data-model-definition-url" class="form-label">{{ Utils.capitalize($t("main.standard_data_model_definition_url")) }}</label>
                <input id="standard-data-model-definition-url" v-model="type.standardDataModelDefinitionUrl" type="url" class="form-control" required>
            </div>
        </template>
        <div class="mb-3">
            <label for="scope-name" class="form-label">{{ Utils.capitalize($t("main.scope_name")) }}</label>
            <input id="scope-name" v-model="type.scopeName" type="text" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
