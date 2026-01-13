"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDescription = void 0;
const sendAudio_1 = require("./sendAudio");
const sendButtons_1 = require("./sendButtons");
const sendDocument_1 = require("./sendDocument");
const sendImage_1 = require("./sendImage");
const sendText_1 = require("./sendText");
const sendVideo_1 = require("./sendVideo");
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
                name: 'Send Audio',
                value: 'sendAudio',
                action: 'Send audio message',
                description: 'Enviar mensagem de áudio via Kirago',
            },
            {
                name: 'Send Buttons',
                value: 'sendButtons',
                action: 'Send buttons message',
                description: 'Enviar botões via Kirago',
            },
            {
                name: 'Send Document',
                value: 'sendDocument',
                action: 'Send document message',
                description: 'Enviar documento via Kirago',
            },
            {
                name: 'Send Image',
                value: 'sendImage',
                action: 'Send image message',
                description: 'Enviar imagem via Kirago',
            },
            {
                name: 'Send Text',
                value: 'sendText',
                action: 'Send text message',
                description: 'Enviar mensagem de texto via Kirago',
            },
            {
                name: 'Send Video',
                value: 'sendVideo',
                action: 'Send video message',
                description: 'Enviar mensagem de vídeo via Kirago',
            },
        ],
        default: 'sendText',
    },
    ...sendText_1.sendTextDescription,
    ...sendImage_1.sendImageDescription,
    ...sendAudio_1.sendAudioDescription,
    ...sendButtons_1.sendButtonsDescription,
    ...sendDocument_1.sendDocumentDescription,
    ...sendVideo_1.sendVideoDescription,
];
//# sourceMappingURL=index.js.map