"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kirago = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const message_1 = require("./resources/message");
class Kirago {
    constructor() {
        this.description = {
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
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
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
                ...message_1.messageDescription,
            ],
        };
    }
    async execute() {
        var _a;
        const items = this.getInputData();
        const returnData = [];
        const credentials = (await this.getCredentials('kiragoApi'));
        const baseURL = credentials.baseUrl.endsWith('/') ? credentials.baseUrl : `${credentials.baseUrl}/`;
        const buildContextInfo = (extra) => {
            var _a;
            const context = {};
            if (extra.stanzaId)
                context.StanzaId = extra.stanzaId;
            if (extra.participant)
                context.Participant = extra.participant;
            if (extra.isForwarded)
                context.IsForwarded = true;
            const mentioned = (_a = extra.mentionedJid) === null || _a === void 0 ? void 0 : _a.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
            if (mentioned === null || mentioned === void 0 ? void 0 : mentioned.length)
                context.MentionedJID = mentioned;
            return context;
        };
        const post = async (url, body) => this.helpers.httpRequestWithAuthentication.call(this, 'kiragoApi', {
            method: 'POST',
            url,
            baseURL,
            body,
            json: true,
        });
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            if (resource !== 'message') {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
            }
            if (operation === 'sendText') {
                const phone = this.getNodeParameter('phone', i);
                const bodyText = this.getNodeParameter('body', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Body: bodyText,
                    LinkPreview: extra.linkPreview !== undefined
                        ? extra.linkPreview
                        : true,
                };
                if (extra.id)
                    payload.Id = extra.id;
                if (extra.quotedText)
                    payload.QuotedText = extra.quotedText;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/text', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendImage') {
                const phone = this.getNodeParameter('phone', i);
                const image = this.getNodeParameter('image', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Image: image,
                };
                if (extra.caption)
                    payload.Caption = extra.caption;
                if (extra.id)
                    payload.Id = extra.id;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/image', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendAudio') {
                const phone = this.getNodeParameter('phone', i);
                const audio = this.getNodeParameter('audio', i);
                const ptt = this.getNodeParameter('ptt', i);
                const mimeType = this.getNodeParameter('mimeType', i);
                const seconds = this.getNodeParameter('seconds', i);
                const waveformRaw = this.getNodeParameter('waveform', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                let waveform = waveformRaw;
                try {
                    waveform = JSON.parse(waveformRaw);
                }
                catch {
                    waveform = waveformRaw;
                }
                const payload = {
                    Phone: phone,
                    Audio: audio,
                    PTT: ptt,
                    MimeType: mimeType,
                    Seconds: seconds,
                    Waveform: waveform,
                };
                if (extra.id)
                    payload.Id = extra.id;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/audio', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendButtons') {
                const phone = this.getNodeParameter('phone', i);
                const bodyText = this.getNodeParameter('body', i);
                const footerText = this.getNodeParameter('footer', i);
                const headerType = this.getNodeParameter('headerType', i);
                const headerMediaUrl = this.getNodeParameter('headerMediaUrl', i);
                const buttonsRaw = this.getNodeParameter('buttons', i);
                const buttons = (_a = buttonsRaw === null || buttonsRaw === void 0 ? void 0 : buttonsRaw.button) !== null && _a !== void 0 ? _a : [];
                if (!buttons.length) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one button is required');
                }
                if (headerType && headerType !== 'none' && headerType !== 'image' && headerType !== 'video') {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported header type: ${headerType}`);
                }
                if (headerType && headerType !== 'none' && !headerMediaUrl) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Header Media URL is required when Header Type is Image/Video');
                }
                const payload = {
                    phone,
                    body: bodyText,
                    buttons: buttons.map((b) => ({
                        name: b.buttonType,
                        buttonParamsJson: {
                            display_text: b.displayText,
                            id: b.buttonId,
                        },
                    })),
                };
                if (footerText)
                    payload.footer = footerText;
                if (headerType && headerType !== 'none') {
                    payload.header = {
                        type: headerType,
                        media_url: headerMediaUrl,
                    };
                }
                const response = await post('/chat/send/buttons', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendDocument') {
                const phone = this.getNodeParameter('phone', i);
                const document = this.getNodeParameter('document', i);
                const fileName = this.getNodeParameter('fileName', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Document: document,
                    FileName: fileName,
                };
                if (extra.id)
                    payload.Id = extra.id;
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/document', payload);
                returnData.push({ json: response });
                continue;
            }
            if (operation === 'sendVideo') {
                const phone = this.getNodeParameter('phone', i);
                const video = this.getNodeParameter('video', i);
                const caption = this.getNodeParameter('caption', i);
                const id = this.getNodeParameter('id', i);
                const jpegThumbnail = this.getNodeParameter('jpegThumbnail', i);
                const extra = this.getNodeParameter('additionalFields', i) || {};
                const context = buildContextInfo(extra);
                const payload = {
                    Phone: phone,
                    Video: video,
                    Caption: caption,
                    Id: id,
                    JpegThumbnail: jpegThumbnail,
                };
                if (Object.keys(context).length)
                    payload.ContextInfo = context;
                const response = await post('/chat/send/video', payload);
                returnData.push({ json: response });
                continue;
            }
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
        }
        return [returnData];
    }
}
exports.Kirago = Kirago;
//# sourceMappingURL=Kirago.node.js.map