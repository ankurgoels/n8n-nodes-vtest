import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VtigerCrmApi implements ICredentialType {
	name = 'vtigercrmApi';
	displayName = 'Vtiger CRM (Open Source) Credentials API';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Access Key',
			name: 'access_key',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
