<script>
export default {
    props: {
        items: {
            type: Array
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
}
</script>

<template>
    <nav>
        <ol class="breadcrumb">
            <li v-for="(item, index) in items" :key="index" class="breadcrumb-item" :class="{ 'active': item.active }">
                <RouterLink v-if="item.route" :to="item.route">{{ item.name }}</RouterLink>
                <template v-else>{{ item.name }}</template>
            </li>
        </ol>
        <button class="btn btn-sm btn-light back" @click="goBack"><i class="fa-solid fa-angles-left" :disabled="items.length < 2" /></button>
    </nav>
</template>

<style scoped>
nav {
    position: relative;
}

.back {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
}
</style>
