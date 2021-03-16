import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'

export class CdkapigwplanStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const PREFIX_NAME = id.toLocaleLowerCase().replace('stack', '')
    
    const api = new apigateway.RestApi(this, 'api', { 
      restApiName: PREFIX_NAME + '-api',
    });
    
    const apikey = api.addApiKey('apikey', {
      apiKeyName: PREFIX_NAME + '-apikey', // 削除してくれない?
      value: '12345678901234567890', // 20字以上
    })
    
    const plan = api.addUsagePlan('usageplan', {
      name: 'plan',
      apiKey: apikey,
      throttle: {
        rateLimit: 10,
        burstLimit: 10
      },
      quota: {
        limit: 200,
        period: apigateway.Period.DAY
      }
    })
    
    plan.addApiStage({
      stage: api.deploymentStage
    })

    const integration = new apigateway.MockIntegration({
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': JSON.stringify({
          statusCode: 200
        })
      },
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'text/plain': 'コンニチハ'
        }
      }]
    })
    
    api.root.addMethod('GET', integration, {
      apiKeyRequired: true,
      methodResponses: [{
        statusCode: '200',
        responseModels: {
          'text/plain': new apigateway.EmptyModel()
        }
      }]}
    )
    
  }
}
