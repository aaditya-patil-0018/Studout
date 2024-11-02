# Project Setup

## Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher

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

