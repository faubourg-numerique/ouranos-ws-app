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
            error: null,
            scopeType: null,
            scopeEntity: null
        };
    },
    async created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const contractId = this.$route.params.contractId;
        this.contract = this.$store.getters["contracts/getContract"](this.workspace.id, contractId);

        const contractDetailId = this.$route.params.contractDetailId;
        this.contractDetail = this.$store.getters["contractDetails/getContractDetail"](this.workspace.id, contractDetailId);

        const scopeTypeId = this.contractDetail.scopeType;
        if (scopeTypeId) {
            this.scopeType = this.$store.getters["types/getType"](this.workspace.id, scopeTypeId);
        }

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.contracts")),
                route: {
                    name: "contracts.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.contract.id,
                route: {
                    name: "contracts.show",
                    params: {
                        workspaceId: this.workspace.id,
                        contractId: this.contract.id
                    }
                }
            },
            {
                active: true,
                name: this.contractDetail.id
            }
        ];

        const scopeEntityId = this.contractDetail.scopeEntity;
        if (scopeEntityId) {
            try {
                this.scopeEntity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspace.id, entityId: scopeEntityId });
            } catch (error) {
                this.error = error;
            }
        }
    },
    methods: {
        getRole(roleId) {
            return this.$store.getters["roles/getRole"](this.workspace.id, roleId);
        },
        async destroyContractDetail() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.contract_detail_deletion_question"),
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
                await this.$store.dispatch("contractDetails/destroyContractDetail", { workspaceId: this.workspace.id, contractDetail: this.contractDetail });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.contract_detail_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }

            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "contracts.show", params: { workspaceId: this.workspace.id, contractId: this.contract.id } });
        }
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ contractDetail.id }}</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateContractDetail(workspace.id, contractDetail.id)" :to="{ name: 'contractDetails.edit', params: { contractDetailId: contractDetail.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-pencil-alt" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyContractDetail(workspace.id, contractDetail.id)" class="btn btn-danger btn-sm ms-3" @click="destroyContractDetail">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <dl class="row mb-0">
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.role")) }}</dt>
                    <dd class="col-sm-8">
                        <RouterLink :to="{ name: 'roles.show', params: { roleId: contractDetail.hasRole } }">{{ getRole(contractDetail.hasRole).name }}</RouterLink>
                    </dd>
                    <dt class="col-sm-4">{{ Utils.capitalize($t("main.contract")) }}</dt>
                    <dd class="col-sm-8">{{ contractDetail.hasContract }}</dd>
                    <template v-if="scopeType">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.scope_type")) }}</dt>
                        <dd class="col-sm-8">{{ scopeType.name }}</dd>
                    </template>
                    <template v-if="scopeEntity">
                        <dt class="col-sm-4">{{ Utils.capitalize($t("main.scope_entity")) }}</dt>
                        <dd class="col-sm-8">{{ scopeEntity.getId() }}<template v-if="scopeEntity.propertyExists('name')"> ({{ scopeEntity.getProperty("name") }})</template></dd>
                    </template>
                </dl>
            </div>
        </div>
    </div>
</template>
