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
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.controlledProperties = this.$store.getters["controlledProperties/getControlledProperties"](this.workspace.id);
    }
};
</script>

<template>
    <div class="container my-5">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span>{{ Utils.capitalize($t("main.controlled_properties")) }}</span>
                <RouterLink v-if="$authorization.canStoreControlledProperty(workspace.id)" :to="{ name: 'controlledProperties.create' }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </div>
            <div class="card-body">
                <ApiErrorAlert v-if="error" :error="error" />
                <div v-if="!Object.values(controlledProperties).length" class="alert alert-primary mb-0">{{ $t("dialogs.there_is_no_controlled_property") }}</div>
                <table v-else class="table align-middle mb-0">
                    <thead class="table-dark">
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="controlledProperty in controlledProperties" :key="controlledProperty.id">
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
