<script>
import axios from "axios";

import { apiUrl, identityManagerAuthorizeUrl, identityManagerRedirectUri, identityManagerClientId } from "@/config.js";

export default {
    async created() {
        const accessToken = this.$route.query.token;
        const accessTokenType = this.$route.query.token_type;
        const expirationDate = this.$route.query.expires_at;

        if (!accessToken) return;
        if (!accessTokenType) return;
        if (!expirationDate) return;

        const expirationTime = Date.parse(expirationDate);

        this.$store.dispatch("authentication/setAccessToken", accessToken);
        this.$store.dispatch("authentication/setAccessTokenType", accessTokenType);
        this.$store.dispatch("authentication/setExpirationTime", expirationTime);
        this.$store.dispatch("authentication/setAuthenticated", true);

        this.$store.$api = axios.create({
            baseURL: apiUrl,
            headers: {
                "Authorization": `${accessTokenType} ${accessToken}`
            }
        });

        const response = await this.$store.$api.get("/authorization/permissions");
        const permissions = response.data;

        this.$authorization.loadPermissions(permissions);

        await Promise.all([
            this.$store.dispatch("identityManagerGrants/fetchIdentityManagerGrants"),
            this.$store.dispatch("identityManagers/fetchIdentityManagers"),
            this.$store.dispatch("vcVerifiers/fetchVCVerifiers"),
            this.$store.dispatch("trustedIssuersLists/fetchTrustedIssuersLists"),
            this.$store.dispatch("contextBrokers/fetchContextBrokers"),
            this.$store.dispatch("services/fetchServices"),
            this.$store.dispatch("temporalServices/fetchTemporalServices"),
            this.$store.dispatch("workspaces/fetchWorkspaces"),
            this.$store.dispatch("authorizationRegistryGrants/fetchAuthorizationRegistryGrants"),
            this.$store.dispatch("authorizationRegistries/fetchAuthorizationRegistries"),
            this.$store.dispatch("dataActions/fetchDataActions")
        ]);

        const currentTime = Date.now();
        const time = expirationTime - currentTime - 30 * 1000;

        const query = {
            response_type: "token",
            client_id: identityManagerClientId,
            redirect_uri: identityManagerRedirectUri,
            state: false
        };
        const identityManagerAuthorizeUrl = identityManagerAuthorizeUrl + "?" + new URLSearchParams(query).toString();

        var config = {
            title: this.Utils.capitalize(this.$t("dialogs.session_expired_title")),
            text: this.Utils.capitalize(this.$t("dialogs.session_expired")),
            icon: "info",
            heightAuto: false,
            showCloseButton: false,
            allowOutsideClick: false
        };
        setTimeout(() => {
            this.$swal.fire(config).then(() => {
                window.location = identityManagerAuthorizeUrl;
            });
        }, time);

        this.$router.push({ name: "workspaces.index" });
    }
}
</script>

<template>
    <div id="initial-loading-screen" class="bg-white position-fixed d-flex justify-content-center w-100 h-100">
        <div class="spinner spinner-border align-self-center" />
    </div>
</template>

<style scoped>
#initial-loading-screen .spinner {
    width: 3rem;
    height: 3rem;
}
</style>
