import pandas as pd
import json
from pathlib import Path

# CONFIG
CSV_FILE = "results (3).csv"
OUTPUT_DIR = "transformed_expenses_v2"
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

# Load CSV
df = pd.read_csv(CSV_FILE)

# Helper: Convert line items from DynamoDB format (if present) OR create from flat fields
def build_line_items(row):
    # If lineItems column exists and is not empty, try parsing it (likely in JSON string format)
    if pd.notna(row.get("lineItems")) and isinstance(row.get("lineItems"), str):
        try:
            parsed = json.loads(row.get("lineItems").replace('""', '"'))  # Fix double quotes
            # Convert DynamoDB format to normal JSON
            return [
                {
                    "category": item["M"]["category"]["S"],
                    "item": item["M"]["item"]["S"],
                    "unitCost": float(item["M"]["unitCost"]["N"]),
                    "quantity": int(item["M"]["quantity"]["N"]),
                    "lineTotal": float(item["M"]["lineTotal"]["N"])
                }
                for item in parsed
            ]
        except Exception as e:
            print(f"⚠️ Error parsing lineItems for {row['id']}: {e}")

    # If no lineItems, create from flat fields
    return [{
        "category": row.get("category", "Unknown"),
        "item": row.get("item", "Unknown"),
        "unitCost": float(row.get("unitCost", 0)),
        "quantity": int(row.get("quantity", 1)),
        "lineTotal": float(row.get("totalCost", 0))
    }]

# Iterate over each record and transform
transformed = []
for idx, row in df.iterrows():
    transformed_record = {
        "id": row["id"],
        "userId": row["userId"],
        "date": row["date"],
        "vendor": row["vendor"] if pd.notna(row["vendor"]) else "",
        "grandTotal": float(row.get("grandTotal", 0)),
        "description": row["description"] if pd.notna(row["description"]) else "",
        "receiptImageKey": row["receiptImageKey"] if pd.notna(row["receiptImageKey"]) else None,
        "lineItems": build_line_items(row),
        "owner": row["owner"],
        "_version": int(row["_version"]),
        "_lastChangedAt": int(row["_lastChangedAt"]),
        "_deleted": False if pd.isna(row["_deleted"]) else bool(row["_deleted"]),
        "createdAt": row["createdAt"],
        "updatedAt": row["updatedAt"]
    }

    # Save individual JSON file (optional)
    file_path = Path(OUTPUT_DIR) / f"{row['id']}.json"
    with open(file_path, 'w') as f:
        json.dump(transformed_record, f, indent=4)

    transformed.append(transformed_record)

# Save all transformed records to a single JSON file
with open(Path(OUTPUT_DIR) / "all_transformed_expenses.json", 'w') as f:
    json.dump(transformed, f, indent=4)

print(f"✅ Transformed {len(transformed)} records.")
print(f"✅ Output folder: {OUTPUT_DIR}")
