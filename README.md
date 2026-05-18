# 🛒 Price Tracker & Alerter

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A full-stack application for tracking product prices from e-commerce websites and receiving instant notifications when prices drop.**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [CLI Commands](#-cli-commands)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Price Tracker & Alerter is a comprehensive solution for monitoring product prices across multiple e-commerce platforms. Set custom price alerts, track historical price changes, and receive instant notifications via Email or Discord when prices drop below your target.

### Why Use This?

- 💰 **Save Money**: Never miss a price drop on products you want
- 📊 **Data-Driven**: Make informed purchase decisions with historical price data
- 🔔 **Stay Informed**: Get instant notifications through multiple channels
- 🤖 **Automated**: Set it and forget it - the system monitors prices 24/7
- 🔒 **Self-Hosted**: Your data stays with you, complete privacy

---

## ✨ Features

### 🔍 Smart Scraping Engine
- **Multi-Site Support**: Amazon, Flipkart, BookDepository, and generic websites
- **Anti-Bot Protection**: Rotating user agents, retry logic, exponential backoff
- **Dynamic & Static**: Handles both JavaScript-rendered and static HTML pages
- **Robust Parsing**: Intelligent price extraction with multi-currency support

### 📊 Price Tracking
- **Historical Data**: Complete price history with timestamps
- **Interactive Charts**: Visualize price trends with Recharts
- **Price Analytics**: Track percentage changes and identify best deals
- **Unlimited Products**: Track as many products as you want

### 🔔 Flexible Alert System
- **Absolute Price Alerts**: Get notified when price drops below a specific amount
- **Percentage Drop Alerts**: Alert on X% price reduction
- **Any Drop Alerts**: Notify on any price decrease
- **Multi-Channel Notifications**: Email (SMTP) and Discord webhooks

### ⚡ Automation
- **Scheduled Checks**: Automatic price monitoring at configurable intervals
- **Background Jobs**: APScheduler for reliable task execution
- **Manual Triggers**: Check prices on-demand via API or CLI

### 🎨 Modern Dashboard
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Easy on the eyes with full dark mode support
- **Real-Time Updates**: Instant feedback on price checks
- **Intuitive UI**: Clean, modern interface built with Tailwind CSS

### 🛠️ Developer-Friendly
- **REST API**: Comprehensive FastAPI endpoints with auto-generated docs
- **CLI Tools**: Command-line interface for power users
- **Database Migrations**: Alembic for schema version control
- **Testing Suite**: Unit and integration tests with pytest
- **Type Safety**: Full type hints with Pydantic validation

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | Core language |
| **FastAPI** | High-performance web framework |
| **SQLAlchemy** | ORM for database operations |
| **Alembic** | Database migrations |
| **APScheduler** | Background job scheduling |
| **BeautifulSoup4** | HTML parsing |
| **Requests** | HTTP client |
| **Playwright** | Dynamic website scraping (optional) |
| **Jinja2** | Email template rendering |
| **Pydantic** | Data validation |
| **pytest** | Testing framework |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Recharts** | Data visualization |
| **Axios** | HTTP client |
| **React Router** | Client-side routing |
| **Lucide React** | Icon library |

### Database
- **SQLite** - Lightweight, serverless database (easily replaceable with PostgreSQL/MySQL)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │ Product  │  │  Alerts  │  │Notifications│   │
│  │          │  │ Details  │  │          │  │             │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API Layer                           │  │
│  │  Products │ Alerts │ Notifications │ Jobs │ Health   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Business Logic                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Scraper  │  │Comparator│  │Scheduler │           │  │
│  │  │  Engine  │  │          │  │          │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Scrapers (Pluggable)                     │  │
│  │  Amazon │ Flipkart │ BookDepository │ Generic        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Alerters (Multi-Channel)                   │  │
│  │  Email (SMTP) │ Discord Webhooks                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Layer (SQLAlchemy)                  │  │
│  │  Products │ PriceHistory │ Alerts │ Notifications    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │  SQLite   │
                    │ Database  │
                    └───────────┘
```

### Project Structure

```
price-tracker/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── core/              # Core business logic
│   │   │   ├── scraper.py     # Scraping engine
│   │   │   ├── scheduler.py   # Job scheduler
│   │   │   ├── comparator.py  # Alert logic
│   │   │   ├── price_parser.py # Price extraction
│   │   │   └── anti_bot.py    # Anti-bot measures
│   │   ├── scrapers/          # Site-specific scrapers
│   │   │   ├── base.py        # Base scraper class
│   │   │   ├── amazon.py      # Amazon scraper
│   │   │   ├── flipkart.py    # Flipkart scraper
│   │   │   ├── bookdepository.py
│   │   │   └── generic.py     # Generic scraper
│   │   ├── alerts/            # Notification system
│   │   │   ├── email_alerter.py
│   │   │   ├── discord_alerter.py
│   │   │   └── alert_manager.py
│   │   ├── db/                # Database layer
│   │   │   ├── models.py      # SQLAlchemy models
│   │   │   ├── crud.py        # CRUD operations
│   │   │   └── migrations/    # Alembic migrations
│   │   ├── api/               # REST API endpoints
│   │   │   └── v1/
│   │   │       ├── products.py
│   │   │       ├── alerts.py
│   │   │       ├── notifications.py
│   │   │       └── jobs.py
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── utils/             # Utilities
│   │   └── templates/         # Email templates
│   ├── cli/                   # CLI tools
│   │   ├── tracker.py         # Main CLI
│   │   └── commands/          # CLI commands
│   ├── tests/                 # Test suite
│   │   ├── unit/
│   │   └── integration/
│   ├── scripts/               # Utility scripts
│   └── docs/                  # Documentation
│
└── frontend/                  # React Frontend
    └── src/
        ├── components/        # Reusable components
        ├── pages/            # Route pages
        ├── services/         # API clients
        ├── hooks/            # Custom React hooks
        └── utils/            # Helper functions
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.10, 3.11, or 3.12** (Python 3.13+ not supported yet)
- **Node.js 18+** and npm
- **Git**

### Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/price-tracker.git
cd price-tracker
```

#### 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Initialize database
python scripts/init_db.py

# Run the server
python -m uvicorn app.main:app --reload

#Build Cmd
pip install -r requirements.txt


```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:5173

---

## ⚙️ Configuration

Edit `backend/.env` to configure the application:

```env
# Database
DATABASE_URL=sqlite:///./data/tracker.db

# Scraper Settings
SCRAPER_TIMEOUT=30
SCRAPER_RETRY_COUNT=3
SCRAPER_DELAY=2

# Scheduler (check every hour)
SCHEDULER_INTERVAL_MINUTES=60

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
EMAIL_ENABLED=true

# Discord Notifications
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook
DISCORD_ENABLED=true

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=INFO
LOG_FILE=./data/logs/tracker.log
```

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASSWORD`

### Discord Webhook Setup

1. Go to your Discord server settings
2. Navigate to Integrations → Webhooks
3. Create a new webhook and copy the URL
4. Paste it in `DISCORD_WEBHOOK_URL`

---

## 📖 Usage

### Web Dashboard

1. **Add a Product**: Click "Add Product" and paste the product URL
2. **Set Alerts**: Navigate to the Alerts page and create price alerts
3. **View History**: Click on any product to see price history charts
4. **Check Prices**: Manually trigger price checks or let the scheduler handle it

### API Usage

#### Add a Product

```bash
curl -X POST "http://localhost:8000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW",
    "name": "Product Name",
    "currency": "USD"
  }'
```

#### Create an Alert

```bash
curl -X POST "http://localhost:8000/api/v1/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "alert_type": "percentage",
    "percentage_drop": 10.0
  }'
```

#### Get Product with History

```bash
curl "http://localhost:8000/api/v1/products/1?days=30"
```

---

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/api/v1/products` | List all products |
| `POST` | `/api/v1/products` | Add new product |
| `GET` | `/api/v1/products/{id}` | Get product with history |
| `PATCH` | `/api/v1/products/{id}` | Update product |
| `DELETE` | `/api/v1/products/{id}` | Delete product |
| `POST` | `/api/v1/products/{id}/check` | Manually check price |
| `GET` | `/api/v1/alerts` | List all alerts |
| `POST` | `/api/v1/alerts` | Create alert |
| `DELETE` | `/api/v1/alerts/{id}` | Delete alert |
| `GET` | `/api/v1/notifications` | Get notification history |
| `POST` | `/api/v1/jobs/check-all` | Trigger check for all products |
| `GET` | `/api/v1/jobs/status` | Get scheduler status |

### Interactive Documentation

Visit http://localhost:8000/docs for interactive API documentation with Swagger UI.

---

## 💻 CLI Commands

The CLI provides a powerful command-line interface for managing products:

```bash
# Add a product
python cli/tracker.py add "https://amazon.com/product-url" --name "Product Name"

# List all products
python cli/tracker.py list

# List only active products
python cli/tracker.py list --active-only

# Check price for specific product
python cli/tracker.py check --id 1

# Check all products
python cli/tracker.py check

# View price history
python cli/tracker.py history 1 --days 30

# Remove a product
python cli/tracker.py remove 1

# Run the server
python cli/tracker.py run
```

---

## 🧪 Testing

```bash
cd backend

# Run all tests
pytest

# Run with coverage report
pytest --cov=app tests/

# Run specific test file
pytest tests/unit/test_price_parser.py

# Run with verbose output
pytest -v
```

### Test Coverage

The project includes:
- ✅ Unit tests for price parsing
- ✅ Unit tests for alert comparison logic
- ✅ Integration tests for API endpoints
- ✅ Mock fixtures for scrapers

---

## 🚢 Deployment

### Backend (Production)

```bash
# Install production dependencies
pip install -r requirements.txt gunicorn

# Initialize database
python scripts/init_db.py

# Run with Gunicorn
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### Frontend (Production)

```bash
# Build for production
npm run build

# The dist/ folder contains static files
# Serve with nginx, Apache, or any static file server
```

### Docker (Coming Soon)

```bash
docker-compose up -d
```

### Environment Variables for Production

- Set `DATABASE_URL` to PostgreSQL/MySQL for production
- Use environment variables instead of `.env` file
- Enable HTTPS for API endpoints
- Set appropriate `CORS_ORIGINS`

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450?text=Dashboard+Screenshot)

### Product Details with Price Chart
![Product Details](https://via.placeholder.com/800x450?text=Product+Details+Screenshot)

### Alerts Management
![Alerts](https://via.placeholder.com/800x450?text=Alerts+Screenshot)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x450?text=Dark+Mode+Screenshot)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding New Scrapers

1. Create a new file in `backend/app/scrapers/yoursite.py`
2. Extend the `BaseScraper` class
3. Implement the `scrape()` method
4. Register in `scrapers/__init__.py`

Example:

```python
from app.scrapers.base import BaseScraper, ScraperResult

class YourSiteScraper(BaseScraper):
    def scrape(self) -> Optional[ScraperResult]:
        html = self.fetch_html()
        if not html:
            return None
        
        soup = self.parse_html(html)
        
        # Extract product details
        name = soup.select_one('.product-name').get_text()
        price = parse_price(soup.select_one('.price').get_text())
        
        return ScraperResult(name=name, price=price)
```

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pytest`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Follow PEP 8 for Python code
- Use type hints
- Write docstrings for functions
- Add tests for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Charting library
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) - HTML parsing

---

## 📧 Contact

**Your Name** - [Sanket Sutar] - sanketsutar010@gmail.com

Project Link: [https://github.com/yourusername/price-tracker](https://github.com/yourusername/price-tracker)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Sanket Sutar & Atharv Suryawanshi](https://github.com/Sanket-010s)

</div>
