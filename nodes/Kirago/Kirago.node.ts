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
					} catch {
						waveform = waveformRaw;
					}

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
				const title = ((this.getNodeParameter('title', i) as string) ?? '').trim();
				const bodyText = this.getNodeParameter('body', i) as string;
				const footerText = this.getNodeParameter('footer', i) as string;
				const headerType = this.getNodeParameter('headerType', i) as string;
				const headerMediaUrl = ((this.getNodeParameter('headerMediaUrl', i) as string) ?? '').trim();
				const headerThumbnailUrl = ((this.getNodeParameter('headerThumbnailUrl', i) as string) ?? '').trim();
				const buttonsRaw = this.getNodeParameter('buttons', i) as {
					button?: Array<{
						buttonType: string;
						buttonId?: string;
						displayText: string;
						url?: string;
						merchantUrl?: string;
						copyCode?: string;
						phoneNumber?: string;
					}>;
				};
				const buttons = buttonsRaw?.button ?? [];

				if (!buttons.length) {
					throw new NodeOperationError(this.getNode(), 'At least one button is required');
				}

				if (headerType && headerType !== 'none' && headerType !== 'image' && headerType !== 'video') {
					throw new NodeOperationError(this.getNode(), `Unsupported header type: ${headerType}`);
				}

				if (headerType && headerType !== 'none' && !headerMediaUrl) {
					throw new NodeOperationError(this.getNode(), 'Header Media URL is required when Header Type is Image/Video');
				}

				const payload: Record<string, unknown> = {
					phone,
					body: bodyText,
					buttons: buttons.map((b) => {
						const baseParams: Record<string, unknown> = {
							display_text: b.displayText,
						};

						if (b.buttonType === 'quick_reply') {
							const buttonId = (b.buttonId ?? '').trim();
							if (!buttonId) {
								throw new NodeOperationError(this.getNode(), 'Button ID is required for Quick Reply');
							}
							baseParams.id = buttonId;
						} else if (b.buttonType === 'cta_url') {
							const url = (b.url ?? '').trim();
							const merchantUrl = (b.merchantUrl ?? '').trim();
							if (!url) {
								throw new NodeOperationError(this.getNode(), 'URL is required for CTA URL');
							}
							baseParams.url = url;
							baseParams.merchant_url = merchantUrl || url;
						} else if (b.buttonType === 'cta_copy') {
							const copyCode = (b.copyCode ?? '').trim();
							if (!copyCode) {
								throw new NodeOperationError(this.getNode(), 'Copy Code is required for CTA Copy');
							}
							baseParams.copy_code = copyCode;
						} else if (b.buttonType === 'cta_call') {
							const phoneNumber = (b.phoneNumber ?? '').trim();
							if (!phoneNumber) {
								throw new NodeOperationError(this.getNode(), 'Phone Number is required for CTA Call');
							}
							baseParams.phoneNumber = phoneNumber;
						} else {
							throw new NodeOperationError(this.getNode(), `Unsupported button type: ${b.buttonType}`);
						}

						return {
							name: b.buttonType,
							buttonParamsJson: baseParams,
						};
					}),
				};

				if (title) payload.title = title;
				if (footerText) payload.footer = footerText;

				if (headerType && headerType !== 'none') {
					const header: Record<string, unknown> = {
						type: headerType,
						media_url: headerMediaUrl,
					};
					if (headerType === 'video' && headerThumbnailUrl) {
						header.thumbnail_url = headerThumbnailUrl;
					}
					payload.header = header;
				}

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
