"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTextDescription = void 0;
const defaultSendTextPayload = JSON.stringify({
    Phone: '5491155553935',
    Body: 'How you doin',
    LinkPreview: true,
    Id: 'ABCDABCD1234',
    ContextInfo: {
        StanzaId: '3EB06F9067F80BAB89FF',
        Participant: '5491155553935@s.whatsapp.net',
        IsForwarded: true,
        MentionedJID: [
            '5491155553935@s.whatsapp.net',
            '5491155553936@s.whatsapp.net',
        ],
    },
    QuotedText: 'Original message text',
}, null, 2);
exports.sendTextDescription = [
    {
        displayName: 'Payload (JSON)',
        name: 'bodyJson',
        type: 'string',
        typeOptions: {
            rows: 12,
        },
        default: defaultSendTextPayload,
        displayOptions: {
            show: {
                resource: ['message'],
                operation: ['sendText'],
            },
        },
        description: 'JSON enviado para o endpoint /chat/send/text',
    },
];
//# sourceMappingURL=sendText.js.map