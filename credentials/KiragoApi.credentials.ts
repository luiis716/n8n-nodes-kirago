import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class KiragoApi implements ICredentialType {
	name = 'kiragoApi';
	displayName = 'Kirago API';
	icon: Icon = 'file:../nodes/Kirago/kirago.svg';
	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-kirago?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://kirago.com.br/',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				token: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/health',
			method: 'GET',
			headers: {
				accept: 'application/json',
				token: '={{$credentials.apiKey}}',
			},
		},
	};
}
