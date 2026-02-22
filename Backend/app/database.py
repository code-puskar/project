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
