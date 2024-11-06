# Project Overview

StudOut is a comprehensive platform designed to assist students in finding accommodation, services, and resources in their new city. The application aims to simplify the student experience by providing personalized suggestions based on user profiles and preferences. With features such as listings for flats, tiffin services, and community support, StudOut serves as a one-stop solution for all student needs.

## Key Features
- **User-Friendly Interface**: Easy navigation and a clean design for a seamless user experience.
- **Personalized Recommendations**: Tailored suggestions based on user preferences and needs.
- **Community Engagement**: Connect with other students to share experiences and tips.
- **Admin Dashboard**: Manage users and listings effectively through an intuitive admin interface.

## Technologies Used
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite

## Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher

# Project Setup

## Setup
1. Create a virtual environment:
   ```
   python -m venv .venv
   ```

2. Activate the virtual environment:
   - On Windows:
     ```
     .\.venv\Scripts\activate
     ```
   - On Unix or MacOS:
     ```
     source .venv/bin/activate
     ```
 
3. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Install Node.js dependencies:
   ```
   npm install
   ```

5. Start the Flask server:
   ```
   python main.py
   ```

6. Build CSS (run this command parallelly to <code>python main.py</code>):
   ```
   npm run buildcss
   ```

7. Open your web browser and go to `http://localhost:5000` to view the application.

