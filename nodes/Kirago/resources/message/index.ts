import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendImageDescription } from './sendImage';

const showOnlyForMessages = {
    resource: ['message'],
};

export const messageDescription: INodeProperties[] = [
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
    ...sendTextDescription,
    ...sendImageDescription,
];
