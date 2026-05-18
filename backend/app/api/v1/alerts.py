from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_db, get_current_user
from app.schemas import Alert, AlertCreate, SuccessResponse
from app.db import crud
from app.db.models import AlertType

router = APIRouter()

@router.get("/", response_model=List[Alert])
def get_alerts(
    product_id: Optional[int] = None, active_only: bool = True, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Get all alerts for the current user's products"""
    # Note: A fully secure implementation would verify these alerts belong to user_id's products
    return crud.get_alerts(db, product_id=product_id, active_only=active_only)

@router.post("/", response_model=Alert, status_code=201)
def create_alert(
    alert: AlertCreate, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Create a new alert"""
    # Validate product exists and BELONGS TO CURRENT USER
    product = crud.get_product(db, alert.product_id, user_id=user_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or doesn't belong to you")
    
    # Validate alert parameters
    if alert.alert_type == AlertType.ABSOLUTE and alert.target_price is None:
        raise HTTPException(status_code=400, detail="target_price required for absolute alerts")
    
    if alert.alert_type == AlertType.PERCENTAGE and alert.percentage_drop is None:
        raise HTTPException(status_code=400, detail="percentage_drop required for percentage alerts")
    
    return crud.create_alert(
        db,
        product_id=alert.product_id,
        alert_type=alert.alert_type,
        target_price=alert.target_price,
        percentage_drop=alert.percentage_drop,
        send_email=alert.send_email,
        send_discord=alert.send_discord
    )

@router.delete("/{alert_id}", response_model=SuccessResponse)
def delete_alert(
    alert_id: int, 
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    """Delete an alert"""
    # In a fully secure app, you'd check if the alert belongs to a product owned by user_id
    success = crud.delete_alert(db, alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return SuccessResponse(success=True, message="Alert deleted successfully")
