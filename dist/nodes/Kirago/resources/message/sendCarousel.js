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
        displayName: 'Global Button Type',
        name: 'globalButtonType',
        type: 'options',
        options: buttonTypeOptions,
        default: 'quick_reply',
        description: 'Tipo do botão global (apenas 1)',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
            },
        },
    },
    {
        displayName: 'Global Button Display Text',
        name: 'globalButtonDisplayText',
        type: 'string',
        default: '',
        description: 'Texto do botão global (se vazio, envia sem botão global)',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
            },
        },
    },
    {
        displayName: 'Global Button ID',
        name: 'globalButtonId',
        type: 'string',
        default: '',
        description: 'ID do Quick Reply global (retornado quando o usuário clicar no botão)',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
                globalButtonType: ['quick_reply'],
            },
        },
    },
    {
        displayName: 'Global Button URL',
        name: 'globalButtonUrl',
        type: 'string',
        default: '',
        description: 'URL do botão global (CTA URL)',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
                globalButtonType: ['cta_url'],
            },
        },
    },
    {
        displayName: 'Global Button Merchant URL',
        name: 'globalButtonMerchantUrl',
        type: 'string',
        default: '',
        description: 'Merchant URL do botão global (se vazio, usa a mesma URL)',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
                globalButtonType: ['cta_url'],
            },
        },
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
        displayName: 'Message ID',
        name: 'id',
        type: 'string',
        default: '',
        description: 'Identificador opcional da mensagem (para controle do cliente)',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Quoted Message Text',
        name: 'quotedText',
        type: 'string',
        typeOptions: { rows: 3 },
        default: '',
        description: 'Texto original citado (resposta)',
        displayOptions: { show: showOnlyForSendCarousel },
    },
    {
        displayName: 'Legacy Card Buttons',
        name: 'cardButtons',
        type: 'fixedCollection',
        placeholder: 'Add button',
        typeOptions: { multipleValues: true, maxValue: 1 },
        default: {},
        description: 'Campo legado: botão global do carrossel',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
                useLegacyCardButtons: [true],
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
        name: 'cardsGlobal',
        type: 'fixedCollection',
        placeholder: 'Add card',
        typeOptions: { multipleValues: true },
        default: {},
        required: true,
        description: 'Cartões do carrossel',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['global'],
            },
        },
        options: [
            {
                displayName: 'Card',
                name: 'card',
                values: [
                    {
                        displayName: 'Caption',
                        name: 'caption',
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
                        displayName: 'Image Text',
                        name: 'footer',
                        type: 'string',
                        default: '',
                        description: 'Texto opcional exibido no card junto da imagem',
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
        displayName: 'Cards',
        name: 'cardsPerCard',
        type: 'fixedCollection',
        placeholder: 'Add card',
        typeOptions: { multipleValues: true },
        default: {},
        required: true,
        description: 'Cartões do carrossel',
        displayOptions: {
            show: {
                ...showOnlyForSendCarousel,
                carouselType: ['per_card'],
            },
        },
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
                        displayName: 'Image',
                        name: 'image',
                        type: 'string',
                        required: true,
                        default: '',
                        description: 'HTTP(S) URL or data:image/...;base64,&lt;data&gt;',
                    },
                    {
                        displayName: 'Image Text',
                        name: 'footer',
                        type: 'string',
                        default: '',
                        description: 'Texto opcional exibido no card junto da imagem',
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
];
//# sourceMappingURL=sendCarousel.js.map