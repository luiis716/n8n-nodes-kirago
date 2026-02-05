import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendButtons = {
	resource: ['message'],
	operation: ['sendButtons'],
};

const headerTypeOptions = [
	{ name: 'None', value: 'none' },
	{ name: 'Image', value: 'image' },
	{ name: 'Video', value: 'video' },
];

const buttonTypeOptions = [
	{ name: 'Quick Reply', value: 'quick_reply' },
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
		displayName: 'Header Media URL',
		name: 'headerMediaUrl',
		type: 'string',
		default: '',
		description: 'URL do vídeo ou da imagem exibida no cabeçalho (obrigatório para Image/Video)',
		displayOptions: {
			show: {
				...showOnlyForSendButtons,
				headerType: ['image', 'video'],
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
];
