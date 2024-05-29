import { createApp } from "vue";
import swal from "sweetalert2";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import App from "@/App";
import i18n from "@/i18n";
import router from "@/router";
import store from "@/store";
import { Authorization } from "@/classes/Authorization";
import Utils from "@/classes/Utils";

const app = createApp(App)
    .use(i18n)
    .use(router)
    .use(store)
    .use(VueGoogleMaps, {
        load: {
            key: window.googleMapsApiKey,
        }
    });

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters["authentication/isAuthenticated"];

    if (!isAuthenticated && to.name !== "authentication" && to.name !== "callbacks.authentication") {
        next({ name: "authentication" });
    } else {
        next();
    }
});

var enabledModulesArray = [];
if (window.enabledModules) {
    var temp = window.enabledModules.split(",");
    temp = temp.map(x => x.trim());
    enabledModulesArray = temp.map(x => x.toLowerCase());
}

app.config.globalProperties.I4TRUST_MODULE_ENABLED = enabledModulesArray.includes("i4trust");

app.config.globalProperties.$swal = swal;
app.config.globalProperties.$authorization = new Authorization();
app.config.globalProperties.Utils = Utils;

app.directive("focus", {
    mounted(element) {
        element.focus();
    }
});

app.mount("#app");
