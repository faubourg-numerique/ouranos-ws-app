export default {
    namespaced: true,
    actions: {
        async readSheet(context, { spreadsheetId, sheetName }) {
            let response;
            const config = {
                params: {
                    spreadsheetId,
                    sheetName
                }
            };
            try {
                response = await this.$api.get("/proxies/google-sheets/read-sheet", config);
            } catch (error) {
                throw error.response.data || {};
            }
            return response.data;
        },
        async writeSheet(context, { spreadsheetId, sheetName, data }) {
            const config = {
                params: {
                    spreadsheetId,
                    sheetName
                }
            };
            try {
                await this.$api.post("/proxies/google-sheets/write-sheet", data, config);
            } catch (error) {
                throw error.response.data || {};
            }
        }
    }
};
