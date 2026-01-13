import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendImageDescription } from './sendImage';
import { sendAudioDescription } from './sendAudio';

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
			{
				name: 'Send Audio',
				value: 'sendAudio',
				action: 'Send audio message',
				description: 'Enviar mensagem de áudio via Kirago',
			},
		],
		default: 'sendText',
	},
	...sendTextDescription,
	...sendImageDescription,
	...sendAudioDescription,
];
