import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';

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
	...sendTextDescription,
];
