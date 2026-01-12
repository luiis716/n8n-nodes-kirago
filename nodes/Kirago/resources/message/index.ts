import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';

const showOnlyForMessages = {
	resource: ['message'],
};

export const messageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMessages,
		},
		options: [
			{
				name: 'Send Text',
				value: 'sendText',
				action: 'Send text message',
				description: 'Enviar mensagem de texto via Kirago',
				routing: {
					request: {
						method: 'POST',
						url: '/chat/send/text',
						body:
							'={{ (() => { const extra = $parameter.additionalFields || {}; const context = {}; if (extra.stanzaId) context.StanzaId = extra.stanzaId; if (extra.participant) context.Participant = extra.participant; if (extra.isForwarded) context.IsForwarded = true; const mentioned = (extra.mentionedJid || "").split(/[\n,]+/).map(s => s.trim()).filter(Boolean); if (mentioned.length) context.MentionedJID = mentioned; const payload = { Phone: $parameter.phone, Body: $parameter.body, LinkPreview: extra.linkPreview !== undefined ? extra.linkPreview : true }; if (extra.id) payload.Id = extra.id; if (extra.quotedText) payload.QuotedText = extra.quotedText; if (Object.keys(context).length) payload.ContextInfo = context; return payload; })() }}',
					},
				},
			},
		],
		default: 'sendText',
	},
	...sendTextDescription,
];
