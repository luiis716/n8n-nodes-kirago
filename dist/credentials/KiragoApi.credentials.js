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
                    'x-api-key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: 'https://kirago.com.br/',
                url: '/v1/user',
            },
        };
    }
}
exports.KiragoApi = KiragoApi;
//# sourceMappingURL=KiragoApi.credentials.js.map