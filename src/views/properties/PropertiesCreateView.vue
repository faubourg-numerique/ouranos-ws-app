<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import PropertyForm from "@/components/forms/PropertyForm";

export default {
    components: {
        BreadcrumbNav,
        PropertyForm
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const typeId = this.$route.params.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.types")),
                route: {
                    name: "types.index",
                    params: {
                        workspaceId: this.workspace.id
                    }
                }
            },
            {
                name: this.type.name,
                route: {
                    name: "types.show",
                    params: {
                        workspaceId: this.workspace.id,
                        typeId: this.type.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create_a_property"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_property")) }}</div>
            <div class="card-body">
                <PropertyForm />
            </div>
        </div>
    </div>
</template>
