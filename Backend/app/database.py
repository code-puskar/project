from pymongo import MongoClient

client = MongoClient('REDACTED_MONGO_URL')
db = client["SmartCityDB"]

users_collection = db["users"]  
issues_collection = db["issues"]
validations_collection = db["validations"]  
