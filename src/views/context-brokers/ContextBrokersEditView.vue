<script>
import BreadcrumbNav from "@/components/BreadcrumbNav";
import ContextBrokerForm from "@/components/forms/ContextBrokerForm";

export default {
    components: {
        BreadcrumbNav,
        ContextBrokerForm
    },
    created() {
        const contextBrokerId = this.$route.params.contextBrokerId;
        this.contextBroker = this.$store.getters["contextBrokers/getContextBroker"](contextBrokerId);

        this.breadcrumbItems = [
            {
                name: this.Utils.capitalize(this.$t("main.context_brokers")),
                route: {
                    name: "contextBrokers.index"
                }
            },
            {
                name: this.contextBroker.name,
                route: {
                    name: "contextBrokers.show",
                    params: {
                        contextBrokerId: this.contextBroker.id
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
            <div class="card-header">{{ contextBroker.name }}</div>
            <div class="card-body">
                <ContextBrokerForm :context-broker-prop="contextBroker" />
            </div>
        </div>
    </div>
</template>
