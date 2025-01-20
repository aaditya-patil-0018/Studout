import sqlite3
from sqlite3 import Error

class DatabaseManager:
    def __init__(self, db_name="stud_data.db"):
        """Initialize the database manager with the specified database name."""
        self.db_name = db_name
        self._create_tables()

    def _connect(self):
        """Create a database connection."""
        try:
            conn = sqlite3.connect(self.db_name)
            return conn
        except Error as e:
            print(f"Error connecting to database: {e}")
        return None

    def _create_tables(self):
        """Create necessary tables if they don't exist."""
        user_table = """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        listings_table = """
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            location TEXT NOT NULL,
            landmark TEXT,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            price REAL NOT NULL,
            amenities TEXT,
            display_picture TEXT,
            gallery_images TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        try:
            conn = self._connect()
            with conn:
                conn.execute(user_table)
                conn.execute(listings_table)
        except Error as e:
            print(f"Error creating tables: {e}")

    # --- User Management Methods ---
    def add_user(self, email, password):
        """Add a new user to the database."""
        query = "INSERT INTO users (email, password) VALUES (?, ?);"
        try:
            conn = self._connect()
            with conn:
                conn.execute(query, (email, password))
                return True
        except Error as e:
            print(f"Error adding user: {e}")
            return False

    def search_user(self, email):
        """Search for a user by email."""
        query = "SELECT * FROM users WHERE email = ?;"
        try:
            conn = self._connect()
            with conn:
                result = conn.execute(query, (email,)).fetchone()
                return result
        except Error as e:
            print(f"Error searching user: {e}")
            return None

    def validate_user(self, email, password):
        """Validate user credentials."""
        query = "SELECT * FROM users WHERE email = ? AND password = ?;"
        try:
            conn = self._connect()
            with conn:
                result = conn.execute(query, (email, password)).fetchone()
                return result is not None
        except Error as e:
            print(f"Error validating user: {e}")
            return False

    # --- Listings Management Methods ---
    def add_listing(self, **kwargs):
        """Add a new listing."""
        query = """
        INSERT INTO listings (listing_type, title, description, location, landmark, email, phone, price, amenities, display_picture, gallery_images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """
        try:
            conn = self._connect()
            with conn:
                conn.execute(query, (
                    kwargs["listing_type"],
                    kwargs["title"],
                    kwargs["description"],
                    kwargs["location"],
                    kwargs.get("landmark", ""),
                    kwargs["email"],
                    kwargs["phone"],
                    kwargs["price"],
                    kwargs.get("amenities", ""),
                    kwargs.get("display_picture", ""),
                    kwargs.get("gallery_images", ""),
                ))
                return True
        except Error as e:
            print(f"Error adding listing: {e}")
            return False

    def fetch_all_listings(self):
        """Fetch all listings from the database."""
        query = "SELECT * FROM listings;"
        try:
            conn = self._connect()
            with conn:
                return conn.execute(query).fetchall()
        except Error as e:
            print(f"Error fetching listings: {e}")
            return []

    def fetch_listing_by_id(self, listing_id):
        """Fetch a specific listing by its ID."""
        query = "SELECT * FROM listings WHERE id = ?;"
        try:
            conn = self._connect()
            with conn:
                return conn.execute(query, (listing_id,)).fetchone()
        except Error as e:
            print(f"Error fetching listing: {e}")
            return None

    def remove_listing(self, listing_id):
        """Remove a listing by its ID."""
        query = "DELETE FROM listings WHERE id = ?;"
        try:
            conn = self._connect()
            with conn:
                conn.execute(query, (listing_id,))
                return True
        except Error as e:
            print(f"Error removing listing: {e}")
            return False

    # --- Utility Methods ---
    def execute_query(self, query, params=None):
        """Execute a custom query with optional parameters."""
        try:
            conn = self._connect()
            with conn:
                cursor = conn.execute(query, params or [])
                return cursor.fetchall()
        except Error as e:
            print(f"Error executing query: {e}")
            return []

    def execute_action(self, query, params=None):
        """Execute a custom query with optional parameters for actions like INSERT/UPDATE/DELETE."""
        try:
            conn = self._connect()
            with conn:
                conn.execute(query, params or [])
                return True
        except Error as e:
            print(f"Error executing action: {e}")
            return False