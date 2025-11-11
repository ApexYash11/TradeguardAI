from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from datetime import timedelta
from backend.database import get_db
from backend.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token,
    Token,
    User,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from pydantic import BaseModel

router = APIRouter()
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/api/auth/login", response_model=Token)
async def login(request: LoginRequest):
    """Authenticate user and return JWT token"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, hashed_password, is_admin FROM users WHERE username = ?", (request.username,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(request.password, user[3]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user[0]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user_id": user[0]}

@router.get("/api/auth/me", response_model=User)
async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    """Get current authenticated user"""
    token = credentials.credentials
    token_data = verify_token(token)
    
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, is_admin FROM users WHERE id = ?", (token_data.user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(id=user[0], username=user[1], email=user[2], is_admin=bool(user[3]))

@router.post("/api/auth/logout")
async def logout():
    """Logout user (token invalidation handled client-side)"""
    return {"message": "Successfully logged out"}
