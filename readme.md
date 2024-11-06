# Project Overview

StudOut is a comprehensive platform designed to assist students in finding accommodation, services, and resources in their new city. The application aims to simplify the student experience by providing personalized suggestions based on user profiles and preferences. With features such as listings for flats, tiffin services, and community support, StudOut serves as a one-stop solution for all student needs.

## Key Features
- **🖥️ User-Friendly Interface**: Easy navigation and a clean design for a seamless user experience.
- **🎯 Personalized Recommendations**: Tailored suggestions based on user preferences and needs.
- **🤝 Community Engagement**: Connect with other students to share experiences and tips.
- **🛠️ Admin Dashboard**: Manage users and listings effectively through an intuitive admin interface.

## Technologies Used

- **Backend**: Flask (Python) <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python Logo" width="30" />
- **Frontend**: HTML, CSS, JavaScript <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" alt="HTML Logo" width="30" /> <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" alt="CSS Logo" width="30" /> <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JavaScript Logo" width="30" />
- **Database**: SQLite <img src="https://www.sqlite.org/images/sqlite370_banner.gif" alt="SQLite Logo" width="100" />

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

