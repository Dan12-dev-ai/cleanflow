# Laundry Management System

A modern, responsive laundry management system frontend built with React and Vite. This project is designed to support a complete workflow for managing customers, orders, services, deliveries, payments, inventory, employees, and reports.

## Requirements Overview

### 1. Functional Requirements

#### A. User Authentication
- User registration
- Secure login/logout
- Password reset
- Role-based access control for Admin, Staff, and Customer

#### B. Customer Management
- Add, edit, view, and delete customer records
- Store customer information including name, phone, email, and address
- View customer order history
- Search and filter customers

#### C. Order Management
- Create new laundry orders
- Assign a unique order ID
- Select laundry service such as Wash & Fold, Dry Cleaning, Ironing, or Express
- Record clothing items and quantities
- Automatically calculate total price
- Update order status
- Cancel orders
- View order details

#### D. Laundry Service Management
- Add, edit, and delete services
- Set service prices
- Manage service categories

#### E. Order Tracking
Track orders through the following stages:
- Received
- Washing
- Drying
- Ironing
- Folding
- Packed
- Ready for Pickup
- Delivered

#### F. Payment Management
- Generate invoices
- Record payments
- Support multiple payment methods including Cash, Mobile Money, and Bank Transfer
- View payment history
- Print or download receipts

#### G. Delivery Management
- Schedule pickup and delivery
- Assign delivery staff
- Update delivery status
- View delivery history

#### H. Inventory Management
- Manage detergents and supplies
- Monitor stock levels
- Low stock alerts
- Update inventory records

#### I. Employee Management
- Add and manage employees
- Assign work
- Manage employee roles
- Track employee performance

#### J. Reports & Analytics
Generate reports for:
- Daily orders
- Monthly revenue
- Customer activity
- Service popularity
- Payment reports
- Inventory usage

#### K. Notifications
- Order confirmation
- Payment confirmation
- Pickup reminder
- Delivery notification
- Low inventory alerts

#### L. Feedback & Reviews
- Customers can rate services
- Submit comments and feedback
- Admin can view customer reviews

### 2. Non-Functional Requirements

#### Performance
- Fast page loading
- Support many concurrent users
- Quick search results

#### Security
- Encrypted passwords
- Secure authentication
- Role-based permissions
- Data validation
- Protection against common web attacks

#### Reliability
- Automatic backups
- Data recovery support
- High system availability

#### Usability
- Responsive design
- Easy navigation
- User-friendly interface
- Accessible on desktop, tablet, and mobile

#### Scalability
- Support additional branches
- Handle increasing numbers of users and orders

#### Maintainability
- Modular architecture
- Easy software updates
- Well-documented code

### 3. User Roles

#### Admin
- Manage users
- Manage employees
- Manage customers
- Manage services
- Manage orders
- Manage inventory
- Manage payments
- Generate reports
- Configure system settings

#### Staff
- Create and update orders
- Update laundry status
- Manage customer information
- Receive payments
- Print receipts
- Manage deliveries

#### Customer
- Register/login
- Place laundry orders
- Track order status
- View order history
- Make payments
- Receive notifications
- Submit feedback

### 4. Hardware Requirements
- Computer or laptop
- Smartphone or tablet
- Stable internet connection
- Receipt printer (optional)
- Barcode/QR code scanner (optional)

### 5. Software Requirements
- Frontend: React
- Backend: Laravel
- Database: MySQL
- API: REST API
- Authentication: JWT
- Version Control: Git & GitHub
- IDE: Visual Studio Code
- Web Server: Apache or Nginx
- Browser: Chrome, Firefox, Edge

### 6. Core Modules
- Authentication
- Dashboard
- Customer Management
- Order Management
- Laundry Services
- Inventory Management
- Employee Management
- Payment Management
- Delivery Management
- Reports & Analytics
- Notifications
- Settings

## Project Status
The current frontend provides a polished dashboard experience for the laundry management system and is ready for further backend integration.
