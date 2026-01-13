from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["SmartCityDB"]

users_collection = db["users"]
issues_collection = db["issues"]
validations_collection = db["validations"]  
