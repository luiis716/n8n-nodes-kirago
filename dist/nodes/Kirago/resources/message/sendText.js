"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextDescription = void 0;
const showOnlyForSendText = {
    resource: ['message'],
    operation: ['sendText'],
};
exports.sendTextDescription = [
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        description: 'Número WhatsApp em formato internacional, ex.: 5511999999999',
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'string',
        required: true,
        typeOptions: { rows: 3 },
        default: 'How you doin',
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'Link Preview',
        name: 'linkPreview',
        type: 'boolean',
        default: true,
        description: 'Whether to render link preview',
        displayOptions: { show: showOnlyForSendText },
    },
];
//# sourceMappingURL=sendText.js.map