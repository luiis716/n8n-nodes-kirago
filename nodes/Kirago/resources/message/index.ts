import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendImageDescription } from './sendImage';
import { sendAudioDescription } from './sendAudio';
import { sendVideoDescription } from './sendVideo';
import { sendDocumentDescription } from './sendDocument';


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
						{
				name: 'Send video',
				value: 'sendVideo',
				action: 'Send video message',
				description: 'Enviar mensagem de vídeo via Kirago',
			},
			{
				name: 'Send Document',
				value: 'sendDocument',
				action: 'Send document message',
				description: 'Enviar documento via Kirago',
			},
		],
		default: 'sendText',
	},
	...sendTextDescription,
	...sendImageDescription,
	...sendAudioDescription,
	...sendDocumentDescription,
	...sendVideoDescription,
];
