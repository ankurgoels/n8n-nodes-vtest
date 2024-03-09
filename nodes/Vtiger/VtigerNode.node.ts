import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class VtigerNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Vtiger CRM',
    name: 'vtigerNode',
    group: ['transform'],
    version: 1,
		subtitle: '={{ $parameter["operation"] }}',
    description: 'Vtiger CRM (Open Source) Node',
		icon: 'file:vtiger.svg',
    defaults: {
      name: 'Vtiger',
    },
    inputs: ['main'],
    outputs: ['main'],
		credentials: [
			{
				name: 'vtigercrmApi',
				required: true,
			},
		],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
				required: true,
        noDataExpression: true,
        options: [
          {
            name: 'Create',
            value: 'create',
          },
          {
            name: 'Delete',
            value: 'delete',
          },
          {
            name: 'Describe',
            value: 'describe',
          },
          {
            name: 'Extend Session',
            value: 'extend_session',
          },
          {
            name: 'List Types',
            value: 'list_type',
          },
          {
            name: 'Login',
            value: 'login',
          },
          {
            name: 'Logout',
            value: 'logout',
          },
          {
            name: 'Query',
            value: 'query',
          },
          {
            name: 'Retrieve',
            value: 'retrieve',
          },
          {
            name: 'Sync',
            value: 'sync',
          },
          {
            name: 'Update',
            value: 'update',
          },
        ],
        default: 'login',
      },
			{
				displayName: 'Session Name',
				name: 'session_name_field',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					hide: {
						operation: ['login'],
					},
				},
				placeholder: 'Session ID from Login Operation',
			},
			{
				displayName: 'Element',
				name: 'element_field',
				type: 'json',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update']
					}
				}
			},
			{
				displayName: 'Element Type',
				name: 'elementType_field',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create', 'describe']
					}
				}
			},
			{
				displayName: 'Webservice ID',
				name: 'webservice_id_field',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['retrieve', 'delete']
					}
				}
			},
			{
				displayName: 'Query',
				name: 'query_field',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['query']
					}
				},
				typeOptions: {
					rows: 4,
				},
			},
    ],
  };

  // The function below is responsible for actually doing whatever this node
  // is supposed to do. In this case, we're just appending the `myString` property
  // with whatever the user has entered.
  // You can make async calls and use `await`.
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let operation = this.getNodeParameter('operation', 0);
		let credential = await this.getCredentials('vtigercrmApi')

		if(operation === 'login') {
			const challenge_response = await this.helpers.httpRequest({
				baseURL: credential?.host as string,
				url: '/webservice.php',
				method: 'GET',
				qs: {
					operation: 'getchallenge',
					username: credential?.username as string,
				},
				json:true,
			});

			if(challenge_response?.success) {

				const CryptoJS = require("crypto-js");
				const login_response = await this.helpers.httpRequest({
					baseURL: credential?.host as string,
					url: '/webservice.php',
					method: 'POST',
					headers: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					body: {
						operation: 'login',
						username: credential?.username as string,
						accessKey: CryptoJS.MD5(challenge_response?.result?.token + credential?.access_key)
					},
					json:true,
				});

				return [this.helpers.returnJsonArray(login_response)];

			} else {
				throw new NodeOperationError(this.getNode(), challenge_response.error.message + ' (' + challenge_response.error.code + ')');
			}


		} else if(operation == 'list_type') {
			const logout_response = await this.helpers.httpRequest({
				baseURL: credential?.host as string,
				url: '/webservice.php',
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				body: {
					operation: 'listtypes',
					sessionName: this.getNodeParameter('session_name_field', 0) as string,
				},
				json:true,
			});

			return [this.helpers.returnJsonArray(logout_response)];
		} else {
			throw new NodeOperationError(this.getNode(), operation + ' operation is not implemented.');
		}
  }
}
