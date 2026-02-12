import type { INodeProperties } from 'n8n-workflow';
import { sendAudioDescription } from './sendAudio';
import { sendButtonsDescription } from './sendButtons';
import { sendCarouselDescription } from './sendCarousel';
import { sendDocumentDescription } from './sendDocument';
import { sendImageDescription } from './sendImage';
import { sendListDescription } from './sendList';
import { sendOrderDetailsDescription } from './sendOrderDetails';
import { sendPixPaymentDescription } from './sendPixPayment';
import { sendTextDescription } from './sendText';
import { sendVideoDescription } from './sendVideo';

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
                name: 'Send Audio',
                value: 'sendAudio',
                action: 'Send audio message',
                description: 'Enviar mensagem de áudio via Kirago',
            },
			{
				name: 'Send Buttons',
				value: 'sendButtons',
				action: 'Send buttons message',
				description: 'Enviar botões via Kirago',
			},
			{
				name: 'Send Carousel',
				value: 'sendCarousel',
				action: 'Send carousel message',
				description: 'Enviar carrossel via Kirago',
			},
			{
				name: 'Send Document',
				value: 'sendDocument',
				action: 'Send document message',
				description: 'Enviar documento via Kirago',
            },
			{
				name: 'Send Image',
				value: 'sendImage',
				action: 'Send image message',
				description: 'Enviar imagem via Kirago',
			},
			{
				name: 'Send List',
				value: 'sendList',
				action: 'Send list message',
				description: 'Enviar lista via Kirago',
			},
			{
				name: 'Send Order Details',
				value: 'sendOrderDetails',
				action: 'Send order details message',
				description: 'Enviar pagamento (order_details) via Kirago',
			},
			{
				name: 'Send PIX Payment',
				value: 'sendPixPayment',
				action: 'Send pix payment message',
				description: 'Enviar PIX copia e cola (payment_info) via Kirago',
			},
			{
				name: 'Send Text',
				value: 'sendText',
				action: 'Send text message',
				description: 'Enviar mensagem de texto via Kirago',
			},
            {
                name: 'Send Video',
                value: 'sendVideo',
                action: 'Send video message',
                description: 'Enviar mensagem de vídeo via Kirago',
            },
        ],
		default: 'sendText',
	},
	...sendTextDescription,
	...sendImageDescription,
	...sendAudioDescription,
	...sendButtonsDescription,
	...sendCarouselDescription,
	...sendListDescription,
	...sendOrderDetailsDescription,
	...sendPixPaymentDescription,
	...sendDocumentDescription,
	...sendVideoDescription,
];
