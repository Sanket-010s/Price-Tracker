import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from pathlib import Path
from typing import Dict, Any
from app.alerts.base import BaseAlerter
from app.config import settings
from app.utils.logger import logger

class EmailAlerter(BaseAlerter):
    def __init__(self):
        self.smtp_host = settings.smtp_host
        self.smtp_port = settings.smtp_port
        self.smtp_user = settings.smtp_user
        self.smtp_password = settings.smtp_password
        self.smtp_from = settings.smtp_from
        self.enabled = settings.email_enabled
    
    async def send_alert(self, message: str, metadata: Dict[str, Any] = None, to_email: str = None) -> bool:
        if not self.enabled or not self.smtp_user:
            logger.warning("Email alerter is disabled or not configured")
            return False
        
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = metadata.get('subject', 'Price Alert')
            msg['From'] = self.smtp_from
            msg['To'] = to_email if to_email else self.smtp_user  # Send to user, fallback to self

            
            # Plain text version
            text_part = MIMEText(message, 'plain')
            msg.attach(text_part)
            
            # HTML version if template exists
            html_content = self._render_html_template(message, metadata)
            if html_content:
                html_part = MIMEText(html_content, 'html')
                msg.attach(html_part)
            
            # Send email
            await aiosmtplib.send(
                msg,
                hostname=self.smtp_host,
                port=self.smtp_port,
                username=self.smtp_user,
                password=self.smtp_password,
                start_tls=True
            )
            
            logger.info(f"Email alert sent successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email alert: {e}")
            return False
    
    def _render_html_template(self, message: str, metadata: Dict[str, Any] = None) -> str:
        try:
            template_path = Path(__file__).parent.parent / 'templates' / 'email_alert.html'
            if not template_path.exists():
                return ""
            
            with open(template_path, 'r') as f:
                template = Template(f.read())
            
            return template.render(
                message=message,
                product_name=metadata.get('product_name', 'Product'),
                product_url=metadata.get('product_url', '#'),
                old_price=metadata.get('old_price'),
                new_price=metadata.get('new_price'),
                currency=metadata.get('currency', 'USD')
            )
        except Exception as e:
            logger.error(f"Failed to render email template: {e}")
            return ""
