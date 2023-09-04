<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ServiceForm from "@/components/forms/ServiceForm";

export default {
    components: {
        BreadcrumbNav,
        ServiceForm
    },
    created() {
        const serviceId = this.$route.params.serviceId;
        this.service = this.$store.getters["services/getService"](serviceId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.services")),
                route: {
                    name: "services.index"
                }
            },
            {
                name: this.service.name,
                route: {
                    name: "services.show",
                    params: {
                        serviceId: this.service.id
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
            <div class="card-header">{{ service.name }}</div>
            <div class="card-body">
                <ServiceForm :service-prop="service" />
            </div>
        </div>
    </div>
</template>
