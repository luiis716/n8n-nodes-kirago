"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KiragoApi = void 0;
class KiragoApi {
    constructor() {
        this.name = 'kiragoApi';
        this.displayName = 'Kirago API';
        this.icon = 'file:../nodes/Kirago/kirago.svg';
        this.documentationUrl = 'https://github.com/org/-kirago?tab=readme-ov-file#credentials';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://kirago.com.br/',
                required: true,
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                required: true,
                default: '',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    token: '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/health',
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    token: '={{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.KiragoApi = KiragoApi;
//# sourceMappingURL=KiragoApi.credentials.js.map