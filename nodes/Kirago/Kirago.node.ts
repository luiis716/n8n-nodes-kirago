import type { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
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
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;
			if (resource !== 'message') {
				throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
			}

			if (operation === 'sendText') {
				const phone = this.getNodeParameter('phone', i) as string;
				const bodyText = this.getNodeParameter('body', i) as string;
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context: Record<string, unknown> = {};
				if (extra.stanzaId) context.StanzaId = extra.stanzaId;
				if (extra.participant) context.Participant = extra.participant;
				if (extra.isForwarded) context.IsForwarded = true;
				const mentioned = (extra.mentionedJid as string | undefined)?.split(/[\n,]+/)
					.map((s) => s.trim())
					.filter(Boolean);
				if (mentioned?.length) context.MentionedJID = mentioned;

				const payload: Record<string, unknown> = {
					Phone: phone,
					Body: bodyText,
					LinkPreview:
						extra.linkPreview !== undefined
							? (extra.linkPreview as boolean)
							: true,
				};

				if (extra.id) payload.Id = extra.id;
				if (extra.quotedText) payload.QuotedText = extra.quotedText;
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await (this.helpers as any).httpRequestWithAuthentication.call(this, 'kiragoApi', {
					method: 'POST',
					url: '/chat/send/text',
					baseURL,
					body: payload,
					json: true,
				});

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendImage') {
				const phone = this.getNodeParameter('phone', i) as string;
				const image = this.getNodeParameter('image', i) as string;
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context: Record<string, unknown> = {};
				if (extra.stanzaId) context.StanzaId = extra.stanzaId;
				if (extra.participant) context.Participant = extra.participant;
				if (extra.isForwarded) context.IsForwarded = true;
				const mentioned = (extra.mentionedJid as string | undefined)?.split(/[\n,]+/)
					.map((s) => s.trim())
					.filter(Boolean);
				if (mentioned?.length) context.MentionedJID = mentioned;

				const payload: Record<string, unknown> = {
					Phone: phone,
					Image: image,
				};

				if (extra.caption) payload.Caption = extra.caption;
				if (extra.id) payload.Id = extra.id;
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await (this.helpers as any).httpRequestWithAuthentication.call(this, 'kiragoApi', {
					method: 'POST',
					url: '/chat/send/image',
					baseURL,
					body: payload,
					json: true,
				});

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
		}

		return [returnData];
	}
}
