"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCarouselDescription = void 0;
const showOnlyForSendCarousel = {
    resource: ['message'],
    operation: ['sendCarousel'],
};
const carouselModeOptions = [
    { name: 'Global Buttons (CardButtons)', value: 'global' },
    { name: 'Per-Card Buttons (Cards[].Buttons)', value: 'per_card' },
];
const buttonTypeOptions = [
    { name: 'CTA URL', value: 'cta_url' },
    { name: 'Quick Reply', value: 'quick_reply' },
];
exports.sendCarouselDescription = [
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        description: 'User or group JID. Examples: 5511999999999, 555...@g.us.',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Carousel Type',
        name: 'carouselType',
        type: 'options',
        options: carouselModeOptions,
        default: 'global',
        description: 'Escolha entre botões globais (CardButtons) ou botões por card (Cards[].Buttons)',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        description: 'Texto exibido acima do carrossel',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Footer',
        name: 'footer',
        type: 'string',
        default: '',
        description: 'Texto exibido no rodapé',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'View Once',
        name: 'viewOnce',
        type: 'boolean',
        default: true,
        description: 'Whether to send as view once',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'ID',
        name: 'id',
        type: 'string',
        default: '',
        description: 'Identificador opcional para controle do cliente',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Quoted Text',
        name: 'quotedText',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Texto original citado na mensagem',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Card Buttons',
        name: 'cardButtons',
        type: 'fixedCollection',
        placeholder: 'Add button',
        typeOptions: { multipleValues: true },
        default: {},
        description: 'Botões globais do carrossel',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
            },
        },
        options: [
            {
                displayName: 'Button',
                name: 'button',
                values: [
                    {
                        displayName: 'Button ID',
                        name: 'buttonId',
                        type: 'string',
                        required: true,
                        default: '',
                        displayOptions: {
                            show: {
                                buttonType: ['quick_reply'],
                            },
                        },
                    },
                    {
                        displayName: 'Button Type',
                        name: 'buttonType',
                        type: 'options',
                        options: buttonTypeOptions,
                        default: 'quick_reply',
                    },
                    {
                        displayName: 'Display Text',
                        name: 'displayText',
                        type: 'string',
                        required: true,
                        default: '',
                    },
                    {
                        displayName: 'Merchant URL',
                        name: 'merchantUrl',
                        type: 'string',
                        default: '',
                        description: 'URL do merchant (se vazio, usa o mesmo valor de URL)',
                        displayOptions: {
                            show: {
                                buttonType: ['cta_url'],
                            },
                        },
                    },
                    {
                        displayName: 'URL',
                        name: 'url',
                        type: 'string',
                        required: true,
                        default: '',
                        displayOptions: {
                            show: {
                                buttonType: ['cta_url'],
                            },
                        },
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Cards',
        name: 'cards',
        type: 'fixedCollection',
        placeholder: 'Add card',
        typeOptions: { multipleValues: true },
        default: {},
        required: true,
        description: 'Cartões do carrossel',
        displayOptions: { show: showOnlyForSendCarousel },
        options: [
            {
                displayName: 'Card',
                name: 'card',
                values: [
                    {
                        displayName: 'Buttons',
                        name: 'buttons',
                        type: 'fixedCollection',
                        placeholder: 'Add button',
                        typeOptions: { multipleValues: true },
                        default: {},
                        description: 'Botões do card',
                        displayOptions: {
                            show: {
                                carouselType: ['per_card'],
                            },
                        },
                        options: [
                            {
                                displayName: 'Button',
                                name: 'button',
                                values: [
                                    {
                                        displayName: 'Button ID',
                                        name: 'buttonId',
                                        type: 'string',
                                        required: true,
                                        default: '',
                                        displayOptions: {
                                            show: {
                                                buttonType: ['quick_reply'],
                                            },
                                        },
                                    },
                                    {
                                        displayName: 'Button Type',
                                        name: 'buttonType',
                                        type: 'options',
                                        options: buttonTypeOptions,
                                        default: 'quick_reply',
                                    },
                                    {
                                        displayName: 'Display Text',
                                        name: 'displayText',
                                        type: 'string',
                                        required: true,
                                        default: '',
                                    },
                                    {
                                        displayName: 'Merchant URL',
                                        name: 'merchantUrl',
                                        type: 'string',
                                        default: '',
                                        description: 'URL do merchant (se vazio, usa o mesmo valor de URL)',
                                        displayOptions: {
                                            show: {
                                                buttonType: ['cta_url'],
                                            },
                                        },
                                    },
                                    {
                                        displayName: 'URL',
                                        name: 'url',
                                        type: 'string',
                                        required: true,
                                        default: '',
                                        displayOptions: {
                                            show: {
                                                buttonType: ['cta_url'],
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        displayName: 'Caption',
                        name: 'caption',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Footer',
                        name: 'footer',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Image',
                        name: 'image',
                        type: 'string',
                        required: true,
                        default: '',
                        description: 'HTTP(S) URL or data:image/...;base64,&lt;data&gt;',
                    },
                    {
                        displayName: 'Title',
                        name: 'title',
                        type: 'string',
                        default: '',
                    },
                ],
            },
        ],
    },
    {
        displayName: 'Additional Options',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        displayOptions: { show: showOnlyForSendCarousel },
        options: [
            {
                displayName: 'Context Is Forwarded',
                name: 'isForwarded',
                type: 'boolean',
                default: false,
                description: 'Whether the message is forwarded',
            },
            {
                displayName: 'Context Mentioned JIDs',
                name: 'mentionedJid',
                type: 'string',
                typeOptions: { rows: 3 },
                default: '',
                description: 'Liste os JIDs separados por vírgula ou quebra de linha',
            },
            {
                displayName: 'Context Participant',
                name: 'participant',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Context Stanza ID',
                name: 'stanzaId',
                type: 'string',
                default: '',
            },
        ],
    },
];
//# sourceMappingURL=sendCarousel.js.map
