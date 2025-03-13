import boto3
import json
from decimal import Decimal
import math

# Your table name
TABLE_NAME = 'Expense-hziuk4texngnpdushazijd3p5q-main'

# Path to your JSON file
JSON_FILE_PATH = './transformed_expenses_v2/all_transformed_expenses.json'

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def sanitize_number(value):
    """Convert floats to Decimal and handle NaN/Infinity."""
    if isinstance(value, float):
        if math.isnan(value) or math.isinf(value):
            return None  # or Decimal("0") if you prefer
        return Decimal(str(value))
    return value

def sanitize_item(obj):
    """Recursively sanitize entire JSON structure."""
    if isinstance(obj, list):
        return [sanitize_item(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: sanitize_item(v) for k, v in obj.items()}
    else:
        return sanitize_number(obj)

# Read JSON and sanitize data
with open(JSON_FILE_PATH, 'r') as f:
    raw_items = json.load(f)

items = sanitize_item(raw_items)

print(f"✅ Loaded and sanitized {len(items)} items from {JSON_FILE_PATH}")

# Batch write to DynamoDB
with table.batch_writer(overwrite_by_pkeys=['id']) as batch:
    count = 0
    for item in items:
        batch.put_item(Item=item)
        count += 1
        if count % 25 == 0:
            print(f"📝 Uploaded {count} items...")

print(f"✅ Successfully uploaded {count} items to {TABLE_NAME}")
