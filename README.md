# 🛒 E-Commerce Store (WordPress-Style)

This project is a fully functional e-commerce store built using pure frontend technologies, inspired by WordPress-style stores. It includes both a storefront (website) and a connected dashboard, allowing products to be managed dynamically.

The store fetches product data from Supabase and provides core shopping functionalities such as product listing, filtering, cart management, and order placement.

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Store-blue?style=for-the-badge&logo=google-chrome)](https://khuzaimashoaib.github.io/E-Commerce-Store/)



## 🚀 Features

### Core Shopping Features

- **Dynamic product listing** - Data fetched from Supabase in real-time
- **Add to Cart functionality** - Seamless shopping cart management
- **Product filtering** - Filter products by category and brand
- **Place Order workflow** - Complete checkout process with form validation
- **Responsive UI** - Mobile-friendly design using Bootstrap
- **Smooth user interactions** - Enhanced UX with alerts and notifications

### Dashboard Integration

- **Dashboard-connected store architecture** - Similar to WordPress admin system
- **Real-time data synchronization** - Products managed through connected dashboard
- **Live database updates** - All changes reflect immediately on the storefront

## 🧩 Tech Stack

### Frontend Technologies

- **HTML5** - Semantic markup and structure
- **CSS3** - Custom styling and responsive design
- **Vanilla JavaScript** - Pure JavaScript without frameworks
- **Bootstrap** - Responsive grid system and UI components

### Libraries & Tools

- **SweetAlert** - Beautiful modal dialogs and notifications
- **Slick Slider** - Smooth product image carousels
- **Supabase** - Backend-as-a-Service for database and API

### Backend Services

- **Supabase Database** - PostgreSQL database for products and orders
- **Supabase API** - RESTful API for data operations

## 🛠 Project Purpose

This project was developed to demonstrate and practice:

### Learning Objectives

- **Real-world e-commerce functionality** - Complete shopping workflow
- **Frontend JavaScript logic** - Complex state management and DOM manipulation
- **Live backend integration** - Working with Supabase API
- **WordPress-like architecture** - Dashboard-connected storefront system

### Technical Goals

- **Framework-free development** - Pure vanilla JavaScript implementation
- **Database-driven applications** - Real-time data fetching and updates
- **User experience optimization** - Smooth interactions and feedback

### Installation

1. Clone the repository
2. Set up your Supabase project
3. Configure database credentials
4. Open `index.html` in your browser

### Database Setup

Create the following tables in your Supabase database:

- `products` - Product catalog with columns: id, title, price, category, brand, image, etc.
- `orders` - Customer orders with user details and order information

---

**Built with ❤️ using vanilla JavaScript and Supabase**
