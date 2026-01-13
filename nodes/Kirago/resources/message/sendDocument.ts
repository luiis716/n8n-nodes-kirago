import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendDocument = {
    resource: ['message'],
    operation: ['sendDocument'],
};

export const sendDocumentDescription: INodeProperties[] = [
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        description: 'Número WhatsApp em formato internacional, ex.: 5511999999999',
        displayOptions: { show: showOnlyForSendDocument },
    },
    {
        displayName: 'Document (Base64)',
        name: 'document',
        type: 'string',
        required: true,
        typeOptions: { rows: 4 },
        default: '',
        description: 'Conteúdo base64 incluindo prefixo ex: data:application/octet-stream;base64,',
        displayOptions: { show: showOnlyForSendDocument },
    },
    {
        displayName: 'File Name',
        name: 'fileName',
        type: 'string',
        required: true,
        default: '',
        description: 'Nome do arquivo enviado',
        displayOptions: { show: showOnlyForSendDocument },
    },
    {
        displayName: 'Additional Options',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        displayOptions: { show: showOnlyForSendDocument },
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
            {
                displayName: 'ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Identificador opcional para controle do cliente',
            },
        ],
    },
];
