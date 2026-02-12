import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendList = {
	resource: ['message'],
	operation: ['sendList'],
};

const listModeOptions = [
	{ name: 'Sections', value: 'sections' },
	{ name: 'Legacy List', value: 'legacy' },
];

export const sendListDescription: INodeProperties[] = [
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		description: 'Número WhatsApp em formato internacional ou JID de grupo, ex.: 5511999999999 ou 555...@g.us',
		displayOptions: { show: showOnlyForSendList },
	},
	{
		displayName: 'List Mode',
		name: 'listMode',
		type: 'options',
		options: listModeOptions,
		default: 'sections',
		description: 'Formato da lista (Sections ou Legacy List)',
		displayOptions: { show: showOnlyForSendList },
	},
	{
		displayName: 'Top Text',
		name: 'topText',
		type: 'string',
		required: true,
		typeOptions: { rows: 2 },
		default: '',
		description: 'Texto principal acima da lista',
		displayOptions: { show: showOnlyForSendList },
	},
	{
		displayName: 'Description',
		name: 'desc',
		type: 'string',
		required: true,
		typeOptions: { rows: 2 },
		default: '',
		description: 'Descrição exibida junto da lista',
		displayOptions: { show: showOnlyForSendList },
	},
	{
		displayName: 'Button Text',
		name: 'buttonText',
		type: 'string',
		required: true,
		default: '',
		description: 'Texto do botão para abrir a lista',
		displayOptions: { show: showOnlyForSendList },
	},
	{
		displayName: 'Footer Text',
		name: 'footerText',
		type: 'string',
		default: '',
		description: 'Texto exibido no rodapé',
		displayOptions: { show: showOnlyForSendList },
	},
	{
		displayName: 'Sections',
		name: 'sections',
		type: 'fixedCollection',
		placeholder: 'Add section',
		typeOptions: { multipleValues: true },
		default: {},
		required: true,
		description: 'Seções e itens da lista',
		displayOptions: {
			show: {
				...showOnlyForSendList,
				listMode: ['sections'],
			},
		},
		options: [
			{
				displayName: 'Section',
				name: 'section',
				values: [
					{
						displayName: 'Rows',
						name: 'rows',
						type: 'fixedCollection',
						placeholder: 'Add row',
						typeOptions: { multipleValues: true },
						default: {},
						required: true,
						options: [
							{
								displayName: 'Row',
								name: 'row',
								values: [
									{
										displayName: 'Desc',
										name: 'desc',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Row ID',
										name: 'rowId',
										type: 'string',
										required: true,
										default: '',
									},
									{
										displayName: 'Title',
										name: 'title',
										type: 'string',
										required: true,
										default: '',
									},
								],
							},
						],
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'List',
		name: 'list',
		type: 'fixedCollection',
		placeholder: 'Add row',
		typeOptions: { multipleValues: true },
		default: {},
		required: true,
		description: 'Lista em formato legado (array simples de itens)',
		displayOptions: {
			show: {
				...showOnlyForSendList,
				listMode: ['legacy'],
			},
		},
		options: [
			{
				displayName: 'Row',
				name: 'row',
				values: [
					{
						displayName: 'Desc',
						name: 'desc',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Row ID',
						name: 'rowId',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
	},
];

