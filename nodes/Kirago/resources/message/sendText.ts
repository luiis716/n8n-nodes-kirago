import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['message'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
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
		displayName: 'Additional Options',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: { show: showOnlyForSendText },
		options: [
			{
				displayName: 'Context Is Forwarded',
				name: 'isForwarded',
				type: 'boolean',
				default: false,
				description: 'Whether the message is forwarded',
			},
			{
				displayName: 'Context Mentioned JIDs',
				name: 'mentionedJid',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Liste os JIDs separados por vírgula ou quebra de linha',
			},
			{
				displayName: 'Context Participant',
				name: 'participant',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Context Stanza ID',
				name: 'stanzaId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'Identificador opcional para controle do cliente',
			},
			{
				displayName: 'Link Preview',
				name: 'linkPreview',
				type: 'boolean',
				default: true,
				description: 'Whether to render link preview',
			},
			{
				displayName: 'Quoted Text',
				name: 'quotedText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Texto original citado na mensagem',
			},
		],
	},
];
