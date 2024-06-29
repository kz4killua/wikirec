import json
import recommendations


def lambda_handler(event, context):

    body = json.loads(event['body'])
    page_keys = body['page_keys']
    item_category = body['item_category']

    results = recommendations.get_recommendations(
        page_keys, item_category, 20
    )

    return {
        'statusCode': 200, 'body': json.dumps(results)
    }