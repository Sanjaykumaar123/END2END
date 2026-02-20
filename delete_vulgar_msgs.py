import sqlite3
import os

# Try both possible db locations
db_paths = [
    'sentinelnet.db',
    'backend/sentinelnet.db',
    os.path.join(os.path.dirname(__file__), 'sentinelnet.db'),
    os.path.join(os.path.dirname(__file__), 'backend', 'sentinelnet.db'),
]

conn = None
for path in db_paths:
    if os.path.exists(path):
        print(f"Found DB at: {path}")
        conn = sqlite3.connect(path)
        break

if not conn:
    print("ERROR: Could not find sentinelnet.db")
    exit(1)

cursor = conn.cursor()

# Show all messages first
print("\n--- CURRENT MESSAGES ---")
cursor.execute("SELECT id, sender_id, content_encrypted, channel_id, timestamp FROM messages ORDER BY id DESC LIMIT 10")
rows = cursor.fetchall()
for row in rows:
    print(row)

# Delete the last 2 messages (highest IDs)
print("\n--- DELETING LAST 2 MESSAGES ---")
cursor.execute("""
    DELETE FROM messages 
    WHERE id IN (
        SELECT id FROM messages ORDER BY id DESC LIMIT 2
    )
""")
conn.commit()
print(f"Deleted {cursor.rowcount} message(s).")

# Verify
print("\n--- MESSAGES AFTER DELETION ---")
cursor.execute("SELECT id, sender_id, content_encrypted, channel_id, timestamp FROM messages ORDER BY id DESC LIMIT 10")
rows = cursor.fetchall()
for row in rows:
    print(row)

conn.close()
print("\nDone!")
