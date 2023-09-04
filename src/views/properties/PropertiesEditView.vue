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

        const propertyId = this.$route.params.propertyId;
        this.property = this.$store.getters["properties/getProperty"](this.workspace.id, this.type.id, propertyId);

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
                name: this.property.name,
                route: {
                    name: "properties.show",
                    params: {
                        workspaceId: this.workspace.id,
                        propertyId: this.property.id
                    }
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.edit"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ property.name }}</div>
            <div class="card-body">
                <PropertyForm :property-prop="property" />
            </div>
        </div>
    </div>
</template>
