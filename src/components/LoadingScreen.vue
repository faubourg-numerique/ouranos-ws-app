<template>
    <div id="loading-screen" class="position-fixed d-flex justify-content-center w-100 h-100">
        <div class="spinner spinner-border text-white align-self-center" />
    </div>
</template>

<style scoped>
#loading-screen {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
}

#loading-screen .spinner {
    width: 3rem;
    height: 3rem;
}
</style>
