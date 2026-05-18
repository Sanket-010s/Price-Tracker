from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.schemas import Product, ProductCreate, ProductUpdate, ProductWithHistory, SuccessResponse
from app.db import crud
from app.core.scraper import scraper_engine
from app.utils.validators import is_valid_url

router = APIRouter()

@router.get("/", response_model=List[Product])
def get_products(
    skip: int = 0, limit: int = 100, active_only: bool = False, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Get all products for the current user"""
    return crud.get_products(db, skip=skip, limit=limit, active_only=active_only, user_id=user_id)

@router.get("/{product_id}", response_model=ProductWithHistory)
def get_product(
    product_id: int, days: int = 30, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Get product by ID with price history for the current user"""
    product = crud.get_product(db, product_id, user_id=user_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    history = crud.get_price_history(db, product_id, days=days)
    
    return ProductWithHistory(
        **product.__dict__,
        price_history=history
    )

@router.post("/", response_model=Product, status_code=201)
async def create_product(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Add a new product to track for the current user"""
    if not is_valid_url(product.url):
        raise HTTPException(status_code=400, detail="Invalid URL")
    
    # Check if product already exists for this user
    existing = crud.get_product_by_url(db, product.url, user_id=user_id)
    if existing:
        raise HTTPException(status_code=400, detail="Product already exists in your tracker")
    
    # Create product
    db_product = crud.create_product(db, product.url, product.name, user_id, product.currency)
    
    # Try to scrape initial price
    try:
        result = scraper_engine.scrape_product(product.url)
        if result and result.price:
            crud.update_product_price(db, db_product.id, result.price, result.image_url)
            crud.add_price_history(db, db_product.id, result.price)
            db.refresh(db_product)
    except Exception:
        pass  # Initial scrape failure is not critical
    
    return db_product

@router.patch("/{product_id}", response_model=Product)
def update_product(
    product_id: int, product: ProductUpdate, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Update product details"""
    db_product = crud.get_product(db, product_id, user_id=user_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.name is not None:
        db_product.name = product.name
    if product.is_active is not None:
        db_product.is_active = product.is_active
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", response_model=SuccessResponse)
def delete_product(
    product_id: int, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Delete a product"""
    success = crud.delete_product(db, product_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return SuccessResponse(success=True, message="Product deleted successfully")

@router.post("/{product_id}/check", response_model=Product)
async def check_product_price(
    product_id: int, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Manually trigger price check for a product"""
    from app.core.scheduler import price_scheduler
    
    product = crud.get_product(db, product_id, user_id=user_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await price_scheduler.check_product(db, product_id)
    
    db.refresh(product)
    return product
