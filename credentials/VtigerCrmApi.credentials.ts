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
			required: true,
			default: '',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: 'Access Key',
			name: 'access_key',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
