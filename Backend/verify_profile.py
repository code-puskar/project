import requests

BASE_URL = "http://localhost:8000"

def verify():
    # 1. Register a new user
    email = f"test_{int(requests.get('http://worldtimeapi.org/api/ip').json()['unixtime'])}@example.com"
    password = "password123"
    name = "Test User"
    
    print(f"Registering {email}...")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "name": name
    })
    
    # If user already exists (400), try login directly
    if res.status_code == 200:
        print("Registration successful.")
    elif res.status_code == 400 and "already registered" in res.text:
        print("User already exists, logging in...")
    else:
        print(f"Registration failed: {res.text}")
        return

    # 2. Login
    print("Logging in...")
    res = requests.post(f"{BASE_URL}/auth/token", data={
        "username": email,
        "password": password
    })
    
    if res.status_code != 200:
        print(f"Login failed: {res.text}")
        return
        
    token = res.json()["access_token"]
    print("Login successful, token received.")
    
    # 3. Check /me (Profile)
    print("Checking /me endpoint...")
    res = requests.get(f"{BASE_URL}/users/me", headers={
        "Authorization": f"Bearer {token}"
    })
    
    if res.status_code == 200:
        data = res.json()
        print("Profile data received:")
        print(f"Name: {data['name']}")
        print(f"Reputation: {data['reputation']}")
        print(f"Stats: {data['stats']}")
        
        if "reputation" in data and "stats" in data:
            print("✅ Verification SUCCESS: Profile contains reputation and stats.")
        else:
            print("❌ Verification FAILED: Missing reputation or stats.")
    else:
        print(f"❌ Verification FAILED: {res.status_code} - {res.text}")

if __name__ == "__main__":
    try:
        verify()
    except Exception as e:
        print(f"Verification Error: {e}")
