<script>
import ApiErrorAlert from "@/components/ApiErrorAlert";

import { Subscription } from "@/classes/Subscription";
import Utils from "@/classes/Utils";

export default {
    components: {
        ApiErrorAlert
    },
    data() {
        return {
            error: null,
            workspace: null,
            type: null,
            properties: null,
            types: null,
            entity: {},
            subscription: {
                subscriptionName: null,
                description: null,
                entities: [],
                watchedAttributes: [],
                timeInterval: null,
                q: null,
                geoQ: {
                    geometry: null,
                    coordinates: null,
                    georel: null,
                    geoproperty: null
                },
                isActive: true,
                notification: {
                    attributes: [],
                    format: null,
                    endpoint: {
                        uri: null,
                        accept: null
                    }
                },
                expiresAt: null,
                throttling: null,
                lang: null
            }
        };
    },
    watch: {
        "entity.id"(id) {
            if (id === "") {
                delete this.entity.id;
            }
        },
        "entity.idPattern"(idPattern) {
            if (idPattern === "") {
                delete this.entity.idPattern;
            }
        },
        "entity.type"(type) {
            if (type === null) {
                delete this.entity.type;
            }
        }
    },
    created() {
        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        const typeId = this.$route.query.typeId;
        this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);

        this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);
        this.types = this.$store.getters["types/getTypes"](this.workspace.id);
    },
    methods: {
        async storeSubscription() {
            var subscription = new Subscription();
            if (!Utils.isEmpty(this.subscription.subscriptionName)) {
                subscription.setSubscriptionName(this.subscription.subscriptionName);
            }
            if (!Utils.isEmpty(this.subscription.description)) {
                subscription.setDescription(this.subscription.description);
            }
            if (!Utils.isEmpty(this.subscription.entities)) {
                this.subscription.entities.forEach(entity => {
                    var id = (!Utils.isEmpty(entity.id) ? entity.id : null);
                    var idPattern = (!Utils.isEmpty(entity.idPattern) ? entity.idPattern : null);
                    var type = (!Utils.isEmpty(entity.type) ? entity.type : null);
                    subscription.addEntity(id, idPattern, type);
                });
            }
            if (!Utils.isEmpty(this.subscription.watchedAttributes)) {
                this.subscription.watchedAttributes.forEach(attribute => {
                    subscription.addWatchedAttribute(attribute);
                });
            }
            if (!Utils.isEmpty(this.subscription.timeInterval)) {
                subscription.setTimeInterval(Utils.toInteger(this.subscription.timeInterval));
            }
            if (!Utils.isEmpty(this.subscription.q)) {
                subscription.setQuery(this.subscription.q);
            }
            if (!Utils.isEmpty(this.subscription.geoQ.geometry) || !Utils.isEmpty(this.subscription.geoQ.coordinates) || !Utils.isEmpty(this.subscription.geoQ.georel) || !Utils.isEmpty(this.subscription.geoQ.geoproperty)) {
                var geometry = (!Utils.isEmpty(this.subscription.geoQ.geometry) ? this.subscription.geoQ.geometry : null);
                var coordinates = (!Utils.isEmpty(this.subscription.geoQ.coordinates) ? JSON.parse(this.subscription.geoQ.coordinates) : null);
                var georel = (!Utils.isEmpty(this.subscription.geoQ.georel) ? this.subscription.geoQ.georel : null);
                var geoproperty = this.subscription.geoQ.geoproperty;
                subscription.setGeoQuery(geometry, coordinates, georel, geoproperty);
            }
            subscription.setIsActive(this.subscription.isActive);
            if (!Utils.isEmpty(this.subscription.notification.attributes)) {
                this.subscription.notification.attributes.forEach(attribute => {
                    subscription.addNotificationAttribute(attribute);
                });
            }
            if (!Utils.isEmpty(this.subscription.notification.format)) {
                subscription.setNotificationFormat(this.subscription.notification.format);
            }
            var uri = this.subscription.notification.endpoint.uri;
            var accept = (!Utils.isEmpty(this.subscription.notification.endpoint.accept) ? this.subscription.notification.endpoint.accept : null);
            subscription.setNotificationEndpoint(uri, accept);
            if (!Utils.isEmpty(this.subscription.expiresAt)) {
                subscription.setExpiresAt(this.subscription.expiresAt);
            }
            if (!Utils.isEmpty(this.subscription.throttling)) {
                subscription.setThrottling(Utils.toInteger(this.subscription.throttling));
            }
            if (!Utils.isEmpty(this.subscription.lang)) {
                subscription.setLang(this.subscription.lang);
            }

            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                subscription = await this.$store.dispatch("subscriptions/storeSubscription", { workspaceId: this.workspace.id, subscription: subscription });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.subscription_creation_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "subscriptions.show", params: { workspaceId: this.workspace.id, subscriptionId: subscription.getId() }, query: { activeTab: "subscriptions" } });
        },
        addEntity() {
            this.subscription.entities.push(this.entity);
            this.entity = {};
        },
        removeEntity(index) {
            this.subscription.entities.splice(index, 1);
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <form @submit.prevent="storeSubscription">
        <div class="mb-3">
            <label for="name" class="form-label">{{ Utils.capitalize($t("main.name")) }}</label>
            <input id="name" v-model="subscription.subscriptionName" v-focus type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">{{ Utils.capitalize($t("main.description")) }}</label>
            <textarea id="description" v-model="subscription.description" class="form-control" rows="3" />
        </div>
        <fieldset class="p-3 mb-3">
            <legend>{{ Utils.capitalize($t("main.entities")) }}</legend>
            <table class="table table-sm align-middle">
                <thead>
                    <tr>
                        <th>{{ Utils.capitalize($t("main.id")) }}</th>
                        <th>{{ Utils.capitalize($t("main.id_pattern")) }}</th>
                        <th>{{ Utils.capitalize($t("main.type")) }}</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(entity, index) in subscription.entities" :key="index">
                        <td>{{ entity.id }}</td>
                        <td>{{ entity.idPattern }}</td>
                        <td>{{ entity.type }}</td>
                        <td><button type="button" class="btn btn-danger btn-sm w-100" @click="removeEntity(index)">{{ Utils.capitalize($t("main.remove")) }}</button></td>
                    </tr>
                    <tr>
                        <td><input v-model="entity.id" type="text" class="form-control form-control-sm w-100"></td>
                        <td><input v-model="entity.idPattern" type="text" class="form-control form-control-sm w-100"></td>
                        <td>
                            <select v-model="entity.type" class="form-select form-select-sm w-100">
                                <option :value="null" />
                                <option v-for="_type in types" :key="_type.id" :value="_type.name">{{ _type.name }}</option>
                            </select>
                        </td>
                        <td><button type="button" class="btn btn-primary btn-sm w-100" :disabled="!entity.id && !entity.idPattern && !entity.type" @click="addEntity">{{ Utils.capitalize($t("main.add")) }}</button></td>
                    </tr>
                </tbody>
            </table>
            <div class="alert alert-warning mb-0">{{ $t("dialogs.subscription_entity_type_should_be_set") }}</div>
        </fieldset>
        <div class="mb-3">
            <label for="watched-attributes" class="form-label">{{ Utils.capitalize($t("main.watched_attributes")) }}</label>
            <select id="watched-attributes" v-model="subscription.watchedAttributes" class="form-select w-100" multiple>
                <option v-for="property in properties" :key="property.id" :value="property.name">{{ property.name }}</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="query" class="form-label">{{ Utils.capitalize($t("main.query")) }}</label>
            <input id="query" v-model="subscription.q" type="text" class="form-control">
        </div>
        <fieldset class="p-3 mb-3">
            <legend>{{ Utils.capitalize($t("main.geo_query")) }}</legend>
            <div class="mb-3">
                <label for="geo-query-geometry" class="form-label">{{ Utils.capitalize($t("main.geometry")) }}</label>
                <select id="geo-query-geometry" v-model="subscription.geoQ.geometry" class="form-select">
                    <option :value="null" />
                    <option value="Point">Point</option>
                    <option value="MultiPoint">MultiPoint</option>
                    <option value="LineString">LineString</option>
                    <option value="MultiLineString">MultiLineString</option>
                    <option value="Polygon">Polygon</option>
                    <option value="MultiPolygon">MultiPolygon</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="geo-query-coordinates" class="form-label">{{ Utils.capitalize($t("main.coordinates")) }}</label>
                <textarea id="geo-query-coordinates" v-model="subscription.geoQ.coordinates" class="form-control" rows="3" />
            </div>
            <div class="mb-3">
                <label for="geo-query-georel" class="form-label">{{ Utils.capitalize($t("main.geo_relationship")) }}</label>
                <input id="geo-query-georel" v-model="subscription.geoQ.georel" type="text" class="form-control">
            </div>
            <div>
                <label for="geo-query-geoproperty" class="form-label">{{ Utils.capitalize($t("main.geo_property")) }}</label>
                <input id="geo-query-geoproperty" v-model="subscription.geoQ.geoproperty" type="text" class="form-control">
            </div>
        </fieldset>
        <div class="mb-3 form-check">
            <input id="is-active" v-model="subscription.isActive" type="checkbox" class="form-check-input">
            <label for="is-active" class="form-check-label">{{ Utils.capitalize($t("main.enable")) }}</label>
        </div>
        <fieldset class="p-3 mb-3">
            <legend>{{ Utils.capitalize($t("main.notification")) }}</legend>
            <div class="mb-3">
                <label for="notification-attributes" class="form-label">{{ Utils.capitalize($t("main.attributes")) }}</label>
                <select id="notification-attributes" v-model="subscription.notification.attributes" class="form-select w-100" multiple>
                    <option v-for="property in properties" :key="property.id" :value="property.name">{{ property.name }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="notification-format" class="form-label">{{ Utils.capitalize($t("main.format")) }}</label>
                <select id="notification-format" v-model="subscription.notification.format" class="form-select">
                    <option :value="null" />
                    <option value="normalized">{{ Utils.capitalize($t("main.normalized")) }}</option>
                    <option value="keyValues">{{ Utils.capitalize($t("main.key_values")) }}</option>
                </select>
            </div>
            <fieldset class="p-3">
                <legend>{{ Utils.capitalize($t("main.endpoint")) }}</legend>
                <div class="mb-3">
                    <label for="notification-endpoint-uri" class="form-label">{{ Utils.capitalize($t("main.uri")) }}</label>
                    <input id="notification-endpoint-uri" v-model="subscription.notification.endpoint.uri" type="text" class="form-control" required>
                </div>
                <div>
                    <label for="notification-endpoint-accept" class="form-label">{{ Utils.capitalize($t("main.accept")) }}</label>
                    <select id="notification-endpoint-accept" v-model="subscription.notification.endpoint.accept" class="form-select">
                        <option :value="null" />
                        <option value="application/json">JSON</option>
                        <option value="application/ld+json">JSON-LD</option>
                        <option value="application/geo+json">GeoJSON</option>
                    </select>
                </div>
            </fieldset>
        </fieldset>
        <div class="mb-3">
            <label for="expires-at" class="form-label">{{ Utils.capitalize($t("main.expires_at")) }}</label>
            <input id="expires-at" v-model="subscription.expiresAt" type="text" class="form-control">
        </div>
        <div class="mb-3">
            <label for="throttling" class="form-label">{{ Utils.capitalize($t("main.throttling")) }}</label>
            <input id="throttling" v-model="subscription.throttling" type="number" min="1" step="1" class="form-control">
        </div>
        <div class="mb-3">
            <label for="lang" class="form-label">{{ Utils.capitalize($t("main.language")) }}</label>
            <input id="lang" v-model="subscription.lang" type="text" class="form-control">
        </div>
        <button class="btn btn-primary">{{ Utils.capitalize($t("main.create")) }}</button>
    </form>
</template>

<style scoped>
table {
    table-layout: fixed;
    word-wrap: break-word;
}

table th,
table td {
    overflow: hidden;
}
</style>
