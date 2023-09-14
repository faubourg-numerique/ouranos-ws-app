<script>
import CSV from "comma-separated-values";
import FileSaver from "file-saver";

import ApiErrorAlert from "@/components/ApiErrorAlert";
import PropertiesTable from "@/components/PropertiesTable";
import SpinnerAnimation from "@/components/SpinnerAnimation";
import { Entity } from "@/classes/Entity";
import Utils from "@/classes/Utils";

export default {
    components: {
        ApiErrorAlert,
        PropertiesTable,
        SpinnerAnimation
    },
    data() {
        return {
            error: null,
            type: null,
            properties: null,
            entityId: null,
            entity: null,
            entityProperties: null,
            ascendingRelationships: null,
            descendingRelationships: null,
            entities: null,
            googleServiceAccount: null,
            importOptions: {
                format: "csv",
                data: null
            },
            exportOptions: {
                format: "csv"
            },
            csvOptions: {
                cast: false,
                header: true
            }
        };
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        this.googleServiceAccount = process.env.VUE_APP_GOOGLE_SERVICE_ACCOUNT;

        const workspaceId = this.$route.params.workspaceId;
        this.workspace = this.$store.getters["workspaces/getWorkspace"](workspaceId);

        this.init();
    },
    methods: {
        async destroyEntity() {
            const result = await this.$swal.fire({
                title: this.$t("dialogs.entity_deletion_question"),
                icon: "question",
                showDenyButton: true,
                confirmButtonText: this.Utils.capitalize(this.$t("main.yes")),
                denyButtonText: this.Utils.capitalize(this.$t("main.no")),
                heightAuto: false
            });
            if (!result.isConfirmed) {
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", true);
            try {
                await this.$store.dispatch("entities/destroyEntity", { workspaceId: this.workspace.id, entity: this.entity });
            } catch (error) {
                this.$store.dispatch("setDisplayLoadingScreen", false);
                this.error = error;
                this.$swal.fire({
                    title: this.$t("dialogs.entity_deletion_failure"),
                    icon: "error",
                    heightAuto: false
                });
                return;
            }
            this.$store.dispatch("setDisplayLoadingScreen", false);
            this.$router.push({ name: "workspace", params: { workspaceId: this.workspace.id }, query: { typeId: this.type.id } });
        },
        init() {
            this.error = null;
            this.type = null;
            this.entityId = null;
            this.entity = null;
            this.entities = null;
            this.ascendingRelationships = null;
            this.descendingRelationships = null;

            const typeId = this.$route.query.typeId;
            if (!typeId) return;

            this.type = this.$store.getters["types/getType"](this.workspace.id, typeId);
            this.properties = this.$store.getters["properties/getProperties"](this.workspace.id, this.type.id);

            this.loadEntities();
        },
        async loadEntities() {
            this.entityId = this.$route.query.entityId;

            if (!this.entityId) {
                const query = {
                    type: this.type.name
                };
                try {
                    this.entities = await this.$store.dispatch("entities/indexEntities", { workspaceId: this.workspace.id, query });
                } catch (error) {
                    this.error = error;
                    return;
                }
                return;
            }

            this.entityProperties = [];

            try {
                this.entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspace.id, entityId: this.entityId });
            } catch (error) {
                this.error = error;
                return;
            }

            for (const property of Object.values(this.properties)) {
                if (property.hasProperty) continue;
                if (!this.entity.attributeExists(property.name)) continue;
                this.entityProperties.push(property);
            }

            const ascendingRelationships = {};
            for (const property of Object.values(this.properties)) {
                if (property.ngsiLdType !== "Relationship") continue;
                const propertyName = this.$store.getters["properties/getPropertyName"](this.workspace.id, this.type.id, property.id);
                if (!this.entity.attributeExists(propertyName)) continue;
                const type = this.$store.getters["types/getType"](this.workspace.id, property.relationshipType);
                if (property.multiValued) {
                    const multiValuedAttribute = this.entity.getMultiValuedAttribute(propertyName);
                    if (!multiValuedAttribute) continue;
                    for (const attribute of multiValuedAttribute) {
                        if (!attribute.object) continue;
                        let entity;
                        try {
                            entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspace.id, entityId: attribute.object });
                        } catch (error) {
                            this.error = error;
                            return;
                        }
                        if (!entity) continue;
                        if (!(type.id in ascendingRelationships)) {
                            ascendingRelationships[type.id] = [];
                        }
                        ascendingRelationships[type.id].push(entity);
                    }
                } else {
                    const relationship = this.entity.getRelationship(propertyName);
                    let entity;
                    try {
                        entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspace.id, entityId: relationship });
                    } catch (error) {
                        this.error = error;
                        return;
                    }
                    if (!entity) continue;
                    if (!(type.id in ascendingRelationships)) {
                        ascendingRelationships[type.id] = [];
                    }
                    ascendingRelationships[type.id].push(entity);
                }
            }
            this.ascendingRelationships = Object.keys(ascendingRelationships).length ? ascendingRelationships : null;

            const types = this.$store.getters["types/getTypes"](this.workspace.id);
            const descendingRelationships = {};
            for (const type of Object.values(types)) {
                const properties = this.$store.getters["properties/getProperties"](this.workspace.id, type.id);
                for (const property of Object.values(properties)) {
                    if (property.hasProperty) continue;
                    if (property.ngsiLdType !== "Relationship") continue;
                    if (property.relationshipType !== this.type.id) continue;
                    const query = {
                        type: type.name,
                        q: `${property.name}=="${this.entity.getId()}"`
                    };
                    let entities;
                    try {
                        entities = await this.$store.dispatch("entities/indexEntities", { workspaceId: this.workspace.id, query });
                    } catch (error) {
                        this.error = error;
                        return;
                    }

                    if (Object.keys(entities).length) {
                        if (!(type.id in descendingRelationships)) {
                            descendingRelationships[type.id] = [];
                        }
                        descendingRelationships[type.id].push(...Object.values(entities));
                    }
                }
            }
            this.descendingRelationships = Object.keys(descendingRelationships).length ? descendingRelationships : null;
        },
        getType(typeId) {
            return this.$store.getters["types/getType"](this.workspace.id, typeId);
        },
        async importEntities() {
            let success;
            this.$store.dispatch("setDisplayLoadingScreen", true);
            switch (this.importOptions.format) {
                case "csv": {
                    const csv = new CSV(this.importOptions.data, this.csvOptions);
                    const data = csv.parse();
                    success = true;

                    for (const row of data) {
                        let entity;
                        let update = false;

                        if (!row.id && row.type) {
                            row.id = Utils.generateUniqueNgsiLdUrn(row.type);
                        }

                        if (!row.id || !row.type || row.type !== this.type.name) {
                            success = false;
                            continue;
                        }

                        try {
                            entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspace.id, entityId: row.id });
                            update = true;
                        } catch (error) {
                            entity = new Entity();
                            entity.setId(row.id);
                            entity.setType(row.type);
                        }

                        Object.values(this.properties).forEach(property => {
                            if (property.hasProperty || property.multiValued) {
                                return;
                            }
                            switch (property.ngsiLdType) {
                                case "Property": {
                                    if (!row[property.name]) break;
                                    var value = row[property.name];
                                    switch (property.propertyNgsiLdValueType) {
                                        case "String": {
                                            value = String(value);
                                            break;
                                        }
                                        case "Number": {
                                            if (this.Utils.isString(value)) {
                                                value = value.replace(",", ".");
                                            }
                                            value = Number(value);
                                            break;
                                        }
                                        case "Boolean": {
                                            value = Boolean(value);
                                            break;
                                        }
                                        case "Object":
                                        case "Array": {
                                            try {
                                                value = JSON.parse(value);
                                            } catch (error) { }
                                            break;
                                        }
                                    }
                                    entity.setProperty(property.name, value);
                                    break;
                                }
                                case "GeoProperty": {
                                    if (!row[property.name]) break;
                                    const geoProperty = JSON.parse(row[property.name]);
                                    entity.setGeoProperty(property.name, geoProperty.type, geoProperty.coordinates);
                                    break;
                                }
                                case "Relationship": {
                                    if (row[property.name]) entity.setRelationship(property.name, row[property.name]);
                                    break;
                                }
                            }
                        });

                        try {
                            await this.$store.dispatch(update ? "entities/updateEntity" : "entities/storeEntity", { workspaceId: this.workspace.id, entity });
                        } catch (error) {
                            success = false;
                        }
                    }

                    await this.loadEntities();

                    this.$store.dispatch("setDisplayLoadingScreen", false);

                    if (success) {
                        this.$swal.fire({
                            title: this.$t("dialogs.entities_import_success"),
                            icon: "success",
                            heightAuto: false
                        });
                    } else {
                        this.$swal.fire({
                            title: this.$t("dialogs.entities_import_failure"),
                            icon: "error",
                            heightAuto: false
                        });
                    }
                    break;
                }
                case "google-sheets": {
                    let rows;
                    this.$store.dispatch("setDisplayLoadingScreen", true);
                    try {
                        rows = await this.$store.dispatch("googleSheetsProxy/readSheet", { spreadsheetId: this.importOptions.googleSheetsSpreadsheetId, sheetName: this.importOptions.googleSheetsSheetName, });
                    } catch (error) {
                        this.$store.dispatch("setDisplayLoadingScreen", false);
                        this.$swal.fire({
                            title: this.$t("dialogs.entities_import_failure"),
                            icon: "error",
                            heightAuto: false
                        });
                        return;
                    }

                    success = true;

                    const columns = rows[0];
                    rows.shift();

                    const data = [];
                    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                        const row = [];
                        for (var columnIndex = 0; columnIndex < rows[rowIndex].length; columnIndex++) {
                            row[columns[columnIndex]] = rows[rowIndex][columnIndex];
                        }
                        data.push(row);
                    }

                    for (const row of data) {
                        let entity;
                        let update = false;

                        if (!row.id && row.type) {
                            row.id = Utils.generateUniqueNgsiLdUrn(row.type);
                        }

                        if (!row.id || !row.type || row.type !== this.type.name) {
                            success = false;
                            continue;
                        }

                        try {
                            entity = await this.$store.dispatch("entities/showEntity", { workspaceId: this.workspace.id, entityId: row.id });
                            update = true;
                        } catch (error) {
                            entity = new Entity();
                            entity.setId(row.id);
                            entity.setType(row.type);
                        }

                        Object.values(this.properties).forEach(property => {
                            if (property.hasProperty || property.multiValued) {
                                return;
                            }
                            switch (property.ngsiLdType) {
                                case "Property": {
                                    if (!row[property.name]) break;
                                    var value = row[property.name];
                                    switch (property.propertyNgsiLdValueType) {
                                        case "String": {
                                            value = String(value);
                                            break;
                                        }
                                        case "Number": {
                                            if (this.Utils.isString(value)) {
                                                value = value.replace(",", ".");
                                            }
                                            value = Number(value);
                                            break;
                                        }
                                        case "Boolean": {
                                            value = Boolean(value);
                                            break;
                                        }
                                        case "Object":
                                        case "Array": {
                                            try {
                                                value = JSON.parse(value);
                                            } catch (error) { }
                                            break;
                                        }
                                    }
                                    entity.setProperty(property.name, value);
                                    break;
                                }
                                case "GeoProperty": {
                                    if (!row[property.name]) break;
                                    const geoProperty = JSON.parse(row[property.name]);
                                    entity.setGeoProperty(property.name, geoProperty.type, geoProperty.coordinates);
                                    break;
                                }
                                case "Relationship": {
                                    if (row[property.name]) entity.setRelationship(property.name, row[property.name]);
                                    break;
                                }
                            }
                        });

                        try {
                            await this.$store.dispatch(update ? "entities/updateEntity" : "entities/storeEntity", { workspaceId: this.workspace.id, entity });
                        } catch (error) {
                            success = false;
                        }
                    }

                    await this.loadEntities();

                    this.$store.dispatch("setDisplayLoadingScreen", false);

                    if (success) {
                        this.$swal.fire({
                            title: this.$t("dialogs.entities_import_success"),
                            icon: "success",
                            heightAuto: false
                        });
                    } else {
                        this.$swal.fire({
                            title: this.$t("dialogs.entities_import_failure"),
                            icon: "error",
                            heightAuto: false
                        });
                    }
                    break;
                }
            }
        },
        async exportEntities() {
            switch (this.exportOptions.format) {
                case "csv": {
                    const rows = [];

                    Object.values(this.entities).forEach(entity => {
                        const row = {
                            id: entity.getId(),
                            type: entity.getType()
                        };

                        Object.values(this.properties).forEach(property => {
                            if (property.hasProperty || property.multiValued) {
                                return;
                            }
                            switch (property.ngsiLdType) {
                                case "Property": {
                                    row[property.name] = entity.propertyExists(property.name) ? entity.getProperty(property.name) : "";
                                    break;
                                }
                                case "GeoProperty": {
                                    row[property.name] = entity.geoPropertyExists(property.name) ? JSON.stringify(entity.getAttribute(property.name).value) : "";
                                    break;
                                }
                                case "Relationship": {
                                    row[property.name] = entity.relationshipExists(property.name) ? entity.getRelationship(property.name) : "";
                                    break;
                                }
                            }
                        });

                        rows.push(row);
                    });

                    const csv = new CSV(rows, this.csvOptions);
                    const blob = new Blob([csv.encode()], { type: "text/csv;charset=utf-8" });
                    FileSaver.saveAs(blob, this.type.name + ".csv");

                    this.$swal.fire({
                        title: this.$t("dialogs.entities_export_success"),
                        icon: "success",
                        heightAuto: false
                    });
                    break;
                }
                case "google-sheets": {
                    const rows = [];

                    const columns = ["id", "type"];
                    Object.values(this.properties).forEach(property => {
                        if (property.hasProperty || property.multiValued) {
                            return;
                        }
                        columns.push(property.name);
                    });
                    rows.push(columns);

                    Object.values(this.entities).forEach(entity => {
                        const row = [
                            entity.getId(),
                            entity.getType()
                        ];

                        Object.values(this.properties).forEach(property => {
                            if (property.hasProperty || property.multiValued) {
                                return;
                            }
                            switch (property.ngsiLdType) {
                                case "Property": {
                                    row.push(entity.propertyExists(property.name) ? entity.getProperty(property.name) : "");
                                    break;
                                }
                                case "GeoProperty": {
                                    row.push(entity.geoPropertyExists(property.name) ? JSON.stringify(entity.getAttribute(property.name).value) : "");
                                    break;
                                }
                                case "Relationship": {
                                    row.push(row[property.name] = entity.relationshipExists(property.name) ? entity.getRelationship(property.name) : "");
                                    break;
                                }
                            }
                        });

                        rows.push(row);
                    });

                    this.$store.dispatch("setDisplayLoadingScreen", true);
                    try {
                        await this.$store.dispatch("googleSheetsProxy/writeSheet", { spreadsheetId: this.exportOptions.googleSheetsSpreadsheetId, sheetName: this.exportOptions.googleSheetsSheetName, data: rows });
                    } catch (error) {
                        this.$store.dispatch("setDisplayLoadingScreen", false);
                        this.$swal.fire({
                            title: this.$t("dialogs.entities_export_failure"),
                            icon: "error",
                            heightAuto: false
                        });
                        return;
                    }
                    this.$store.dispatch("setDisplayLoadingScreen", false);

                    this.$swal.fire({
                        title: this.$t("dialogs.entities_export_success"),
                        icon: "success",
                        heightAuto: false
                    });
                    break;
                }
            }
        },
        handleImportFileChange(event) {
            if (!event.target.files || !event.target.files[0]) {
                return;
            }

            const file = event.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (event) => {
                this.importOptions.data = event.target.result;
            }
        }
    }
};
</script>

<template>
    <ApiErrorAlert v-if="error" :error="error" />
    <div v-else-if="!type" class="alert alert-info mb-0">
        <h5 class="alert-heading">{{ $t("dialogs.no_type_selected_title") }}</h5>
        <p class="mb-0">{{ $t("dialogs.no_type_selected_message") }}</p>
    </div>
    <template v-else-if="entityId">
        <div class="card">
            <div v-if="entity" class="card-header d-flex justify-content-between align-items-center">
                <span>{{ entity.propertyExists('name') ? entity.getProperty('name') : entity.getId() }} ({{ type.name }})</span>
                <span>
                    <RouterLink v-if="$authorization.canUpdateEntity(workspace.id, entity.getId())" :to="{ name: 'entities.properties.create', params: { workspaceId: workspace.id, entityId, typeId: type.id } }" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-plus" />
                    </RouterLink>
                    <RouterLink v-if="$authorization.canStoreEntity(workspace.id)" :to="{ name: 'entities.create', params: { workspaceId: workspace.id }, query: { ascendingEntityId: entityId, ascendingTypeId: type.id } }" class="btn btn-primary btn-sm ms-3">
                        <i class="fa-solid fa-link" />
                    </RouterLink>
                    <button v-if="$authorization.canDestroyEntity(workspace.id, entity.getId())" class="btn btn-danger btn-sm ms-3" @click="destroyEntity">
                        <i class="fa-solid fa-trash-can" />
                    </button>
                </span>
            </div>
            <div class="card-body">
                <SpinnerAnimation v-if="!entity" />
                <div v-else-if="!entityProperties.length" class="alert alert-info mb-0">{{ $t("dialogs.entity_without_properties") }}</div>
                <PropertiesTable v-else :workspace-id="workspace.id" :type-id="type.id" :entity="entity" :properties="entityProperties" />
            </div>
        </div>
        <div v-if="ascendingRelationships" class="card mt-4">
            <div class="card-header">{{ Utils.capitalize($t("main.ascending_relationships")) }}</div>
            <div class="card-body">
                <ul class="nav nav-pills mb-3">
                    <li v-for="(typeId, index) in Object.keys(ascendingRelationships)" :key="typeId" class="nav-item">
                        <button class="nav-link" data-bs-toggle="pill" :data-bs-target="`#ascending-relationship-${Utils.md5(typeId)}`" :class="{ 'active': index === 0 }">{{ getType(typeId).name }}</button>
                    </li>
                </ul>
                <div class="tab-content">
                    <div v-for="(entities, typeId, index) in ascendingRelationships" :id="`ascending-relationship-${Utils.md5(typeId)}`" :key="typeId" class="tab-pane" tabindex="0" :class="{ 'active': index === 0 }">
                        <table class="table mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>{{ Utils.capitalize($t("main.name")) }}</th>
                                    <th>{{ Utils.capitalize($t("main.id")) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(entity, key) in entities" :key="key">
                                    <td>{{ entity.propertyExists("name") ? entity.getProperty("name") : null }}</td>
                                    <td>
                                        <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspace.id }, query: { typeId: typeId, entityId: entity.getId() } }">{{ entity.getId() }}</RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="descendingRelationships" class="card mt-4">
            <div class="card-header">{{ Utils.capitalize($t("main.descending_relationships")) }}</div>
            <div class="card-body">
                <ul class="nav nav-pills mb-3">
                    <li v-for="(typeId, index) in Object.keys(descendingRelationships)" :key="typeId" class="nav-item">
                        <button class="nav-link" data-bs-toggle="pill" :data-bs-target="`#descending-relationship-${Utils.md5(typeId)}`" :class="{ 'active': index === 0 }">{{ getType(typeId).name }}</button>
                    </li>
                </ul>
                <div class="tab-content">
                    <div v-for="(entities, typeId, index) in descendingRelationships" :id="`descending-relationship-${Utils.md5(typeId)}`" :key="typeId" class="tab-pane" tabindex="0" :class="{ 'active': index === 0 }">
                        <table class="table mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>{{ Utils.capitalize($t("main.name")) }}</th>
                                    <th>{{ Utils.capitalize($t("main.id")) }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(entity, key) in entities" :key="key">
                                    <td>{{ entity.propertyExists("name") ? entity.getProperty("name") : null }}</td>
                                    <td>
                                        <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspace.id }, query: { typeId: typeId, entityId: entity.getId() } }">{{ entity.getId() }}</RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <div v-else class="card">
        <div id="import-export-modal" class="modal fade" tabindex="-1" data-bs-keyboard="false" data-bs-backdrop="static">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">{{ Utils.capitalize($t("main.import_and_export_entities")) }}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" />
                    </div>
                    <div class="modal-body">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <button class="nav-link" :class="{ 'disabled': !$authorization.canStoreEntity(workspace.id) }" data-bs-toggle="tab" data-bs-target="#import-tab">{{ Utils.capitalize($t("main.import")) }}</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#export-tab">{{ Utils.capitalize($t("main.export")) }}</button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div id="import-tab" class="tab-pane pt-3">
                                <form @submit.prevent="importEntities">
                                    <div class="mb-3">
                                        <label for="import-format" class="form-label">{{ Utils.capitalize($t("main.format")) }}</label>
                                        <select id="import-format" v-model="importOptions.format" class="form-select" required>
                                            <option value="csv">CSV</option>
                                            <option value="google-sheets">Google Sheets</option>
                                        </select>
                                    </div>
                                    <template v-if="importOptions.format === 'csv'">
                                        <div class="mb-3">
                                            <label for="import-csv-file" class="form-label">{{ Utils.capitalize($t("main.file")) }}</label>
                                            <input id="import-csv-file" class="form-control" type="file" accept="text/csv" required @change="handleImportFileChange($event)">
                                        </div>
                                    </template>
                                    <template v-else-if="importOptions.format === 'google-sheets'">
                                        <div class="mb-3">
                                            <div class="form-text">{{ Utils.capitalize($t("dialogs.please_share_spreadsheet")) }}<br><b>{{ googleServiceAccount }}</b></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="export-google-sheets-spreadsheet-id" class="form-label">{{ Utils.capitalize($t("main.spreadsheet_id")) }}</label>
                                            <input id="export-google-sheets-spreadsheet-id" v-model="importOptions.googleSheetsSpreadsheetId" type="text" class="form-control" required>
                                            <div class="form-text">https://docs.google.com/spreadsheets/d/<b>&lt;spreadsheet-id&gt;</b>/edit?usp=sharing</div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="export-google-sheets-sheet-name" class="form-label">{{ Utils.capitalize($t("main.sheet_name")) }}</label>
                                            <input id="export-google-sheets-sheet-name" v-model="importOptions.googleSheetsSheetName" type="text" class="form-control" required>
                                        </div>
                                    </template>
                                    <button type="submit" class="btn btn-primary">{{ Utils.capitalize($t("main.import")) }}</button>
                                </form>
                            </div>
                            <div id="export-tab" class="tab-pane show active pt-3">
                                <form @submit.prevent="exportEntities">
                                    <div class="mb-3">
                                        <label for="export-format" class="form-label">{{ Utils.capitalize($t("main.format")) }}</label>
                                        <select id="export-format" v-model="exportOptions.format" class="form-select">
                                            <option value="csv">CSV</option>
                                            <option value="google-sheets">Google Sheets</option>
                                        </select>
                                    </div>
                                    <template v-if="exportOptions.format === 'google-sheets'">
                                        <div class="mb-3">
                                            <div class="form-text">{{ Utils.capitalize($t("dialogs.please_share_spreadsheet")) }}<br><b>{{ googleServiceAccount }}</b></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="export-google-sheets-spreadsheet-id" class="form-label">{{ Utils.capitalize($t("main.spreadsheet_id")) }}</label>
                                            <input id="export-google-sheets-spreadsheet-id" v-model="exportOptions.googleSheetsSpreadsheetId" type="text" class="form-control" required>
                                            <div class="form-text">https://docs.google.com/spreadsheets/d/<b>&lt;spreadsheet-id&gt;</b>/edit?usp=sharing</div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="export-google-sheets-sheet-name" class="form-label">{{ Utils.capitalize($t("main.sheet_name")) }}</label>
                                            <input id="export-google-sheets-sheet-name" v-model="exportOptions.googleSheetsSheetName" type="text" class="form-control" required>
                                        </div>
                                    </template>
                                    <button type="submit" class="btn btn-primary">{{ Utils.capitalize($t("main.export")) }}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ Utils.capitalize($t("main.close")) }}</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-header d-flex justify-content-between align-items-center">
            <span>{{ type.name }}</span>
            <span>
                <RouterLink v-if="entities" :to="{ name: 'workspace', params: { workspaceId: workspace.id }, query: { typeId: type.id, activeTab: 'map' } }" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-map-location-dot" />
                </RouterLink>
                <button v-if="entities && $authorization.canStoreEntity(workspace.id)" class="btn btn-primary btn-sm ms-3" data-bs-toggle="modal" data-bs-target="#import-export-modal">
                    <i class="fa-solid fa-file-arrow-down" />
                </button>
                <RouterLink v-if="$authorization.canStoreEntity(workspace.id)" :to="{ name: 'entities.create', params: { workspaceId: workspace.id }, query: { typeId: type.id } }" class="btn btn-primary btn-sm ms-3">
                    <i class="fa-solid fa-plus" />
                </RouterLink>
            </span>
        </div>
        <div class="card-body">
            <SpinnerAnimation v-if="!entities" />
            <div v-else-if="!Object.keys(entities).length" class="alert alert-info mb-0">{{ $t("dialogs.no_entity") }}</div>
            <table v-else class="table font-monospace mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>{{ Utils.capitalize($t("main.name")) }}</th>
                        <th>{{ Utils.capitalize($t("main.id")) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="entity in entities" :key="entity.getId()">
                        <td><template v-if="entity.propertyExists('name')">{{ entity.getProperty('name') }}</template></td>
                        <td>
                            <RouterLink :to="{ name: 'workspace', params: { workspaceId: workspace.id }, query: { typeId: type.id, entityId: entity.getId() } }">{{ entity.getId() }}</RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
