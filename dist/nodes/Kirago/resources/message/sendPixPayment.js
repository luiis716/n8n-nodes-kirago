"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPixPaymentDescription = void 0;
const showOnlyForSendPixPayment = {
    resource: ['message'],
    operation: ['sendPixPayment'],
};
const pixKeyTypeOptions = [
    { name: 'EVP', value: 'EVP' },
    { name: 'CPF', value: 'CPF' },
    { name: 'EMAIL', value: 'EMAIL' },
    { name: 'PHONE', value: 'PHONE' },
];
exports.sendPixPaymentDescription = [
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        description: 'Número WhatsApp em formato internacional, ex.: 5511999999999',
        displayOptions: { show: showOnlyForSendPixPayment },
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        default: '',
        description: 'Título exibido na mensagem',
        displayOptions: { show: showOnlyForSendPixPayment },
    },
    {
        displayName: 'Body',
        name: 'body',
        type: 'string',
        required: true,
        typeOptions: { rows: 3 },
        default: '',
        description: 'Texto exibido na mensagem',
        displayOptions: { show: showOnlyForSendPixPayment },
    },
    {
        displayName: 'PIX Payment',
        name: 'pixPayment',
        type: 'collection',
        placeholder: 'Add PIX',
        default: {},
        required: true,
        description: 'Configuração do PIX (payment_info)',
        displayOptions: { show: showOnlyForSendPixPayment },
        options: [
            {
                displayName: 'Key',
                name: 'key',
                type: 'string',
                default: '',
                description: 'Chave PIX',
            },
            {
                displayName: 'Key Type',
                name: 'keyType',
                type: 'options',
                default: 'PHONE',
                options: pixKeyTypeOptions,
                description: 'Tipo da chave PIX',
            },
            {
                displayName: 'Merchant Name',
                name: 'merchantName',
                type: 'string',
                default: '',
                description: 'Nome do recebedor',
            },
        ],
    },
];
//# sourceMappingURL=sendPixPayment.js.map
