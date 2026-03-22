import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/SmartCityDB")
client = MongoClient(mongo_url)
db = client["SmartCityDB"]

users_collection = db["users"]  
issues_collection = db["issues"]
validations_collection = db["validations"]  

def setup_database():
    import pymongo
    from pymongo.errors import OperationFailure
    print("Setting up MongoDB indexes...")
    try:
        # Unique email index
        users_collection.create_index("email", unique=True)
        # 2dsphere index for location queries
        issues_collection.create_index([("location.coordinates", pymongo.GEOSPHERE)])
        print("MongoDB indexes created successfully.")
    except OperationFailure as e:
        print(f"MongoDB Index Error (often safe to ignore if indexes exist): {e}")
