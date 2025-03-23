import pandas as pd
from tabulate import tabulate
import json
import os
import sys

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def load_and_display_json(file_path, page_size=10, current_page=0, selected_columns=None):
    try:
        # Read JSON file
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Special handling for listing.json
        if file_path == 'listing.json':
            # Flatten the nested structure
            flattened_data = []
            for seller_id, listings in data.items():
                for listing in listings:
                    listing['seller_id'] = seller_id
                    flattened_data.append(listing)
            df = pd.DataFrame(flattened_data)
            
            # Reorder columns to show important information first
            important_cols = ['seller_id', 'listing_type', 'title', 'price', 'location', 'status']
            other_cols = [col for col in df.columns if col not in important_cols]
            df = df[important_cols + other_cols]
        else:
            # Handle other JSON files as before
            if isinstance(data, dict):
                df = pd.DataFrame.from_dict(data, orient='index')
            else:
                df = pd.DataFrame(data)
        
        # Select columns if specified
        if selected_columns:
            available_columns = df.columns.tolist()
            if not all(col in available_columns for col in selected_columns):
                print("Some columns not found in the database.")
                return
            df = df[selected_columns]
        
        # Calculate pagination
        total_rows = len(df)
        total_pages = (total_rows + page_size - 1) // page_size
        start_idx = current_page * page_size
        end_idx = min(start_idx + page_size, total_rows)
        
        # Get the current page
        current_df = df.iloc[start_idx:end_idx]
        
        # Display the table
        print(f"\n{'='*50}")
        print(f"Contents of {os.path.basename(file_path)}")
        print(f"{'='*50}")
        
        # Special formatting for listing.json
        if file_path == 'listing.json':
            # Group by listing type
            listing_types = current_df['listing_type'].unique()
            for listing_type in listing_types:
                type_df = current_df[current_df['listing_type'] == listing_type]
                print(f"\n{listing_type.upper()} Listings:")
                print(tabulate(type_df, headers='keys', tablefmt='simple', showindex=True))
        else:
            print(tabulate(current_df, headers='keys', tablefmt='simple', showindex=True))
        
        print(f"\nPage {current_page + 1} of {total_pages}")
        print(f"Showing rows {start_idx + 1} to {end_idx} of {total_rows}")
        print(f"{'='*50}\n")
        
        return total_pages
        
    except Exception as e:
        print(f"Error reading {file_path}: {str(e)}")
        return 0

def get_column_selection(df):
    print("\nAvailable columns:")
    for i, col in enumerate(df.columns, 1):
        print(f"{i}. {col}")
    
    while True:
        try:
            selection = input("\nEnter column numbers to display (comma-separated) or 'all' for all columns: ")
            if selection.lower() == 'all':
                return None
            
            columns = [df.columns[int(x.strip()) - 1] for x in selection.split(',')]
            return columns
        except (ValueError, IndexError):
            print("Invalid selection. Please try again.")

def view_database(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if file_path == 'listing.json':
            # Flatten the nested structure
            flattened_data = []
            for seller_id, listings in data.items():
                for listing in listings:
                    listing['seller_id'] = seller_id
                    flattened_data.append(listing)
            df = pd.DataFrame(flattened_data)
        else:
            if isinstance(data, dict):
                df = pd.DataFrame.from_dict(data, orient='index')
            else:
                df = pd.DataFrame(data)
        
        # Get column selection
        selected_columns = get_column_selection(df)
        
        current_page = 0
        while True:
            clear_screen()
            total_pages = load_and_display_json(file_path, page_size=10, current_page=current_page, selected_columns=selected_columns)
            
            print("\nNavigation options:")
            print("n - Next page")
            print("p - Previous page")
            print("c - Change columns")
            print("q - Quit viewing")
            
            choice = input("\nEnter your choice: ").lower()
            
            if choice == 'n' and current_page < total_pages - 1:
                current_page += 1
            elif choice == 'p' and current_page > 0:
                current_page -= 1
            elif choice == 'c':
                selected_columns = get_column_selection(df)
                current_page = 0
            elif choice == 'q':
                break
            else:
                print("Invalid choice or no more pages in that direction.")
                input("Press Enter to continue...")
    except Exception as e:
        print(f"Error viewing database: {str(e)}")
        input("Press Enter to continue...")

def main():
    # List of JSON files to process
    json_files = [
        'users.json',
        'listing.json',
        'sellers.json',
        'admin.json'
    ]
    
    while True:
        clear_screen()
        print("Database Viewer")
        print("===============")
        print("\nAvailable options:")
        print("1. View users database")
        print("2. View listing database")
        print("3. View sellers database")
        print("4. View admin database")
        print("5. Exit")
        
        choice = input("\nEnter your choice (1-5): ")
        
        if choice == '1':
            view_database('users.json')
        elif choice == '2':
            view_database('listing.json')
        elif choice == '3':
            view_database('sellers.json')
        elif choice == '4':
            view_database('admin.json')
        elif choice == '5':
            print("\nThank you for using Database Viewer!")
            break
        else:
            print("\nInvalid choice. Please try again.")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main() 