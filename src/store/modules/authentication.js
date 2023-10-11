export default {
    namespaced: true,
    state() {
        return {
            authenticated: false,
            accessToken: null,
            accessTokenType: null,
            expirationTime: null,
            siop2AccessTokens: {}
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.authenticated;
        },
        getAccessToken(state) {
            return state.accessToken;
        },
        getAccessTokenType(state) {
            return state.accessTokenType;
        },
        getExpirationTime(state) {
            return state.expirationTime;
        },
        getSIOP2AccessToken(state) {
            return (workspaceId) => {
                return state.siop2AccessTokens[workspaceId];
            };
        }
    },
    mutations: {
        setAuthenticated(state, authenticated) {
            state.authenticated = authenticated;
        },
        setAccessToken(state, accessToken) {
            state.accessToken = accessToken;
        },
        setAccessTokenType(state, accessTokenType) {
            state.accessTokenType = accessTokenType;
        },
        setExpirationTime(state, expirationTime) {
            state.expirationTime = expirationTime;
        },
        setSIOP2AccessToken(state, { workspaceId, accessToken }) {
            state.siop2AccessTokens[workspaceId] = accessToken;
        }
    },
    actions: {
        setAuthenticated({ commit }, authenticated) {
            commit("setAuthenticated", authenticated);
        },
        setAccessToken({ commit }, accessToken) {
            commit("setAccessToken", accessToken);
        },
        setAccessTokenType({ commit }, accessTokenType) {
            commit("setAccessTokenType", accessTokenType);
        },
        setExpirationTime({ commit }, expirationTime) {
            commit("setExpirationTime", expirationTime);
        },
        setSIOP2AccessToken({ commit }, { workspaceId, accessToken }) {
            commit("setSIOP2AccessToken", { workspaceId, accessToken });
        }
    }
};
