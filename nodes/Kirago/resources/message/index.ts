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
							'={{ { Phone: $parameter.phone, Body: $parameter.body, LinkPreview: $parameter.linkPreview, ...( $parameter.id ? { Id: $parameter.id } : {} ), ...( $parameter.quotedText ? { QuotedText: $parameter.quotedText } : {} ), ...( $parameter.stanzaId || $parameter.participant || $parameter.isForwarded || $parameter.mentionedJid ? { ContextInfo: { ...( $parameter.stanzaId ? { StanzaId: $parameter.stanzaId } : {} ), ...( $parameter.participant ? { Participant: $parameter.participant } : {} ), ...( $parameter.isForwarded ? { IsForwarded: true } : {} ), ...( $parameter.mentionedJid ? { MentionedJID: $parameter.mentionedJid.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) } : {} ), }, } : {} ), } }}',
					},
				},
			},
		],
		default: 'sendText',
	},
	...sendTextDescription,
];
