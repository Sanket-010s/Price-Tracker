from app.db.base import get_db
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
import os

# Initialize Firebase Admin if not already initialized
try:
    if not firebase_admin._apps:
        # Load from a service account json file or default application credentials
        # Make sure you set FIREBASE_CREDENTIALS_PATH in your .env or just use default
        cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-adminsdk.json"))
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Firebase admin init error (you need the service account file): {e}")

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Verify Firebase token and return user ID (UID)"""
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

__all__ = ["get_db", "get_current_user"]
