<script>
import Utils from "@/classes/Utils";
import ApiErrorAlert from "@/components/ApiErrorAlert";

export default {
    components: {
        ApiErrorAlert
    },
    props: {
        contractDetailProp: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            error: null,
            update: false,
            contractDetail: {
                scopeType: null,
                scopeEntity: null,
                roleScopeName: null
            },
            scopeEntities: [],
            setAScope: false
        };
    },
    computed: {
        scopeTypes() {
            if (!this.contract.scopeType) {
                return [];
            }

            const types = [];
            for (const type of Object.values(this.types)) {
                if (type.scopeName === null) {
                    continue;
                }
                const properties = this.$store.getters["properties/getProperties"](this.workspace.id, type.id);
                for (const property of Object.values(properties)) {
                    if (property.relationshipType === this.contract.scopeType) {
                        types.push(type);
                        break;
                    }
                }
            }
            return types;
        }
    },
    watch: {
        "contractDetail.roleScopeName"(roleScopeName) {
            if (!roleScopeName) {
                this.roleScopeName = null;
            }
        },
        async "contractDetail.scopeType"() {
            this.scopeEntities.length = 0;

            if (!this.contractDetail.scopeType) {
                this.contractDetail.scopeEntity = null;
                return;
            }

            const type = this.$store.getters["types/getType"](this.workspace.id, this.contractDetail.scopeType);

            const query = {
                type: type.name
            };
            let entities;
            try {
                entities = await this.$store.dispatch("entities/indexEntities", { workspaceId: this.workspace.id, query });
            } catch (error) {
                this.error = error;
                return;
            }

            for (const entity of Object.values(entities)) {
                for (const property of Object.values(entity.data)) {
                    if (property.object && property.object === this.contract.scopeEntity) {
                        this.scopeEntities.push(entity);
                        break;
                    }
                }
            }
        },
        setAScope(setAScope) {
            if (!setAScope) {
                this.contractDetail.scopeType = null;
                this.contractDetail.scopeEntity = null;
            }
        }
    },
    async created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);
        this.types = this.$store.getters["types/getTypes"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](workspaceId, contractId);

        this.contractDetail.hasWorkspace = workspaceId;
        this.contractDetail.hasContract = contractId;

        if (this.contractDetailProp) {
            this.update = true;
            Object.assign(this.contractDetail, this.contractDetailProp);
        }

        this.roles = this.$store.getters["roles/getRoles"](this.workspace.id);
    },
    methods: {
        async storeContractDetail() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                this.contractDetail = await this.$store.dispatch("contractDetails/storeContractDetail", { workspaceId: this.workspace.id, contractDetail: this.contractDetail });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_detail_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contractDetails.show", params: { contractDetailId: this.contractDetail.id } });
        },
        async updateContractDetail() {
            this.$store.dispatch("setDisplayLoadingScreen", true);

            try {
                await this.$store.dispatch("contractDetails/updateContractDetail", { workspaceId: this.workspace.id, contractDetail: this.contractDetail });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_detail_update_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contractDetails.show", params: { contractDetailId: this.contractDetail.id } });
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="update ? updateContractDetail() : storeContractDetail()">
        <div class="mb-3">
            <label for="role-id" class="form-label">{{ Utils.capitalize($t("main.role")) }}</label>
            <select id="role-id" v-model="contractDetail.hasRole" class="form-select" required>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="role-scope-name" class="form-label">{{ Utils.capitalize($t("main.role_scope_name")) }}</label>
            <input id="role-scope-name" v-model="contractDetail.roleScopeName" type="text" class="form-control">
        </div>
        <div class="form-check mb-3">
            <input id="set-a-scope" class="form-check-input" type="checkbox" v-model="setAScope">
            <label for="set-a-scope" class="form-check-label">{{ Utils.capitalize($t("main.set_a_scope")) }}</label>
        </div>
        <template v-if="setAScope && contract.scopeType && contract.scopeEntity">
            <div class="mb-3">
                <label for="scope-type" class="form-label">{{ Utils.capitalize($t("main.scope_type")) }}</label>
                <select id="scope-type" v-model="contractDetail.scopeType" class="form-select" required>
                    <option :value="null">---</option>
                    <option v-for="type in scopeTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
            </div>
            <div class="mb-3" v-if="contractDetail.scopeType">
                <label for="scope-entity" class="form-label">{{ Utils.capitalize($t("main.scope_entity")) }}</label>
                <select id="scope-entity" v-model="contractDetail.scopeEntity" class="form-select" required>
                    <option v-for="entity in scopeEntities" :key="entity.getId()" :value="entity.getId()">{{ entity.getId() }}<template v-if="entity.propertyExists('name')"> ({{ entity.getProperty("name") }})</template></option>
                </select>
            </div>
        </template>
        <button type="submit" class="btn btn-primary">{{ update ? Utils.capitalize($t("main.update")) : Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>
