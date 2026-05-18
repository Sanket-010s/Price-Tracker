from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.db.models import Product, PriceHistory, Alert, Notification, AlertType, NotificationChannel

# Product CRUD
def create_product(db: Session, url: str, name: str, user_id: str, currency: str = "USD") -> Product:
    product = Product(url=url, name=name, user_id=user_id, currency=currency)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def get_product(db: Session, product_id: int, user_id: Optional[str] = None) -> Optional[Product]:
    query = db.query(Product).filter(Product.id == product_id)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    return query.first()

def get_product_by_url(db: Session, url: str, user_id: str) -> Optional[Product]:
    return db.query(Product).filter(Product.url == url, Product.user_id == user_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100, active_only: bool = False, user_id: Optional[str] = None) -> List[Product]:
    query = db.query(Product)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    if active_only:
        query = query.filter(Product.is_active == True)
    return query.offset(skip).limit(limit).all()

def update_product_price(db: Session, product_id: int, price: float, image_url: Optional[str] = None) -> Product:
    product = get_product(db, product_id)
    if product:
        product.current_price = price
        product.last_checked = datetime.utcnow()
        if image_url:
            product.image_url = image_url
        db.commit()
        db.refresh(product)
    return product

def delete_product(db: Session, product_id: int, user_id: str) -> bool:
    product = get_product(db, product_id, user_id=user_id)
    if product:
        db.delete(product)
        db.commit()
        return True
    return False

# Price History CRUD
def add_price_history(db: Session, product_id: int, price: float) -> PriceHistory:
    history = PriceHistory(product_id=product_id, price=price)
    db.add(history)
    db.commit()
    db.refresh(history)
    return history

def get_price_history(db: Session, product_id: int, days: int = 30) -> List[PriceHistory]:
    since = datetime.utcnow() - timedelta(days=days)
    return db.query(PriceHistory).filter(
        PriceHistory.product_id == product_id,
        PriceHistory.timestamp >= since
    ).order_by(PriceHistory.timestamp.asc()).all()

# Alert CRUD
def create_alert(db: Session, product_id: int, alert_type: AlertType, 
                 target_price: Optional[float] = None, percentage_drop: Optional[float] = None,
                 send_email: bool = True, send_discord: bool = False) -> Alert:
    alert = Alert(
        product_id=product_id,
        alert_type=alert_type,
        target_price=target_price,
        percentage_drop=percentage_drop,
        send_email=send_email,
        send_discord=send_discord
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

def get_alerts(db: Session, product_id: Optional[int] = None, active_only: bool = True) -> List[Alert]:
    query = db.query(Alert)
    if product_id:
        query = query.filter(Alert.product_id == product_id)
    if active_only:
        query = query.filter(Alert.is_active == True)
    return query.all()

def delete_alert(db: Session, alert_id: int) -> bool:
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        db.delete(alert)
        db.commit()
        return True
    return False

# Notification CRUD
def create_notification(db: Session, alert_id: int, channel: NotificationChannel, 
                       message: str, success: bool = True, error_message: Optional[str] = None) -> Notification:
    notification = Notification(
        alert_id=alert_id,
        channel=channel,
        message=message,
        success=success,
        error_message=error_message
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

def get_notifications(db: Session, skip: int = 0, limit: int = 100) -> List[Notification]:
    return db.query(Notification).order_by(Notification.sent_at.desc()).offset(skip).limit(limit).all()
