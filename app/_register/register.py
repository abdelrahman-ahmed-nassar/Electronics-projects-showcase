#!/usr/bin/env python
# Check for required packages and install if needed
try:
    import requests
except ImportError:
    import sys
    import subprocess
    print("The 'requests' package is missing. Attempting to install it...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
        print("Successfully installed 'requests' package")
        import requests
    except Exception as e:
        print(f"Failed to install 'requests' package. Error: {e}")
        print("\nPlease install it manually with the command:")
        print("    pip install requests")
        print("or")
        print("    python -m pip install requests")
        sys.exit(1)

import json
import os
import time

# Supabase project configuration
SUPABASE_URL = "https://wefmacormdggmnrgoqqv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZm1hY29ybWRnZ21ucmdvcXF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQ4OTYyOCwiZXhwIjoyMDYyMDY1NjI4fQ.XRrj8IHPsNtIt4gY7z1Ovmq5O3d3yk2QjwLYpKR7a-U"  # Important: use the service role key, not anon key

def create_user_and_profile(email="student@example.com", password="changepassword", name="Student Name"):
    """Create a user in Supabase Auth and add a corresponding profile"""
    try:
        # Step 1: Create the user via Supabase Admin API
        user_data = {
            "email": email,
            "password": password,
            "email_confirm": True  # Auto-confirm email
        }
        
        print(f"Creating user with email: {email}...")
        
        # Create user via Admin API
        user_response = requests.post(
            f"{SUPABASE_URL}/auth/v1/admin/users",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json"
            },
            json=user_data
        )
        
        if user_response.status_code != 200:
            print(f"Error creating user: {user_response.text}")
            return None
        
        # Extract the user ID from response
        user_id = user_response.json().get("id")
        print(f"User created successfully with ID: {user_id}")
        
        # Step 2: Create the profile
        profile_data = {
            "id": user_id,
            "name": name,
            "yearId": 1,
            "phone": "123456789",
            "nationalId": "123456789",
            "avatarImage": "https://example.com/avatar.jpg",
            "isGraduated": False,
            "about": "Student about text",
            "specialization": "Student specialization",
            "role": "student role"
        }
        
        print("Creating user profile...")
        
        # Create profile via REST API
        profile_response = requests.post(
            f"{SUPABASE_URL}/rest/v1/profiles",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"  # or "return=representation" to get the created record
            },
            json=profile_data
        )
        
        if profile_response.status_code in [200, 201]:
            print(f"Profile created successfully for user: {user_id}")
            return user_id
        else:
            print(f"Error creating profile: {profile_response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
    except json.JSONDecodeError:
        print("Error parsing JSON response")
    except Exception as e:
        print(f"Unexpected error: {e}")
    
    return None

def batch_create_users(emails_list, default_password="changepassword"):
    """Create multiple users from a list of emails"""
    print(f"\n=== Starting batch creation of {len(emails_list)} users ===\n")
    
    successful = 0
    failed = 0
    results = []
    
    for index, email in enumerate(emails_list):
        email = email.strip()  # Remove any extra whitespace
        if email.endswith("'"):  # Remove trailing single quote if present
            email = email[:-1]
            
        print(f"\n[{index+1}/{len(emails_list)}] Processing: {email}")
        
        # Extract name from email for profile
        name_part = email.split('@')[0]
        name = ' '.join(word.capitalize() for word in name_part.split('.'))
        
        # Create user and profile
        user_id = create_user_and_profile(email, default_password, name)
        
        if user_id:
            successful += 1
            results.append({"email": email, "status": "success", "user_id": user_id})
            print(f"✅ Successfully created user and profile for {email}")
        else:
            failed += 1
            results.append({"email": email, "status": "failed"})
            print(f"❌ Failed to create user for {email}")
        
        # Add a short delay between requests to avoid rate limiting
        if index < len(emails_list) - 1:  # Don't sleep after the last item
            time.sleep(0.5)
    
    # Print summary
    print("\n=== Batch Creation Summary ===")
    print(f"Total processed: {len(emails_list)}")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    
    # Save results to file
    with open("user_creation_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\nResults saved to user_creation_results.json")
    
    return results

def interactive_mode():
    """Run the script in interactive mode to create a user with custom details"""
    print("\n=== Supabase User Creator ===")
    email = input("Enter user email (or press Enter for default 'student@example.com'): ") or "student@example.com"
    password = input("Enter password (or press Enter for default 'changepassword'): ") or "changepassword"
    name = input("Enter user name (or press Enter for default 'Student Name'): ") or "Student Name"
    
    user_id = create_user_and_profile(email, password, name)
    if user_id:
        print(f"\nUser creation completed successfully!")
        print(f"User ID: {user_id}")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("\nUser can now log in with these credentials.")
    else:
        print("\nUser creation failed. Check the error messages above.")

def batch_mode_from_file(file_path, default_password="changepassword"):
    """Create users from emails listed in a file (one email per line)"""
    try:
        with open(file_path, 'r') as f:
            emails = [line.strip() for line in f if line.strip()]
        
        return batch_create_users(emails, default_password)
    except Exception as e:
        print(f"Error reading email list file: {e}")
        return None

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Create a user in Supabase Auth with associated profile")
    parser.add_argument("-e", "--email", help="User email address")
    parser.add_argument("-p", "--password", help="User password")
    parser.add_argument("-n", "--name", help="User name")
    parser.add_argument("-i", "--interactive", action="store_true", help="Run in interactive mode")
    parser.add_argument("-b", "--batch", help="Path to a file containing emails (one per line)")
    parser.add_argument("--batch-list", action="store_true", help="Run with the hardcoded email list")
    
    args = parser.parse_args()
    
    if args.batch_list:
        # List of emails to create users for
        email_list = [
            "kutaibalburaidy@gmail.com",
            "ali2005mohamedmohsen@gmail.com",
            "mohamed.amir5206@gmail.com",
            "kareemyahya755@gmail.com",
            "yusuf.oftt@gmail.com",
            "amirt4598@gmail.com",
            "mazenmagdy1598@gmail.com",
            "mo175aymen@gmail.com",
            "yosefmostafa079@gmail.com",
            "body.mohamad11@gmail.com",
            "m3x.391@gmail.com",
            "omar12mohamed2005@gmail.com",
            "yousofahmad158@gmail.com",
            "sbmoaz@gmail.com",
            "wearethe1u@gmail.com",
            "yahyiary@gmail.com",
            "mohalaa519@gmail.com",
            "youssefnoaman96@gmail.com",
            "youssefostora1155@gmail.com",
            "alwrbyly30@gmail.com",
            "engineer2632005@gmail.com",
            "as973314@gmail.com",
            "gam8518@gmail.com",
            "ryahia97@gmail.com",
            "mohamedosama0110054@gmail.com",
            "youssfallam90@gmail.com",
            "bedoamin988@gmail.com",
            "youssefabouzied33@gmail.com",
            "yasserbolbol16@gmail.com",
            "ahmedelbe329@gmail.com",
            "oiaboyabesio@gmail.com",
            "seiftita12@gmail.com",
            "fayeebrahem646@gmail.com",
            "mohamedsameh172005@gmail.com",
            "aboelkher602@gmail.com",
            "mouminmouhamed28@gmail.com",
            "010222abdonazeeh@gmail.com",
            "aftwh472@gmail.com",
            "albarsalanbarbarosa@gmail.com",
            "abdelrhman.contact@gmail.com",
            "ahmdshy08@gmail.com",
            "abdelrhman.ahmed.nassar@gmail.com",
            "abdallhsalama550@gmail.com",
            "yh24012006@gmail.com",
            "alikesba709@gmail.com",
            "ahmedabdo15320@gmail.com",
            "mohamedkhaled58011@gmail.com",
            "fhrsvu74368@gmail.com",
            "abdmahdra@gmail.com",
            "eslamkhorshed123@gmail.com",
            "shehabayman790@gmail.com",
            "nsar86128@gmail.com",
            "azoozcr72005@gmail.com",
            "ziademad1923@gmail.com",
            "codinngar@gmail.com",
            "yossifhafney12@gmail.com",
            "abdallahkhaledmesallam@gmail.com",
            "abdelrhmanmohammed629@gmail.com",
            "mooasaboomar@gmail.com",
            "osamaamahdi22@gmail.com",
            "moesam224466@gmail.com",
            "ayman2010200500@gmail.com",
            "alisoliman2006au@gmail.com",
            "ansmhmdbywmy@gmail.com",
            "abdalrahmanelm999@gmail.com",
            "mmego5214@gmail.com",
            "elbasionymohamed346@gmail.com",
            "elseadysoliman@gmail.com",
            "belalshoref@gmail.com",
            "aligo7638@gmail.com",
            "alhsynly420@gmail.com",
            "abdullahhatem421@gmail.com",
            "afkry2392@gmail.com",
            "engmohammedakram6@gmail.com",
            "collegecse22@gmail.com",
            "drkhairy@gmail.com",
            "mostafaelmoalem@gmail.com",
            "yousefismail3yi@gmail.com",
            "abdalrahmant285@gmail.com",
            "mohamed.helal.roshdy@gmail.com",
            "alrwbyly30@gmail.com",
            "oe57742@gmail.com",
            "omarsupershadow5544@gmail.com",
            "abdelrhmanahmednassar@gmail.com",
            "mogibelrahman2005@gmail.com",
            "abdelrahmanahmed@gmail.com"
        ]
        
        batch_create_users(email_list, "changepassword")
    elif args.batch:
        batch_mode_from_file(args.batch, args.password or "changepassword")
    elif args.interactive:
        interactive_mode()
    else:
        email = args.email or "student@example.com"
        password = args.password or "changepassword"
        name = args.name or "Student Name"
        
        user_id = create_user_and_profile(email, password, name)
        if user_id:
            print(f"User creation completed successfully: {user_id}")
        else:
            print("User creation failed")