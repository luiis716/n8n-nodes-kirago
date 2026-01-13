import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendButtons = {
	resource: ['message'],
	operation: ['sendButtons'],
};

const headerTypeOptions = [
	{ name: 'None', value: 'none' },
	{ name: 'Text', value: 'text' },
	{ name: 'Image', value: 'image' },
	{ name: 'Video', value: 'video' },
];

const buttonTypeOptions = [
	{ name: 'Quick Reply', value: 'quick_reply' },
	{ name: 'URL', value: 'url' },
	{ name: 'Phone', value: 'phone' },
];

export const sendButtonsDescription: INodeProperties[] = [
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		description: 'Número WhatsApp em formato internacional, ex.: 5511999999999',
		displayOptions: { show: showOnlyForSendButtons },
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		required: true,
		typeOptions: { rows: 3 },
		default: '',
		description: 'Texto principal exibido acima dos botões',
		displayOptions: { show: showOnlyForSendButtons },
	},
	{
		displayName: 'Footer',
		name: 'footer',
		type: 'string',
		typeOptions: { rows: 2 },
		default: '',
		description: 'Texto menor que aparece abaixo dos botões',
		displayOptions: { show: showOnlyForSendButtons },
	},
	{
		displayName: 'Header Type',
		name: 'headerType',
		type: 'options',
		options: headerTypeOptions,
		default: 'none',
		description: 'Tipo de cabeçalho exibido antes do texto',
		displayOptions: { show: showOnlyForSendButtons },
	},
	{
		displayName: 'Header Text',
		name: 'headerText',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		description: 'Texto do cabeçalho (opcional)',
		displayOptions: {
			show: {
				...showOnlyForSendButtons,
				headerType: ['text'],
			},
		},
	},
	{
		displayName: 'Header Media URL',
		name: 'headerMediaUrl',
		type: 'string',
		default: '',
		description: 'URL do vídeo ou da imagem exibida no cabeçalho',
		displayOptions: {
			show: {
				...showOnlyForSendButtons,
				headerType: ['image', 'video'],
			},
		},
	},
	{
		displayName: 'Header Thumbnail URL',
		name: 'headerThumbnailUrl',
		type: 'string',
		default: '',
		description: 'Miniatura exibida para vídeos',
		displayOptions: {
			show: {
				...showOnlyForSendButtons,
				headerType: ['video'],
			},
		},
	},
	{
		displayName: 'Buttons',
		name: 'buttons',
		type: 'fixedCollection',
		placeholder: 'Add button',
		typeOptions: { multipleValues: true },
		default: {},
		required: true,
		description: 'Lista de botões exibidos abaixo do corpo do texto',
		displayOptions: { show: showOnlyForSendButtons },
		options: [
			{
				displayName: 'Button',
				name: 'button',
				values: [
					{
						displayName: 'Button Type',
						name: 'buttonType',
						type: 'options',
						options: buttonTypeOptions,
						default: 'quick_reply',
					},
					{
						displayName: 'Button ID',
						name: 'buttonId',
						type: 'string',
						required: true,
						default: '',
						description: 'Identificador que será enviado quando o botão for clicado',
					},
					{
						displayName: 'Display Text',
						name: 'displayText',
						type: 'string',
						required: true,
						typeOptions: { rows: 2 },
						default: '',
						description: 'Texto exibido no botão',
					},
				],
			},
		],
	},
		{
			displayName: 'Additional Options',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add option',
			default: {},
			displayOptions: { show: showOnlyForSendButtons },
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
			],
		},
];
