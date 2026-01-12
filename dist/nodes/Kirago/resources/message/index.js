"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDescription = void 0;
const sendText_1 = require("./sendText");
const showOnlyForMessages = {
    resource: ['message'],
};
exports.messageDescription = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: showOnlyForMessages,
        },
        options: [
            {
                name: 'Send Text',
                value: 'sendText',
                action: 'Send text message',
                description: 'Enviar mensagem de texto via Kirago',
                routing: {
                    request: {
                        method: 'POST',
                        url: '/chat/send/text',
                        body: '={{ (() => { const context = {}; if ($parameter.stanzaId) context.StanzaId = $parameter.stanzaId; if ($parameter.participant) context.Participant = $parameter.participant; if ($parameter.isForwarded) context.IsForwarded = true; const mentioned = ($parameter.mentionedJid || "").split(/[\n,]+/).map(s => s.trim()).filter(Boolean); if (mentioned.length) context.MentionedJID = mentioned; const payload = { Phone: $parameter.phone, Body: $parameter.body, LinkPreview: $parameter.linkPreview }; if ($parameter.id) payload.Id = $parameter.id; if ($parameter.quotedText) payload.QuotedText = $parameter.quotedText; if (Object.keys(context).length) payload.ContextInfo = context; return payload; })() }}',
                    },
                },
            },
        ],
        default: 'sendText',
    },
    ...sendText_1.sendTextDescription,
];
//# sourceMappingURL=index.js.map