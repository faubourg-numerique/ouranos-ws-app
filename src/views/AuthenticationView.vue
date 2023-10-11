<script>
export default {
    created() {
        const query = {
            response_type: "token",
            client_id: process.env.VUE_APP_IDENTITY_MANAGER_CLIENT_ID,
            redirect_uri: process.env.VUE_APP_IDENTITY_MANAGER_REDIRECT_URI,
            state: false
        };
        this.identityManagerAuthorizeUrl = process.env.VUE_APP_IDENTITY_MANAGER_AUTHORIZE_URL + "?" + new URLSearchParams(query).toString();
    }
}
</script>

<template>
    <div id="authentication-form-container" class="d-flex align-items-center justify-content-center w-100 h-100">
        <div id="authentication-form" class="card">
            <div class="card-body">
                <h5 class="card-title">{{ Utils.capitalize($t("main.authentication")) }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ Utils.capitalize($t("main.identity_manager")) }}</h6>
                <p class="card-text">{{ $t("dialogs.authentication_text") }}</p>
                <a v-focus :href="identityManagerAuthorizeUrl" class="btn btn-primary">{{ Utils.capitalize($t("main.continue")) }}</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
#authentication-form-container {
    background-color: #ecf0f1;
}

#authentication-form {
    width: 400px;
}
</style>
