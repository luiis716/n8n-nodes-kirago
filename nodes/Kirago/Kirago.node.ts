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
				const headerType = (this.getNodeParameter('headerType', i) as string) || 'none';
				let headerMediaUrl = '';
				let headerThumbnailUrl = '';

				if (headerType !== 'none') {
					headerMediaUrl = ((this.getNodeParameter('headerMediaUrl', i) as string) ?? '').trim();
					if (headerType === 'video') {
						headerThumbnailUrl = ((this.getNodeParameter('headerThumbnailUrl', i) as string) ?? '').trim();
					}
				}

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

				if (buttons.length > 3) {
					throw new NodeOperationError(this.getNode(), 'A maximum of 3 buttons is allowed');
				}

				if (headerType && headerType !== 'none' && headerType !== 'image' && headerType !== 'video') {
					throw new NodeOperationError(this.getNode(), `Unsupported header type: ${headerType}`);
				}

				if (headerType !== 'none' && !headerMediaUrl) {
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

			if (operation === 'sendCarousel') {
				const phone = this.getNodeParameter('phone', i) as string;
				const text = ((this.getNodeParameter('text', i) as string) ?? '').trim();
				const footer = ((this.getNodeParameter('footer', i) as string) ?? '').trim();
				const viewOnce = this.getNodeParameter('viewOnce', i) as boolean;
				const id = ((this.getNodeParameter('id', i) as string) ?? '').trim();
				const quotedText = ((this.getNodeParameter('quotedText', i) as string) ?? '').trim();
				const extra = (this.getNodeParameter('additionalFields', i) as Record<string, unknown>) || {};

				const buildNativeFlowButton = (b: {
					buttonType: string;
					buttonId?: string;
					displayText: string;
					url?: string;
					merchantUrl?: string;
				}) => {
					const buttonType = (b.buttonType ?? '').trim();
					const displayText = (b.displayText ?? '').trim();

					if (!displayText) {
						throw new NodeOperationError(this.getNode(), 'Display Text is required');
					}

					const buttonParams: Record<string, unknown> = {
						display_text: displayText,
					};

					if (buttonType === 'quick_reply') {
						const buttonId = (b.buttonId ?? '').trim();
						if (!buttonId) throw new NodeOperationError(this.getNode(), 'Button ID is required for Quick Reply');
						buttonParams.id = buttonId;
					} else if (buttonType === 'cta_url') {
						const url = (b.url ?? '').trim();
						const merchantUrl = (b.merchantUrl ?? '').trim();
						if (!url) throw new NodeOperationError(this.getNode(), 'URL is required for CTA URL');
						buttonParams.url = url;
						buttonParams.merchant_url = merchantUrl || url;
					} else {
						throw new NodeOperationError(this.getNode(), `Unsupported button type: ${buttonType}`);
					}

					return {
						name: buttonType,
						buttonParams,
					};
				};

				const cardButtonsRaw = (this.getNodeParameter('cardButtons', i) as {
					button?: Array<{
						buttonType: string;
						buttonId?: string;
						displayText: string;
						url?: string;
						merchantUrl?: string;
					}>;
				}) || {};
				const cardButtons = cardButtonsRaw.button ?? [];

				const cardsRaw = this.getNodeParameter('cards', i) as {
					card?: Array<{
						title?: string;
						caption?: string;
						footer?: string;
						image: string;
						buttons?: {
							button?: Array<{
								buttonType: string;
								buttonId?: string;
								displayText: string;
								url?: string;
								merchantUrl?: string;
							}>;
						};
					}>;
				};
				const cards = cardsRaw.card ?? [];

				if (!cards.length) {
					throw new NodeOperationError(this.getNode(), 'At least one card is required');
				}

				const payload: Record<string, unknown> = {
					Phone: phone,
					Cards: cards.map((c, cardIndex) => {
						const image = (c.image ?? '').trim();
						if (!image) {
							throw new NodeOperationError(this.getNode(), `Image is required (card ${cardIndex + 1})`);
						}

						const title = (c.title ?? '').trim();
						const caption = (c.caption ?? '').trim();
						const footer = (c.footer ?? '').trim();

						const cardPayload: Record<string, unknown> = { Image: image };
						if (title) cardPayload.Title = title;
						if (caption) cardPayload.Caption = caption;
						if (footer) cardPayload.Footer = footer;

						const buttons = c.buttons?.button ?? [];
						if (buttons.length) {
							cardPayload.Buttons = buttons.map(buildNativeFlowButton);
						}

						return cardPayload;
					}),
					ViewOnce: viewOnce,
				};

				if (text) payload.Text = text;
				if (footer) payload.Footer = footer;
				if (id) payload.Id = id;
				if (quotedText) payload.QuotedText = quotedText;
				if (cardButtons.length) payload.CardButtons = cardButtons.map(buildNativeFlowButton);

				const context = buildContextInfo(extra);
				if (Object.keys(context).length) payload.ContextInfo = context;

				const response = await post('/chat/send/carousel', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendList') {
				const phone = this.getNodeParameter('phone', i) as string;
				const listMode = (this.getNodeParameter('listMode', i) as string) || 'sections';
				const topText = ((this.getNodeParameter('topText', i) as string) ?? '').trim();
				const desc = ((this.getNodeParameter('desc', i) as string) ?? '').trim();
				const buttonText = ((this.getNodeParameter('buttonText', i) as string) ?? '').trim();
				const footerText = ((this.getNodeParameter('footerText', i) as string) ?? '').trim();

				if (!topText) throw new NodeOperationError(this.getNode(), 'Top Text is required');
				if (!desc) throw new NodeOperationError(this.getNode(), 'Description is required');
				if (!buttonText) throw new NodeOperationError(this.getNode(), 'Button Text is required');

				const payload: Record<string, unknown> = {
					Phone: phone,
					TopText: topText,
					Desc: desc,
					ButtonText: buttonText,
				};

				if (footerText) payload.FooterText = footerText;

				if (listMode === 'sections') {
					const sectionsRaw = this.getNodeParameter('sections', i) as {
						section?: Array<{
							title: string;
							rows?: { row?: Array<{ rowId: string; title: string; desc?: string }> };
						}>;
					};
					const sections = sectionsRaw?.section ?? [];

					if (!sections.length) {
						throw new NodeOperationError(this.getNode(), 'At least one section is required');
					}

					payload.Sections = sections.map((s, sectionIndex) => {
						const sectionTitle = (s.title ?? '').trim();
						if (!sectionTitle) {
							throw new NodeOperationError(this.getNode(), `Section title is required (section ${sectionIndex + 1})`);
						}

						const rows = s.rows?.row ?? [];
						if (!rows.length) {
							throw new NodeOperationError(this.getNode(), `At least one row is required (section ${sectionIndex + 1})`);
						}

						return {
							title: sectionTitle,
							rows: rows.map((r, rowIndex) => {
								const rowId = (r.rowId ?? '').trim();
								const rowTitle = (r.title ?? '').trim();
								const rowDesc = (r.desc ?? '').trim();

								if (!rowId) {
									throw new NodeOperationError(
										this.getNode(),
										`Row ID is required (section ${sectionIndex + 1}, row ${rowIndex + 1})`,
									);
								}
								if (!rowTitle) {
									throw new NodeOperationError(
										this.getNode(),
										`Row title is required (section ${sectionIndex + 1}, row ${rowIndex + 1})`,
									);
								}

								const rowPayload: Record<string, unknown> = { RowId: rowId, title: rowTitle };
								if (rowDesc) rowPayload.desc = rowDesc;
								return rowPayload;
							}),
						};
					});
				} else if (listMode === 'legacy') {
					const listRaw = this.getNodeParameter('list', i) as {
						row?: Array<{ rowId: string; title: string; desc?: string }>;
					};
					const list = listRaw?.row ?? [];

					if (!list.length) {
						throw new NodeOperationError(this.getNode(), 'At least one row is required');
					}

					payload.List = list.map((r, rowIndex) => {
						const rowId = (r.rowId ?? '').trim();
						const rowTitle = (r.title ?? '').trim();
						const rowDesc = (r.desc ?? '').trim();

						if (!rowId) throw new NodeOperationError(this.getNode(), `Row ID is required (row ${rowIndex + 1})`);
						if (!rowTitle) throw new NodeOperationError(this.getNode(), `Row title is required (row ${rowIndex + 1})`);

						const rowPayload: Record<string, unknown> = { RowId: rowId, title: rowTitle };
						if (rowDesc) rowPayload.desc = rowDesc;
						return rowPayload;
					});
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported list mode: ${listMode}`);
				}

				const response = await post('/chat/send/list', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendOrderDetails') {
				const jid = ((this.getNodeParameter('jid', i) as string) ?? '').trim();
				const referenceId = ((this.getNodeParameter('referenceId', i) as string) ?? '').trim();
				const total = this.getNodeParameter('total', i) as number;
				const itemName = ((this.getNodeParameter('itemName', i) as string) ?? '').trim();
				const itemQty = this.getNodeParameter('itemQty', i) as number;
				const merchantName = ((this.getNodeParameter('merchantName', i) as string) ?? '').trim();

				const pixKey = ((this.getNodeParameter('pixKey', i) as string) ?? '').trim();
				const pixKeyType = (this.getNodeParameter('pixKeyType', i) as string) || 'EVP';
				const boletoLine = ((this.getNodeParameter('boletoLine', i) as string) ?? '').trim();
				const pdfHeaderUrl = ((this.getNodeParameter('pdfHeaderUrl', i) as string) ?? '').trim();

				const body = ((this.getNodeParameter('body', i) as string) ?? '').trim();
				const footer = ((this.getNodeParameter('footer', i) as string) ?? '').trim();
				const referral = ((this.getNodeParameter('referral', i) as string) ?? '').trim();
				const sharePaymentStatus = this.getNodeParameter('sharePaymentStatus', i) as boolean;

				if (!jid) throw new NodeOperationError(this.getNode(), 'JID is required');
				if (!referenceId) throw new NodeOperationError(this.getNode(), 'Reference ID is required');
				if (!itemName) throw new NodeOperationError(this.getNode(), 'Item Name is required');
				if (!merchantName) throw new NodeOperationError(this.getNode(), 'Merchant Name is required');
				if (!itemQty || itemQty <= 0) throw new NodeOperationError(this.getNode(), 'Item Qty must be greater than 0');
				if (total === undefined || total === null || Number.isNaN(total)) {
					throw new NodeOperationError(this.getNode(), 'Total is required');
				}
				if (total <= 0) throw new NodeOperationError(this.getNode(), 'Total must be greater than 0');

				if (!pixKey && !boletoLine) {
					throw new NodeOperationError(this.getNode(), 'Provide at least one payment method (PIX Key or Boleto Line)');
				}

				const payload: Record<string, unknown> = {
					jid,
					referenceId,
					total,
					itemName,
					itemQty,
					merchantName,
					sharePaymentStatus,
				};

				if (pixKey) {
					payload.pixKey = pixKey;
					payload.pixKeyType = pixKeyType;
				}
				if (boletoLine) payload.boletoLine = boletoLine;
				if (pdfHeaderUrl) payload.pdfHeaderUrl = pdfHeaderUrl;
				if (body) payload.body = body;
				if (footer) payload.footer = footer;
				if (referral) payload.referral = referral;

				const response = await post('/chat/send/order-details', payload);

				returnData.push({ json: response as INodeExecutionData['json'] });
				continue;
			}

			if (operation === 'sendPixPayment') {
				const phone = this.getNodeParameter('phone', i) as string;
				const title = ((this.getNodeParameter('title', i) as string) ?? '').trim();
				const body = ((this.getNodeParameter('body', i) as string) ?? '').trim();
				const pixPayment = (this.getNodeParameter('pixPayment', i) as Record<string, unknown>) || {};

				const merchantName = ((pixPayment.merchantName as string) ?? '').trim();
				const key = ((pixPayment.key as string) ?? '').trim();
				const keyType = ((pixPayment.keyType as string) ?? '').trim();

				if (!title) throw new NodeOperationError(this.getNode(), 'Title is required');
				if (!body) throw new NodeOperationError(this.getNode(), 'Body is required');
				if (!merchantName) throw new NodeOperationError(this.getNode(), 'Merchant Name is required');
				if (!key) throw new NodeOperationError(this.getNode(), 'Key is required');
				if (!keyType) throw new NodeOperationError(this.getNode(), 'Key Type is required');

				const payload: Record<string, unknown> = {
					Phone: phone,
					Title: title,
					Body: body,
					Buttons: [
						{
							PixPayment: {
								MerchantName: merchantName,
								Key: key,
								KeyType: keyType,
							},
						},
					],
				};

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
