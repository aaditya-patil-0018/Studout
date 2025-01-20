from flask import Flask, render_template, request, jsonify, session, request
import sqlite3
import json

app = Flask(__name__)
app.secret_key = 'Student_Project_2024'

# CREATE TABLE IF NOT EXISTS listings (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             listing_type TEXT NOT NULL,
#             title TEXT NOT NULL,
#             description TEXT NOT NULL,
#             location TEXT NOT NULL,
#             landmark TEXT,
#             email TEXT NOT NULL,
#             phone TEXT NOT NULL,
#             price REAL NOT NULL,
#             amenities TEXT,
#             display_picture TEXT,
#             gallery_images TEXT
# )

@app.route("/")
def landing():
    return render_template("landing.html", is_landing_page=True)

@app.route("/home")
def home():
    return render_template("user_home.html")

@app.route("/signin")
def signin():
    return render_template("signin.html", is_auth_page=True)

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "GET":
        return render_template("signup.html", is_auth_page=True)
    elif request.method == "POST":
        return render_template("signup.html")

@app.route("/forgotPassword")
def forgotPassword():
    return render_template("forgetPassword.html", is_auth_page=True)

@app.route("/onboarding")
def onboarding():
    return render_template("onboarding.html")

@app.route("/getting-started")
def getting_started():
    return render_template("getting_started.html")

@app.route("/user-profile-setup-0")
def user_profile_setup_0():
    return render_template("user_profile_setup_0.html", is_profile_setup=True)

@app.route("/user-profile-setup-1")
def user_profile_setup_1():
    return render_template("user_profile_setup_1.html", is_profile_setup=True)

@app.route("/user-profile-setup-2")
def user_profile_setup_2():
    return render_template("user_profile_setup_2.html", is_profile_setup=True)

@app.route("/user-profile-setup-3", methods=['GET', 'POST'])
def user_profile_setup_3():
    if request.method == 'POST':
        # Get all the data from the session storage till now and operate on sqlite db here
        budget_preferences = request.json
        session['budget_preferences'] = json.dumps(budget_preferences)

        # For now, we'll just return a success response
        return jsonify({"success": True})
    return render_template("user_profile_setup_3.html", is_profile_setup=True)

@app.route("/user-products-listing")
def user_products_listing():
    service = request.args.get('service', '')
    return render_template("user_products_listing.html", service=service, is_products_listing=True)

@app.route("/user-product-details", methods=['GET', 'POST'])
def user_product_details():
    # using POST to send the product id to the backend and get the product details using this page
    if request.method == 'POST':
        return jsonify({"success": True})
    return render_template("user_product_details.html")

@app.route("/user-profile")
def user_profile():
    return render_template("user_profile.html")

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

@app.route("/seller-profile-setup-1")
def seller_profile_setup_1():
    return render_template("seller_profile_setup_1.html", is_profile_setup=True)

@app.route("/seller-profile-setup-2")
def seller_profile_setup_2():
    return render_template("seller_profile_setup_2.html", is_profile_setup=True)

@app.route("/seller/dashboard")
def seller_dashboard():
    return render_template("seller_dashboard.html")

@app.route("/seller/listings")
def seller_listings():
    return render_template("seller_listings.html")

@app.route("/seller/listing-detail")
def seller_listing_detail():
    return render_template("seller_listing_detail.html")

@app.route("/seller/profile")
def seller_profile():
    return render_template("seller_profile.html")

@app.route('/seller/add-listing', methods=['GET', 'POST'])
def add_listing():
    return render_template('add_listing.html')

@app.route("/admin/dashboard")
# @admin_required  
def admin_dashboard():
    return render_template("admin_dashboard.html")

@app.route("/admin/users")
# @admin_required  
def admin_users():
    return render_template("admin_users.html")

@app.route("/admin/listings")
# @admin_required  
def admin_listings():
    return render_template("admin_listings.html")

@app.route("/admin/profile")
# @admin_required  
def admin_profile():
    return render_template("admin_profile.html")

@app.route('/admin/analytics')
# @admin_required  
def admin_analytics():
    return render_template('admin_analytics.html')

@app.route("/logout")
def logout():
    return render_template("logout.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', is_error_page=True, error=e), 404

if __name__ == "__main__":
    app.run(debug=True)
