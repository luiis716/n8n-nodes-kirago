import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { messageDescription } from './resources/message';

export class Kirago implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kirago',
		name: 'kirago',
		icon: { light: 'file:kirago.svg', dark: 'file:kirago.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Kirago API',
		defaults: {
			name: 'Kirago',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'kiragoApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'message',
			},
			...messageDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = (await this.getCredentials('kiragoApi')) as { baseUrl: string };
		const baseURL = credentials.baseUrl.endsWith('/') ? credentials.baseUrl : `${credentials.baseUrl}/`;

		for (let i = 0; i < items.length; i++) {
			const phone = this.getNodeParameter('phone', i) as string;
			const bodyText = this.getNodeParameter('body', i) as string;
			const linkPreview = this.getNodeParameter('linkPreview', i) as boolean;

			const payload = { Phone: phone, Body: bodyText, LinkPreview: linkPreview };

			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'kiragoApi', {
				method: 'POST',
				url: '/chat/send/text',
				baseURL,
				body: payload,
				json: true,
			});

			returnData.push({ json: response as INodeExecutionData['json'] });
		}

		return [returnData];
	}
}
