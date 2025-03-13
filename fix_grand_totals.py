import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Attr

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
table_name = 'Expense-hziuk4texngnpdushazijd3p5q-main'  # Update if needed
table = dynamodb.Table(table_name)

def calculate_grand_total(line_items):
    """
    Calculate the grand total from line items.
    """
    total = Decimal('0.00')
    for item in line_items:
        # Assuming item is stored in DynamoDB format (already deserialized)
        quantity = Decimal(item.get('quantity', 0))
        unit_cost = Decimal(item.get('unitCost', 0))
        total += quantity * unit_cost
    return total

def sanitize_expense(expense):
    """
    Returns a sanitized expense item with a recalculated grandTotal.
    """
    line_items = expense.get('lineItems', [])
    
    # Recalculate grand total
    new_grand_total = calculate_grand_total(line_items)

    return {
        'id': expense['id'],
        'grandTotal': new_grand_total
    }

def update_expense(expense_id, new_total):
    """
    Update the grandTotal for a single expense.
    """
    response = table.update_item(
        Key={'id': expense_id},
        UpdateExpression='SET grandTotal = :gt',
        ExpressionAttributeValues={
            ':gt': new_total
        },
        ReturnValues='UPDATED_NEW'
    )
    return response

def scan_and_fix_expenses():
    print(f"🔍 Scanning table: {table_name}...")

    # Start scanning expenses
    response = table.scan()
    items = response['Items']

    print(f"✅ Found {len(items)} items to check.")
    
    for expense in items:
        expense_id = expense['id']
        line_items = expense.get('lineItems', [])

        # Recalculate grandTotal
        new_grand_total = calculate_grand_total(line_items)

        # Get current grandTotal (handle None or missing cases)
        current_grand_total = expense.get('grandTotal')

        # Compare and update if necessary
        if current_grand_total != new_grand_total:
            print(f"🔧 Updating {expense_id}: {current_grand_total} → {new_grand_total}")
            update_expense(expense_id, new_grand_total)
        else:
            print(f"✅ {expense_id}: grandTotal already correct ({current_grand_total})")

    print("🎉 Done fixing grand totals!")

if __name__ == "__main__":
    scan_and_fix_expenses()
