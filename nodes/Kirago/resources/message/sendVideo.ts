import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendVideo = {
    resource: ['message'],
    operation: ['sendVideo'],
};

export const sendVideoDescription: INodeProperties[] = [
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        required: true,
        default: '',
        description: 'Número WhatsApp em formato internacional, ex.: 5511999999999',
        displayOptions: { show: showOnlyForSendVideo },
    },
    {
        displayName: 'Video (Base64)',
        name: 'video',
        type: 'string',
        required: true,
        typeOptions: { rows: 4 },
        default: '',
        description: 'Conteúdo base64 incluindo prefixo ex: data:video/mp4;base64,',
        displayOptions: { show: showOnlyForSendVideo },
    },
    {
        displayName: 'Caption',
        name: 'caption',
        type: 'string',
        required: true,
        typeOptions: { rows: 2 },
        default: '',
        description: 'Legenda exibida junto ao vídeo',
        displayOptions: { show: showOnlyForSendVideo },
    },
    {
        displayName: 'ID',
        name: 'id',
        type: 'string',
        required: true,
        default: '',
        description: 'Identificador opcional para controle do cliente',
        displayOptions: { show: showOnlyForSendVideo },
    },
    {
        displayName: 'JPEG Thumbnail',
        name: 'jpegThumbnail',
        type: 'string',
        required: true,
        typeOptions: { rows: 2 },
        default: '',
        description: 'Miniatura no formato base64, por exemplo: AA00D010',
        displayOptions: { show: showOnlyForSendVideo },
    },
    {
        displayName: 'Additional Options',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        displayOptions: { show: showOnlyForSendVideo },
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
