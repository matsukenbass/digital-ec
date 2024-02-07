import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

export async function getDataById(itemId: string) {
  const tableName = process.env.DYNAMODB_TABLE;

  const client = new DynamoDBClient({ region: process.env.AWS_REGION });

  const params = {
    TableName: tableName,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': { S: itemId },
    },
  };

  try {
    const command = new QueryCommand(params);
    const response = await client.send(command);

    return response.Items;
  } catch (error) {
    console.error('Error getting item:', error);
  }
}
