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
                        body: '={{ JSON.parse($parameter.bodyJson) }}',
                    },
                },
            },
        ],
        default: 'sendText',
    },
    ...sendText_1.sendTextDescription,
];
//# sourceMappingURL=index.js.map