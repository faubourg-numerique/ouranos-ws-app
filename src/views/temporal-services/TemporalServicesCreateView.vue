<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TemporalServiceForm from "@/components/forms/TemporalServiceForm";

export default {
    components: {
        BreadcrumbNav,
        TemporalServiceForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.temporal_services")),
                route: {
                    name: "temporalServices.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_temporal_service")) }}</div>
            <div class="card-body">
                <TemporalServiceForm />
            </div>
        </div>
    </div>
</template>
