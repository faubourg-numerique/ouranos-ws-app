<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TemporalServiceForm from "@/components/forms/TemporalServiceForm";

export default {
    components: {
        BreadcrumbNav,
        TemporalServiceForm
    },
    created() {
        const temporalServiceId = this.$route.params.temporalServiceId;
        this.temporalService = this.$store.getters["temporalServices/getTemporalService"](temporalServiceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.temporal_services")),
                route: {
                    name: "temporalServices.index"
                }
            },
            {
                name: this.temporalService.name,
                route: {
                    name: "temporalServices.show",
                    params: {
                        temporalServiceId: this.temporalService.id
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
            <div class="card-header">{{ temporalService.name }}</div>
            <div class="card-body">
                <TemporalServiceForm :temporal-service-prop="temporalService" />
            </div>
        </div>
    </div>
</template>
