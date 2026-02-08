from pymongo import MongoClient

client = MongoClient('mongodb+srv://Puskardebnath:puskar14.com@smartcitydb.bptnopq.mongodb.net/SmartCityDB')
db = client["SmartCityDB"]

users_collection = db["users"]  
issues_collection = db["issues"]
validations_collection = db["validations"]  
