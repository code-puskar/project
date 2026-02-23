from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["argon2"], 
    deprecated="auto",
    argon2__time_cost=1,
    argon2__memory_cost=8192,
    argon2__parallelism=1
)
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
