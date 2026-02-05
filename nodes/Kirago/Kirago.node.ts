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

		const buildContextInfo = (extra: Record<string, unknown>) => {
			const context: Record<string, unknown> = {};

			if (extra.stanzaId) context.StanzaId = extra.stanzaId;
			if (extra.participant) context.Participant = extra.participant;
			if (extra.isForwarded) context.IsForwarded = true;

			const mentioned = (extra.mentionedJid as string | undefined)
				?.split(/[\n,]+/)
				.map((s) => s.trim())
				.filter(Boolean);
			if (mentioned?.length) context.MentionedJID = mentioned;

			return context;
		};

		const post = async (url: string, body: Record<string, unknown>) =>
			this.helpers.httpRequestWithAuthentication.call(this, 'kiragoApi', {
				method: 'POST',
				url,
				baseURL,
				body,
				json: true,
			});

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

				const context = buildContextInfo(extra);

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

				const response = await post('/chat/send/text', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendImage') {
				const phone = this.getNodeParameter('phone', i) as string;
				const image = this.getNodeParameter('image', i) as string;
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context = buildContextInfo(extra);

				const payload: Record<string, unknown> = {
					Phone: phone,
					Image: image,
				};

				if (extra.caption) payload.Caption = extra.caption;
				if (extra.id) payload.Id = extra.id;
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await post('/chat/send/image', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendAudio') {
				const phone = this.getNodeParameter('phone', i) as string;
				const audio = this.getNodeParameter('audio', i) as string;
				const ptt = this.getNodeParameter('ptt', i) as boolean;
				const mimeType = this.getNodeParameter('mimeType', i) as string;
				const seconds = this.getNodeParameter('seconds', i) as number;
				const waveformRaw = this.getNodeParameter('waveform', i) as string;
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context = buildContextInfo(extra);

				let waveform: unknown = waveformRaw;
				try {
					waveform = JSON.parse(waveformRaw);
				} catch {}

				const payload: Record<string, unknown> = {
					Phone: phone,
					Audio: audio,
					PTT: ptt,
					MimeType: mimeType,
					Seconds: seconds,
					Waveform: waveform,
				};

				if (extra.id) payload.Id = extra.id;
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await post('/chat/send/audio', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendButtons') {
				const phone = this.getNodeParameter('phone', i) as string;
				const bodyText = this.getNodeParameter('body', i) as string;
				const footerText = this.getNodeParameter('footer', i) as string;
				const headerType = this.getNodeParameter('headerType', i) as string;
				const headerText = this.getNodeParameter('headerText', i) as string;
				const headerMediaUrl = this.getNodeParameter('headerMediaUrl', i) as string;
				const headerThumbnailUrl = this.getNodeParameter('headerThumbnailUrl', i) as string;
				const buttonsRaw = this.getNodeParameter('buttons', i) as {
					button?: Array<{ buttonType: string; buttonId: string; displayText: string }>;
				};
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context = buildContextInfo(extra);
				const buttons = buttonsRaw?.button ?? [];

				if (!buttons.length) {
					throw new NodeOperationError(this.getNode(), 'At least one button is required');
				}

				const payload: Record<string, unknown> = {
					Phone: phone,
					Body: bodyText,
					Buttons: buttons.map((b) => ({
						ButtonType: b.buttonType,
						ButtonId: b.buttonId,
						DisplayText: b.displayText,
					})),
				};

				if (footerText) payload.Footer = footerText;

				if (headerType && headerType !== 'none') {
					payload.HeaderType = headerType;
					if (headerType === 'text' && headerText) payload.HeaderText = headerText;
					if ((headerType === 'image' || headerType === 'video') && headerMediaUrl)
						payload.HeaderMediaUrl = headerMediaUrl;
					if (headerType === 'video' && headerThumbnailUrl)
						payload.HeaderThumbnailUrl = headerThumbnailUrl;
				}

				if (extra.id) payload.Id = extra.id;
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await post('/chat/send/buttons', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendDocument') {
				const phone = this.getNodeParameter('phone', i) as string;
				const document = this.getNodeParameter('document', i) as string;
				const fileName = this.getNodeParameter('fileName', i) as string;
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context = buildContextInfo(extra);

				const payload: Record<string, unknown> = {
					Phone: phone,
					Document: document,
					FileName: fileName,
				};

				if (extra.id) payload.Id = extra.id;
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await post('/chat/send/document', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendVideo') {
				const phone = this.getNodeParameter('phone', i) as string;
				const video = this.getNodeParameter('video', i) as string;
				const caption = this.getNodeParameter('caption', i) as string;
				const id = this.getNodeParameter('id', i) as string;
				const jpegThumbnail = this.getNodeParameter('jpegThumbnail', i) as string;
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const context = buildContextInfo(extra);

				const payload: Record<string, unknown> = {
					Phone: phone,
					Video: video,
					Caption: caption,
					Id: id,
					JpegThumbnail: jpegThumbnail,
				};

				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await post('/chat/send/video', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
		}

		return [returnData];
	}
}
