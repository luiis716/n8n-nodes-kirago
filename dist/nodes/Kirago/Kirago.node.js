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
        for (let i = 0; i < items.length; i++) {
            const phone = this.getNodeParameter('phone', i);
            const bodyText = this.getNodeParameter('body', i);
            const extra = this.getNodeParameter('additionalFields', i) || {};
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
            const response = await this.helpers.httpRequestWithAuthentication.call(this, 'kiragoApi', {
                method: 'POST',
                url: '/chat/send/text',
                baseURL,
                body: payload,
                json: true,
            });
            returnData.push({ json: response });
        }
        return [returnData];
    }
}
exports.Kirago = Kirago;
//# sourceMappingURL=Kirago.node.js.map