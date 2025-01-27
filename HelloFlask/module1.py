import subprocess
import os

def dump_schema():
    # Use raw string (r"") to avoid escape issues
    output_file = os.path.join(r"C:\Users\guilh\Desktop\dump", "pg_dump_schema.sql")
    try:
        subprocess.run(
            [
                r"C:\Program Files\PostgreSQL\17\bin\pg_dump",
                "--schema-only",
                "-U", "postgres",
                "-h", "localhost",
                "-p", "5432",
                "TestDB"
            ],
            stdout=open(output_file, "w"),
            check=True
        )
        print(f"Schema backup completed: {output_file}")
    except Exception as e:
        print(f"Error during schema backup: {e}")

def dump_data():
    # Use raw string (r"") to avoid escape issues
    output_file2 = os.path.join(r"C:\Users\guilh\Desktop\dump", "pg_dump_database.sql")
    try:
        subprocess.run(
            [
                r"C:\Program Files\PostgreSQL\17\bin\pg_dump",
                "--data-only",
                "-U", "postgres",
                "-h", "localhost",
                "-p", "5432",
                "TestDB"
            ],
            stdout=open(output_file2, "w"),
            check=True
        )
        print(f"Data backup completed: {output_file2}")
    except Exception as e:
        print(f"Error during data backup: {e}")

if __name__ == "__main__":
    dump_schema()
    dump_data()
