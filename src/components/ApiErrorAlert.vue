<script>
import JsonViewer from "vue-json-viewer";

export default {
    components: {
        JsonViewer
    },
    props: {
        error: {
            type: Object
        }
    }
}
</script>

<template>
    <div class="alert alert-danger">
        <h5 class="alert-heading">{{ Utils.capitalize($t("main.the_api_returned_an_error")) }}</h5>
        <p v-if="error.title" class="mb-0">{{ error.title }}</p>
        <div v-if="error.details">
            <hr>
            <JsonViewer :value="error.details" expanded />
        </div>
    </div>
</template>

<style>
.jv-container.jv-light {
    background: transparent !important;
}

.jv-container .jv-code {
    padding: 0 !important;
}
</style>
