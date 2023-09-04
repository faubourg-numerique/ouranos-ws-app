<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ServiceForm from "@/components/forms/ServiceForm";

export default {
    components: {
        BreadcrumbNav,
        ServiceForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.services")),
                route: {
                    name: "services.index"
                }
            },
            {
                active: true,
                name: this.Utils.capitalize(this.$t("main.create"))
            }
        ];
    }
};
</script>

<template>
    <div class="container container-small my-5">
        <BreadcrumbNav :items="breadcrumbItems" />
        <div class="card">
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_service")) }}</div>
            <div class="card-body">
                <ServiceForm />
            </div>
        </div>
    </div>
</template>
