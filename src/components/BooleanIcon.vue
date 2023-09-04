<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<template>
    <i v-if="value" class="fa-solid fa-circle-check text-success" />
    <i v-else class="fa-solid fa-circle-xmark text-danger" />
</template>
