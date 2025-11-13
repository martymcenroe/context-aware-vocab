import json
import boto3
import os
import uuid
from datetime import datetime

# Get the table name from the environment variable we set
TABLE_NAME = os.environ.get('DYNAMO_TABLE_NAME')
# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    """
    This function receives an API Gateway POST request, parses the JSON body,
    and saves the data to a DynamoDB table.
    """
    
    print(f"## Received Event: {event}") # This is our most important log!

    try:
        # API Gateway wraps the body in a string, so we must parse it
        body = json.loads(event.get('body', '{}'))
        
        # Extract data from our browser extension's payload
        word = body.get('word')
        url = body.get('url')
        title = body.get('title')

        # --- Data Validation (Basic) ---
        if not word or not url:
            print("## Validation Failed: Missing 'word' or 'url'")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': "Missing 'word' or 'url' in payload"})
            }
        
        # --- Prepare Item for DynamoDB ---
        item_to_save = {
            'LogID': str(uuid.uuid4()), # Generate a unique primary key
            'Timestamp': datetime.now().isoformat(),
            'Word': word,
            'SourceURL': url,
            'SourceTitle': title,
            # We will add the AI_Response here in a future story
        }
        
        # --- Save to DynamoDB ---
        print(f"## Writing to DynamoDB: {item_to_save}")
        table.put_item(Item=item_to_save)
        
        # --- Send Success Response ---
        return {
            'statusCode': 200,
            # This body is what our browser extension will receive
            'body': json.dumps({'message': 'Data logged successfully', 'logId': item_to_save['LogID']})
        }

    except json.JSONDecodeError:
        print("## Error: Invalid JSON in body")
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON format in request body'})
        }
    except Exception as e:
        print(f"## UNHANDLED EXCEPTION: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }