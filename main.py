# importing all the needed modules
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from flask import session
from flask import redirect, url_for
from DBManager import DatabaseManager
from werkzeug.utils import secure_filename
import json
import os

app = Flask(__name__)
app.secret_key = 'Student_Project_2024'
UPLOAD_FOLDER = "static/uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# example of the json data file
'''
"full_name": "example",
"gender": "prefer_not_to_say",
"dob": "2000-01-01",
"college": "Guru Gobind Singh Polytechnic",
"area_of_residence": "Indira Nagar, Nashik",
"email": "example@gmail.com",
"mobile_number": "9876543210",
"profile_picture": "static/uploads/1_inhousetech.png",
"services": [
    "rental_flats",
    "tiffin_service",
    "second_hand_vehicles"
],
"buget_preference": "custom",
"budget": "12000"
'''

####################
# HELPER FUNCTIONS #
####################

def get_user_from_json(userid):
    userid=str(userid)
    with open('users.json', 'r') as rfile:
        data = json.load(rfile)
    return data[userid]

def add_user_to_json(userid):
    userid=str(userid)
    with open('users.json', 'r') as rfile:
        data = json.load(rfile)
    data[userid] = {
        "started": False
    }
    ndata = json.dumps(data, indent=4)
    with open("users.json", "w") as wfile:
        wfile.write(ndata)

def has_started(userid):
    userid=str(userid)
    with open('users.json', 'r') as file:
        data = json.load(file)
    session["started"] = data[userid]["started"]
    return data[userid]["started"]

def change_started_stautus(userid):
    userid=str(userid)
    with open('users.json', 'r') as file:
        data = json.load(file)
    if data[userid]["started"]:
        data[userid]["started"] = False
    else:
        data[userid]["started"] = True
    new_data = json.dumps(data, indent=4)
    with open("users.json", "w") as file:
        file.write(new_data)

def save_to_json(user_id, data):
    """Save user data to JSON database."""
    user_id = str(user_id)
    with open("users.json", 'r') as f:
        db = json.load(f)
    for i in data:
        db[user_id][i] = data[i]
    with open("users.json", 'w') as f:
        json.dump(db, f, indent=4)

# database schemas
'''
# Database schema for reference:
# CREATE TABLE IF NOT EXISTS listings (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     listing_type TEXT NOT NULL,
#     title TEXT NOT NULL,
#     description TEXT NOT NULL,
#     location TEXT NOT NULL,
#     landmark TEXT,
#     email TEXT NOT NULL,
#     phone TEXT NOT NULL,
#     price REAL NOT NULL,
#     amenities TEXT,
#     display_picture TEXT,
#     gallery_images TEXT
# );
'''

##############
# BASE PAGES #
##############

# landing page, that we see first when we access the website
@app.route("/")
def landing():
    try:
        if "user-in" in session:
            pass
        else:
            session["user-in"] = False
    except:
        session["user-in"] = False
    with open("listing.json", 'r') as f:
        data = json.load(f)
    with open("reviews.json", "r") as rf:
        reviews = json.load(rf)
    return render_template("landing.html", is_landing_page=not session["user-in"], data=data, reviews=reviews)

# trail home page
'''
# @app.route("/home")
# def home():
#     return render_template("user_home.html")
'''

@app.route("/signin", methods=["GET", "POST"])
def signin():
    if session["user-in"] == False:
        if request.method == "GET":
            return render_template("signin.html", is_auth_page=True, msg="")
        elif request.method == "POST":
            data = {
                "email": request.form.get("email"),
                "password": request.form.get("password")
            }
            db = DatabaseManager()
            if db.validate_user(data["email"], data["password"]):
                session["email"] = data["email"]
                user_data = db.search_user(data["email"])
                user_id = user_data[0]
                if not has_started(user_id):
                    return redirect(url_for("user_profile_setup_1"))
                else:
                    return redirect(url_for("user_products_listing"))
            else:
                msg = "User not present! Register"
                return render_template("signin.html", msg=msg)
    else:
        return "<h1>User already logged in</h1>"

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if session["user-in"] == False:
        if request.method == "GET":
            return render_template("signup.html", msg="")
        elif request.method == "POST":
            email = request.form.get("signupEmail")
            password = request.form.get("password")
            db = DatabaseManager()
            if db.add_user(email, password):
                session["user-in"] = True
                session["email"] = email
                user_data = db.search_user(session["email"])
                user_id = user_data[0]
                add_user_to_json(user_id)
                return redirect(url_for("getting_started"))# signup successful
            else:
                msg = "User already present! Login"
                return render_template("signup.html", is_auth_page=True, msg=msg)
            return render_template("signup.html", is_auth_page=True)
    else:
        return "<h1>User already logged in</h1>"

@app.route("/forgotPassword")
def forgot_password():
    return render_template("forgetPassword.html", is_auth_page=True)

@app.route("/logout")
def logout():
    session["started"] = False
    session["user-in"] = False
    session["email"] = ""
    return redirect(url_for("landing"))

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html", is_error_page=True, error=e), 404


#######################
# USERS FUNCTIONALITY #
#######################

# trail onboarding
'''
# @app.route("/onboarding")
# def onboarding():
#     return render_template("onboarding.html")
'''

@app.route("/getting-started")
def getting_started():
    if "started" in session and session["started"] == True:
        return "<h1>Already Started...</h1>"
    else:
        session["started"] = False
    return render_template("getting_started.html")

# Trial Route
'''
# @app.route("/user-profile-setup-0")
# def user_profile_setup_0():
#     return render_template(f"user_profile_setup_0.html", is_profile_setup=True)
'''

@app.route("/user-profile-setup-1", methods=["GET", "POST"])
def user_profile_setup_1():
    db = DatabaseManager()
    user_data = db.search_user(session["email"])
    user_id = user_data[0]
    if "started" in session:
        if not has_started(user_id):
            if request.method == "GET":
                return render_template(f"user_profile_setup_1.html", is_profile_setup=True)
            elif request.method == "POST":
                """Handle image upload and save user data."""
                if 'profile_picture' not in request.files:
                    return jsonify({"error": "No file part in the request"}), 400

                file = request.files['profile_picture']
                if file.filename == '':
                    return jsonify({"error": "No file selected"}), 400
                if file:
                    # Save the file
                    filename = f"{user_id}_{file.filename}"
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    # Save user data to the database
                    user_data = {
                        "full_name": request.form.get("full_name"),
                        "gender": request.form.get("gender"),
                        "dob": request.form.get("dob"),
                        "college": request.form.get("college"),
                        "area_of_residence": request.form.get("area_of_residence"),
                        "email": request.form.get("email"),
                        "mobile_number": request.form.get("mobile_number"),
                        "profile_picture": file_path
                    }
                    save_to_json(user_id, user_data)
                    return redirect(url_for("user_profile_setup_2"))
                return "ERROR!"
        else:
            return "<h1>Already Registered!</h1>"
    else:
        session["started"] = False
        return redirect(url_for("user_profile_setup_1"))

'''
# @app.route("/user-profile-setup-2", methods=["GET", "POST"])
# def user_profile_setup_2():
#     db = DatabaseManager()
#     user_data = db.search_user(session["email"])
#     user_id = user_data[0]
#     if "started" in session:
#         if not has_started(user_id):
#             if request.method == "GET":
#                 return render_template(f"user_profile_setup_2.html", is_profile_setup=True)
#             elif request.method == "POST":
#                 services = request.form
#                 print(services)
#                 if len(services) != 0:
#                     data = {
#                         "services": services
#                     }
#                     save_to_json(user_id, data)
#                     return redirect(url_for("user_profile_setup_3"))
#                 else:
#                     return "Please select atleast one service"
#         else:
#             return "<h1>Already Registered!</h1>"
#     else:
#         redirect(url_for("user_profile_setup_1.html"))
#     return render_template(f"user_profile_setup_2.html", is_profile_setup=True)
'''

@app.route("/user-profile-setup-2", methods=["GET", "POST"])
def user_profile_setup_2():
    db = DatabaseManager()
    user_data = db.search_user(session["email"])
    user_id = user_data[0]

    if "started" in session:
        if not has_started(user_id):
            if request.method == "GET":
                return render_template("user_profile_setup_2.html", is_profile_setup=True)
            
            elif request.method == "POST":
                # Handle JSON data from the request
                try:
                    services = request.get_json()
                    print(services)

                    if services and "selectedServices" in services and len(services["selectedServices"]) > 0:
                        data = {
                            "services": services["selectedServices"]
                        }
                        save_to_json(user_id, data)
                        return redirect(url_for("user_profile_setup_3"))
                    else:
                        return "Please select at least one service", 400
                except Exception as e:
                    print("Error processing JSON:", e)
                    return "Invalid request format", 400
        else:
            return "<h1>Already Registered!</h1>"
    else:
        return redirect(url_for("user_profile_setup_1"))

@app.route("/user-profile-setup-3", methods=["GET", "POST"])
def user_profile_setup_3():
    db = DatabaseManager()
    user_data = db.search_user(session["email"])
    user_id = user_data[0]
    if "started" in session:
        if not has_started(user_id):
            if request.method == "POST":
                # budget_preferences = request.form.get("budgetPreference")
                budget_preferences = request.get_json()
                data = {
                    "buget_preference": budget_preferences["budget_preference"]
                }
                if data["buget_preference"] == "custom":
                    budget = budget_preferences["budgetValue"]
                    data["budget"] = budget
                save_to_json(user_id, data)
                change_started_stautus(user_id)
                return redirect(url_for("user_profile"))
            return render_template("user_profile_setup_3.html", is_profile_setup=True)
        else:
            return "<h1>User already registered!</h1>"
    else:
        return redirect(url_for("user_profile_setup_1"))

@app.route("/user-products-listing", methods=["GET", "POST"])
def user_products_listing():
    if request.method == "GET":
        service = request.args.get("service", "")
        if service == "libraries":
            service = "book"
        if service == "second_hand":
            service = "vehicle"
        print(service)
        with open("listing.json", "r") as f:
            ndata = json.load(f)
        data = {}
        if service != "":
            for d in ndata:
                for j in ndata[d]:
                    if j["listing_type"] == service:
                        if d not in data:
                            data[d] = []
                        data[d].append(j)
        else:
            data=ndata
        return render_template("user_products_listing.html", service=service, data=data, is_products_listing=True)
    else:
        max_price = request.form.get('max_price')
        category = request.form.get('category')
        print(category)
        with open("listing.json", "r") as f:
            ndata = json.load(f)
        data = {}
        if str(category) == "None":
            for d in ndata:
                for j in ndata[d]:
                    if int(j["price"]) <= int(max_price):
                        if d not in data:
                            data[d] = []
                        data[d].append(j)
        else:
            if category == "Tiffin Services":
                category = "tiffin"
            elif category == "Flats & PGs":
                category = "flat_pg"
            elif category == "Libraries":
                category = "book"
            for d in ndata:
                for j in ndata[d]:
                    if int(j["price"]) <= int(max_price) and j["listing_type"] == category:
                        if d not in data:
                            data[d] = []
                        data[d].append(j)
        # return data
        return render_template("user_products_listing.html", service=category, data=data, is_products_listing=True)
        return f"Max Price: {max_price}, Selected Category: {category}"

@app.route("/user-product-details/<userid>/<listingid>", methods=["GET", "POST"])
@app.route("/user-product-details", methods=["GET", "POST"])
def user_product_details(userid='', listingid=''):
    if request.method == "POST":
        return jsonify({"success": True})
    with open("listing.json", "r") as f:
        data = json.load(f)[str(userid)][int(listingid)]

    # Get seller data based on userid from URL
    sdata = get_user_from_json(userid)
    
    print(data["gallery_images"])
    gdata = data["gallery_images"]
    return render_template("user_product_details.html", data=data, sdata=sdata, gdata=gdata)

@app.route("/user-profile")
def user_profile():
    db = DatabaseManager()
    user_data = db.search_user(session["email"])
    user_id = user_data[0]
    print(user_id)
    if "started" in session:
        if has_started(user_id):
            data = get_user_from_json(user_id)
            print(data)
            return render_template("user_profile.html", data=data)
    return redirect(url_for('user_profile_setup_1'))

@app.route("/user-notification")
def user_notification():
    return render_template("user_notification.html")

@app.route("/user-testimonials")
def user_testimonials():
    return render_template("user_testimonials.html")

@app.route("/contact-us")
def contact_us():
    return render_template("contact_us.html")

@app.route("/about-us")
def about_us():
    return render_template("about_us.html")

##########################
# SELLER FUNCTIONALITIES #
##########################

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/seller-profile-setup-1", methods=["GET", "POST"])
def seller_profile_setup_1():
    if request.method == "POST":
        
        # Collect form data
        form_data = {
            "full_name": request.form["full-name"],
            "gender": request.form["gender"],
            "dob": request.form["dob"],
            "business_name": request.form["business_name"],
            "business_description": request.form["business_description"],
            "area_of_residence": request.form["area_of_residence"],
            "email": request.form["email"],
            "mobile_number": request.form["mobile_number"],
        }

        # Handle image upload
        image = request.files["profile_picture"]
        if image and allowed_file(image.filename):
            # Save the image to the upload folder
            image_filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            image.save(image_path)
            form_data["profile_picture"] = image_path  # Store the image file path in the form data

        db = DatabaseManager()
        user_data = db.search_user(session["email"])
        user_id = user_data[0]

        # Read the existing JSON file
        try:
            with open("sellers.json", "r") as json_file:
                data = json.load(json_file)
        except FileNotFoundError:
            data = {}
        
        user_id = str(user_id)
        # Update the JSON data with the new form data
        data[user_id] = form_data

        # Write the updated data back to the JSON file
        with open("sellers.json", "w") as json_file:
            json.dump(data, json_file, indent=4)

        return "Profile information and image saved successfully!"

    return render_template("seller_profile_setup_1.html", is_profile_setup=True)

@app.route("/seller-profile-setup-2", methods=["GET", "POST"])
def seller_profile_setup_2():
    if request.method == "POST":
        # Collect form data safely
        form_data = {
            "government_id": request.form.get("government-id", None),  # Use .get() to avoid KeyError
            "terms_conditions": request.form.get("terms-conditions", False) == "on",
        }

        # Handle uploaded file
        image = request.files.get("seller_id_proof")
        if image and allowed_file(image.filename):
            image_filename = secure_filename(image.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            image.save(image_path)
            form_data["id_image"] = image_path  # Save image path

        # Assume user ID is retrieved from session
        db = DatabaseManager()
        user_data = db.search_user(session["email"])
        user_id = str(user_data[0])  # Convert user_id to string to ensure consistency

        # Read and update sellers.json file
        try:
            with open("sellers.json", "r") as json_file:
                data = json.load(json_file)
        except FileNotFoundError:
            data = {}

        # Merge new data with existing data for the user
        if user_id in data:
            data[user_id].update(form_data)  # Update existing keys/values for the user
        else:
            data[user_id] = form_data  # Create new entry for the user

        # Write the updated data back to the JSON file
        with open("sellers.json", "w") as json_file:
            json.dump(data, json_file, indent=4)

        # Return JSON response
        return jsonify({"message": "Profile information and image saved successfully!"})

    return render_template("seller_profile_setup_2.html", is_profile_setup=True)

@app.route("/seller/dashboard")
def seller_dashboard():
    # check if the email is present in the seller list
    with open('sellers.json', 'r') as rfile:
        sd = json.load(rfile)
        sellerdata = [sd[i]['email'] for i in sd]
    
    # check if the user is present in seller data or not
    if session["email"] in sellerdata:
        c = 0
        for i in sd:
            if sd[i]["email"] == session["email"]:
                c = i
                break
        
        # Get seller's listings
        with open('listing.json', 'r') as lfile:
            listings_data = json.load(lfile)
            seller_listings = listings_data.get(str(c), [])
        
        # Calculate dashboard stats
        total_listings = len(seller_listings)
        active_listings = len([l for l in seller_listings if l['status'] == 'show'])
        
        # Add stats to seller data
        sd[str(c)]['total_listings'] = total_listings
        sd[str(c)]['active_listings'] = active_listings
        sd[str(c)]['listings'] = seller_listings
        
        return render_template("seller_dashboard.html", sd=sd[str(c)])
    else:
        return render_template("seller_get_started.html")

@app.route("/seller/listings")
def seller_listings():
    # check if the email is present in the seller list
    with open('sellers.json', 'r') as rfile:
        sd = json.load(rfile)
        sellerdata = [sd[i]['email'] for i in sd]
    
    # check if the user is present in seller data or not
    if session["email"] in sellerdata:
        c = 0
        for i in sd:
            if sd[i]["email"] == session["email"]:
                c = i
                break
        
        # Get seller's listings
        with open('listing.json', 'r') as lfile:
            listings_data = json.load(lfile)
            seller_listings = listings_data.get(str(c), [])
        
        # Group listings by type
        listings_by_type = {
            'flat_pg': [],
            'tiffin': [],
            'book': [],
            'library': [],
            'vehicle': []
        }
        
        for listing in seller_listings:
            listing_type = listing.get('listing_type', '')
            if listing_type in listings_by_type:
                listings_by_type[listing_type].append(listing)
        
        print(listings_by_type)
        print(sd[str(c)])

        return render_template("seller_listings.html",
                             listings_by_type=listings_by_type,
                             seller_data=sd[str(c)])
    else:
        return render_template("seller_get_started.html")

@app.route("/seller/listing-detail")
def seller_listing_detail():
    return render_template("seller_listing_detail.html")

@app.route("/seller/profile")
def seller_profile():
    return render_template("seller_profile.html")

@app.route("/seller/add-listing", methods=["GET", "POST"])
def add_listing():
    if request.method == "GET":
        return render_template("add_listing.html", is_add_listing=True)

    elif request.method == "POST":
        db = DatabaseManager()
        user_data = db.search_user(session['email'])
        user_id = str(user_data[0])  # Assuming the user ID is stored in session
        if not user_id:
            return jsonify({"error": "User not logged in"}), 401  # Return error as JSON
        
        listing_data = {
            "listing_type": request.form.get("listingType"),
            "title": request.form.get("title"),
            "description": request.form.get("description"),
            "location": request.form.get("location"),
            "landmark": request.form.get("landmark"),
            "email": request.form.get("email"),
            "phone": request.form.get("phone"),
            "price": request.form.get("price"),
            "amenities": request.form.get("amenities", ""),
            "status": "show",
        }

        # Handle file uploads
        if 'displayPicture' in request.files:
            file = request.files['displayPicture']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                listing_data["display_picture"] = file_path

        if 'galleryImages' in request.files:
            gallery_files = request.files.getlist('galleryImages')
            gallery_paths = []
            for gallery_file in gallery_files:
                if gallery_file and allowed_file(gallery_file.filename):
                    filename = secure_filename(gallery_file.filename)
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    gallery_file.save(file_path)
                    gallery_paths.append(file_path)
            listing_data["gallery_images"] = json.dumps(gallery_paths)

        # Store listing data in listing.json
        try:
            # Load existing listings from the JSON file
            if os.path.exists("listing.json"):
                with open("listing.json", "r") as file:
                    listings_data = json.load(file)
            else:
                listings_data = {}

            # Add new listing under the user ID key
            if str(user_id) not in listings_data:
                listings_data[user_id] = []

            listings_data[str(user_id)].append(listing_data)

            # Save updated listings data back to the JSON file
            with open("listing.json", "w") as file:
                json.dump(listings_data, file, indent=4)

            return jsonify({"success": "Listing added successfully!"}), 200  # Return success as JSON
        except Exception as e:
            print("Error adding listing:", e)
            return jsonify({"error": "An error occurred while adding the listing."}), 500  # Return error as JSON


#########################
# ADMIN FUNCTIONALITIES #
#########################

@app.route("/admin", methods=["GET", "POST"])
def admin():
    # Load admin credentials from admin.json
    try:
        with open("admin.json", "r") as json_file:
            admin_data = json.load(json_file)
    except FileNotFoundError:
        return jsonify({"error": "Admin data file not found!"}), 500

    if request.method == "POST":
        # Get form data
        email = request.form.get("email")
        password = request.form.get("password")

        # Check if email and password match admin credentials
        if email == admin_data["email"] and password == admin_data["password"]:
            session["admin"] = True  # Set admin session
            return redirect("/admin/dashboard")  # Redirect to admin dashboard
        else:
            session["admin"] = False  # Reset admin session
            return jsonify({"message": "Invalid email or password"}), 401

    return render_template("admin.html")

@app.route("/admin/dashboard")
def admin_dashboard():
    if "admin" not in session:
        session["admin"] = False
    if session["admin"] == True:
        with open('users.json', 'r') as rfile:
            userdata = json.load(rfile)
        with open('sellers.json', 'r') as rfile:
            sellerdata = json.load(rfile)
        return render_template("admin_dashboard.html", tuser=len(userdata), tseller=len(sellerdata))
    else:
        return redirect(url_for("admin"))

@app.route("/admin/users")
def admin_users():
    if "admin" not in session:
        session["admin"] = False
    if session["admin"] == True:
        with open('users.json', 'r') as rfile:
            userdata = json.load(rfile)
        with open('sellers.json', 'r') as rfile:
            sellerdata = json.load(rfile)
        return render_template("admin_users.html", user=userdata, seller=sellerdata)
    else:
        return redirect(url_for("admin"))

@app.route("/admin/<usertype>/<userid>/changestatus")
def admin_user_change_status(usertype, userid):
    with open(f'{usertype}.json', 'r') as file:
        data = json.load(file)
    
    if userid in data:
        if data[userid]['status'] == "active":
            data[userid]['status'] = "pause"
        else:
            data[userid]['status'] = "active"
        with open(f"{usertype}.json", 'w') as file:
            json.dump(data, file, indent=4)
        print(f"Status updated successfully for user {userid}.")
    else:
        print("User ID not found.")
    return redirect(url_for("admin_users"))

@app.route("/admin/listings/tweak/<idn>/<int:number>")
def admin_listings_tweak(idn, number):
    with open("listing.json", "r") as f:
        data = json.load(f)
    if data[idn][number-1]["status"] == "show":
        data[idn][number-1]["status"] = "pause"
    else:
        data[idn][number-1]["status"] = "show"
    with open("listing.json", "w") as f:
        json.dump(data, f, indent=4)
    return redirect(url_for("admin_listings"))

@app.route("/admin/listings")
def admin_listings():
    if "admin" not in session:
        session["admin"] = False
    if session["admin"] == True:
        with open("listing.json", "r") as f:
            data = json.load(f)
            data_len = len(data)
        return render_template("admin_listings.html", d=data, dl=data_len)
    else:
        return render_template(url_for("admin"))

@app.route("/admin/profile")
def admin_profile():
    if "admin" not in session:
        session["admin"] = False
    if session["admin"] == True:
        return render_template("admin_profile.html")
    else:
        return render_template(url_for("admin"))

@app.route("/admin/analytics")
def admin_analytics():
    if "admin" not in session:
        session["admin"] = False
    if session["admin"] == True:
        return render_template("admin_analytics.html")
    else:
        return render_template(url_for("admin"))


##################
# RUNNING SERVER #
##################

if __name__ == "__main__":
    app.run(debug=True)
