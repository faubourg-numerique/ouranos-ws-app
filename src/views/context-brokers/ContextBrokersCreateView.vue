<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ContextBrokerForm from "@/components/forms/ContextBrokerForm";

export default {
    components: {
        BreadcrumbNav,
        ContextBrokerForm
    },
    created() {
        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.context_brokers")),
                route: {
                    name: "contextBrokers.index"
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
            <div class="card-header">{{ Utils.capitalize($t("main.create_a_context_broker")) }}</div>
            <div class="card-body">
                <ContextBrokerForm />
            </div>
        </div>
    </div>
</template>
