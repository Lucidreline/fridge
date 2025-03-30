import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutItemCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
let ddbDocClient = DynamoDBDocumentClient.from(client);

// redirect dynamodb if this is ran locally
if (process.env.AWS_SAM_LOCAL) {
  ddbDocClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      endpoint: 'http://172.22.0.2:8000',
    })
  );
}
const TABLE_NAME = process.env.TABLE_NAME || 'Ingredients';

export const handler = async (event) => {
  try {
    // Parse the incoming request body
    const body = JSON.parse(event.body);

    // Destructure expected fields from the request body
    const { id, quantity, macros, category } = body;

    // Suggestions: You might consider adding more fields.
    // For example:
    // - createdAt: When the ingredient was first added.
    // - updatedAt: When the ingredient was last updated.
    // - unit: To denote the measurement unit (grams, cups, etc.) if quantity is numeric.
    // - category: For grouping ingredients (e.g., dairy, vegetable, etc.).
    // - If macros need more granularity, consider storing them as an object, e.g., { protein, carbs, fat }.

    // Generate timestamps for createdAt and updatedAt
    const timestamp = new Date().toISOString();
    const item = {
      id, // ingredient name (make sure names are unique or adjust logic accordingly)
      quantity,
      macros,
      category,
      updatedAt: timestamp,
    };

    // Prepare the DynamoDB PutItem command
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: item,
    });

    // Send the command to DynamoDB
    await ddbDocClient.send(command);

    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Ingredient added successfully',
        ingredient: item,
      }),
    };
  } catch (error) {
    console.error('Error putting ingredient:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error adding ingredient',
        error: error.message,
      }),
    };
  }
};
