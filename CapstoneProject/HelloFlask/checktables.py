import psycopg2

def check_table_schema(table_name):
    conn = psycopg2.connect(
        dbname="TestDB",
        user="postgres",
        password="#aH6TR5fkcdx99",
        host="localhost",
        port="5432"
    )
    cursor = conn.cursor()

    query = """
    SELECT column_name, data_type, is_nullable, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = %s
    """
    
    cursor.execute(query, (table_name,))
    columns = cursor.fetchall()
    
    print(f"Schema for table '{table_name}':")
    for column in columns:
        print(f"Column Name: {column[0]}, Data Type: {column[1]}, Nullable: {column[2]}, Max Length: {column[3]}")

    cursor.close()
    conn.close()

# Prompt the user to enter the table name
if __name__ == "__main__":
    table_name = input("Enter the table name to check the schema: ")
    check_table_schema(table_name)

