"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDescription = void 0;
const sendText_1 = require("./sendText");
const sendImage_1 = require("./sendImage");
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
            },
            {
                name: 'Send Image',
                value: 'sendImage',
                action: 'Send image message',
                description: 'Enviar imagem via Kirago',
            },
        ],
        default: 'sendText',
    },
    ...sendText_1.sendTextDescription,
    ...sendImage_1.sendImageDescription,
];
//# sourceMappingURL=index.js.map