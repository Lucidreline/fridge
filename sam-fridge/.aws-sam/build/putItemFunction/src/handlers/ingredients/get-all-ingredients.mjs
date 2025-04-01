import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

// redirect dynamodb if this is ran locally
if (process.env.AWS_SAM_LOCAL) {
  ddbDocClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      endpoint: 'http://172.23.0.2:8000',
    })
  );
}
const TABLE_NAME = process.env.SAMPLE_TABLE;

export const getAllIngredientsHandler = async (event) => {
  try {
    // Prepare the DynamoDB Scan command to retrieve all ingredients
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    // Send the command to DynamoDB
    const data = await ddbDocClient.send(command);

    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ingredients retrieved successfully',
        ingredients: data.Items,
      }),
    };
  } catch (error) {
    console.error('Error retrieving ingredients:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error retrieving ingredients',
        error: error.message,
      }),
    };
  }
};
