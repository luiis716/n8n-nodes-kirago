import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
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
}
