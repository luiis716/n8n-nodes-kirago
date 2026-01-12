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
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'ID',
        name: 'id',
        type: 'string',
        default: '',
        description: 'Identificador opcional para controle do cliente',
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'Quoted Text',
        name: 'quotedText',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        displayOptions: { show: showOnlyForSendText },
        description: 'Texto original citado na mensagem',
    },
    {
        displayName: 'Context Stanza ID',
        name: 'stanzaId',
        type: 'string',
        default: '',
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'Context Participant',
        name: 'participant',
        type: 'string',
        default: '',
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'Context Is Forwarded',
        name: 'isForwarded',
        type: 'boolean',
        default: false,
        displayOptions: { show: showOnlyForSendText },
    },
    {
        displayName: 'Context Mentioned JIDs',
        name: 'mentionedJid',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Liste os JIDs separados por vírgula ou quebra de linha',
        displayOptions: { show: showOnlyForSendText },
    },
];
//# sourceMappingURL=sendText.js.map