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
	{ name: 'CTA URL', value: 'cta_url' },
	{ name: 'CTA Copy', value: 'cta_copy' },
	{ name: 'CTA Call', value: 'cta_call' },
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
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Título opcional exibido acima do corpo da mensagem',
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
		required: true,
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
		displayName: 'Header Thumbnail URL',
		name: 'headerThumbnailUrl',
		type: 'string',
		default: '',
		description: 'Miniatura do vídeo (recomendado para evitar erro no iOS)',
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
		typeOptions: { multipleValues: true, maxValue: 3 },
		default: {},
		required: true,
		description: 'Lista de botões exibidos abaixo do corpo do texto (máximo 3)',
		displayOptions: { show: showOnlyForSendButtons },
		options: [
			{
				displayName: 'Button',
				name: 'button',
				values: [
					{
						displayName: 'Button ID',
						name: 'buttonId',
						type: 'string',
						required: true,
						default: '',
						description: 'Identificador que será enviado quando o botão for clicado',
						displayOptions: {
							show: {
								buttonType: ['quick_reply'],
							},
						},
					},
					{
						displayName: 'Button Type',
						name: 'buttonType',
						type: 'options',
						options: buttonTypeOptions,
						default: 'quick_reply',
					},
					{
						displayName: 'Copy Code',
						name: 'copyCode',
						type: 'string',
						required: true,
						typeOptions: { rows: 3 },
						default: '',
						description: 'Código para copiar (CTA Copy)',
						displayOptions: {
							show: {
								buttonType: ['cta_copy'],
							},
						},
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
					{
						displayName: 'Merchant URL',
						name: 'merchantUrl',
						type: 'string',
						default: '',
						description: 'URL do merchant (se vazio, usa o mesmo valor de URL)',
						displayOptions: {
							show: {
								buttonType: ['cta_url'],
							},
						},
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						required: true,
						default: '',
						description: 'Telefone para ligar (CTA Call)',
						displayOptions: {
							show: {
								buttonType: ['cta_call'],
							},
						},
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						required: true,
						default: '',
						description: 'URL do botão (CTA URL)',
						displayOptions: {
							show: {
								buttonType: ['cta_url'],
							},
						},
					},
				],
			},
		],
	},
];
