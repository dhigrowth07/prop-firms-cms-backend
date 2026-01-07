# Prop Firms CMS Backend - API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Response Structure](#response-structure)
5. [Error Handling](#error-handling)
6. [Public API Routes](#public-api-routes)
7. [Authentication Routes](#authentication-routes)
8. [Admin API Routes](#admin-api-routes)
9. [Data Models](#data-models)

---

## Overview

This is a Content Management System (CMS) backend for managing prop trading firms. The API supports two types of firms:

- **Prop Firms**: Traditional prop trading firms with account types, evaluation stages, and assets
- **Futures Firms**: Futures trading firms with futures programs and exchanges

### Key Features

- JWT-based authentication with role-based access control (ADMIN, EDITOR)
- Public API for browsing firms
- Admin API for managing all entities
- Complex relationship management (many-to-many, one-to-many)
- Coupon system with date-based activation
- Commission structures for both firm types
- Comprehensive validation and error handling

---

## Base URL

```
/api/v1
```

All routes are prefixed with `/api/v1` (where `v1` is the API version from environment variable `VERSION`).

---

## Authentication

### Authentication Methods

The API supports two authentication methods:

1. **Bearer Token** (Header): `Authorization: Bearer <token>`
2. **Cookie**: `token` cookie (HTTP-only, secure in production)

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Roles

- **ADMIN**: Full access to all endpoints including user management
- **EDITOR**: Access to content management (firms, brokers, platforms, etc.) but not user management

---

## Response Structure

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message",
  "code": 400,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `409` - Conflict (Unique constraint violation)
- `500` - Internal Server Error

### Error Types

- **VALIDATION_ERROR**: Request validation failed
- **UNIQUE_CONSTRAINT_ERROR**: Duplicate entry
- **FOREIGN_KEY_CONSTRAINT_ERROR**: Related record exists
- **JWT_ERROR**: Invalid or expired token
- **NOT_FOUND**: Resource not found

---

## Public API Routes

These routes do not require authentication.

### List Firms

```http
GET /api/v1/firms
```

**Query Parameters:**

- `firm_type` (optional): `prop_firm` | `futures_firm`
- `sort_by` (optional): `name` | `rating` | `review_count` | `founded_year` | `max_allocation` | `created_at`
- `order` (optional): `ASC` | `DESC` (default: `ASC`)
- `filter` (optional): `top_rated` | `most_reviewed` | `newest`

**Example:**

```http
GET /api/v1/firms?firm_type=prop_firm&filter=top_rated
```

**Response:**

```json
{
  "success": true,
  "message": "Firms fetched successfully",
  "firms": [
    {
      "id": "uuid",
      "name": "Firm Name",
      "slug": "firm-name",
      "firm_type": "prop_firm",
      "logo_url": "https://...",
      "founded_year": 2020,
      "rating": 4.5,
      "review_count": 150,
      "max_allocation": 1000000,
      "description": "Firm description",
      "location": "United States",
      "guide_video_url": "https://...",
      "years_in_business": 4,
      "trading_platforms": [...],
      "brokers": [...],
      "payout_methods": [...],
      "payment_methods": [...],
      "assets": [...],
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Get Firm by Slug

```http
GET /api/v1/firms/:slug
```

**Response:**

```json
{
  "success": true,
  "message": "Firm details fetched successfully",
  "firm": {
    "id": "uuid",
    "name": "Firm Name",
    "slug": "firm-name",
    "firm_type": "prop_firm",
    "logo_url": "https://...",
    "founded_year": 2020,
    "rating": 4.5,
    "review_count": 150,
    "max_allocation": 1000000,
    "description": "Firm description",
    "location": "United States",
    "guide_video_url": "https://...",
    "years_in_business": 4,
    "trading_platforms": [...],
    "brokers": [...],
    "payout_methods": [...],
    "payment_methods": [...],
    "rules": [...],
    "payout_policies": [...],
    "payout_policies_grouped": [
      {
        "program_type": "1-Step",
        "policies": [...]
      }
    ],
    "consistency_rules": [...],
    "firm_rules": [...],
    "coupons": [...],
    "restricted_countries": [...],
    // Prop Firm Specific
    "assets": [...],
    "account_types": [
      {
        "id": "uuid",
        "name": "10K Challenge",
        "starting_balance": 10000,
        "price": 99.00,
        "profit_target": 1000.00,
        "daily_drawdown": 500.00,
        "max_drawdown": 1000.00,
        "profit_split": 80.00,
        "evaluation_required": true,
        "program_variant": "1-Step",
        "program_name": "Challenge",
        "evaluation_stages": [...],
        "commissions": [...]
      }
    ],
    // OR Futures Firm Specific
    "futures_exchanges": [...],
    "futures_programs": [
      {
        "id": "uuid",
        "name": "50K Program",
        "account_size": 50000,
        "price": 299.00,
        "profit_target": 5000.00,
        "max_drawdown": 2500.00,
        "trailing_drawdown": false,
        "reset_fee": 99.00,
        "notes": "Program notes",
        "commissions": [...]
      }
    ],
    "instrument_types": [...]
  }
}
```

---

## Authentication Routes

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**

- `email`: Valid email address (required)
- `password`: Minimum 6 characters (required)

**Response:** See [Authentication](#authentication) section

### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "User profile",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful",
  "token": null,
  "user": null
}
```

---

## Admin API Routes

All admin routes require authentication and appropriate role permissions.

### User Management (ADMIN only)

#### List Users

```http
GET /api/v1/admin/users
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "users": [
    {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "ADMIN",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User by ID

```http
GET /api/v1/admin/users/:id
Authorization: Bearer <token>
```

#### Create User

```http
POST /api/v1/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "EDITOR",
  "is_active": true
}
```

**Validation:**

- `name`: 2-100 characters (required)
- `email`: Valid email (required)
- `password`: 8-128 characters (required)
- `role`: `ADMIN` | `EDITOR` (required)
- `is_active`: Boolean (optional)

#### Update User

```http
PUT /api/v1/admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "EDITOR",
  "is_active": false
}
```

#### Toggle User Active Status

```http
PATCH /api/v1/admin/users/:id/toggle-active
Authorization: Bearer <token>
```

#### Change User Password

```http
PATCH /api/v1/admin/users/:id/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "newpassword123"
}
```

#### Delete User

```http
DELETE /api/v1/admin/users/:id
Authorization: Bearer <token>
```

---

### Firm Management

#### List Firms

```http
GET /api/v1/admin/firms
Authorization: Bearer <token>
```

#### Get Firm by ID

```http
GET /api/v1/admin/firms/:id
Authorization: Bearer <token>
```

#### Create Firm

```http
POST /api/v1/admin/firms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Firm Name",
  "slug": "firm-name",
  "firm_type": "prop_firm",
  "logo_url": "https://...",
  "founded_year": 2020,
  "rating": 4.5,
  "review_count": 150,
  "max_allocation": 1000000,
  "description": "Firm description",
  "location": "United States",
  "guide_video_url": "https://...",
  "is_active": true
}
```

**Validation:**

- `name`: Max 255 characters (required)
- `slug`: Max 255 characters, unique (required)
- `firm_type`: `prop_firm` | `futures_firm` (required)
- `logo_url`: Valid URL (optional)
- `founded_year`: 1900-2100 (optional)
- `rating`: 0-5 (optional)
- `review_count`: Integer, min 0 (optional)
- `max_allocation`: Integer, min 0 (optional)
- `description`: String (optional)
- `location`: Max 255 characters (optional)
- `guide_video_url`: Valid URL (optional)
- `is_active`: Boolean (default: true)

#### Update Firm

```http
PUT /api/v1/admin/firms/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Firm Name",
  "rating": 4.8,
  "trading_platform_ids": ["uuid1", "uuid2"],
  "broker_ids": ["uuid1"],
  "payout_method_ids": ["uuid1", "uuid2"],
  "payment_method_ids": ["uuid1"],
  "asset_ids": ["uuid1", "uuid2"],
  "restricted_country_ids": ["uuid1"]
}
```

**Note:** All association arrays are optional. Providing them will replace existing associations.

#### Toggle Firm Active Status

```http
PATCH /api/v1/admin/firms/:id/toggle-active
Authorization: Bearer <token>
```

#### Delete Firm

```http
DELETE /api/v1/admin/firms/:id
Authorization: Bearer <token>
```

**Note:** Firm cannot be deleted if it has associated records (futures_programs, account_types, rules, payout_policies, coupons).

---

### Broker Management

#### List Brokers

```http
GET /api/v1/admin/brokers
Authorization: Bearer <token>
```

#### Create Broker

```http
POST /api/v1/admin/brokers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Broker Name",
  "slug": "broker-name",
  "logo_url": "https://...",
  "broker_type": "broker",
  "website_url": "https://...",
  "is_active": true
}
```

**Validation:**

- `name`: Required
- `slug`: Required, unique
- `broker_type`: `broker` | `data_feed` | `both` (default: `broker`)
- `logo_url`: Valid URL (optional)
- `website_url`: Valid URL (optional)
- `is_active`: Boolean (default: true)

#### Update Broker

```http
PUT /api/v1/admin/brokers/:id
Authorization: Bearer <token>
```

#### Toggle Broker Active Status

```http
PATCH /api/v1/admin/brokers/:id/toggle-active
Authorization: Bearer <token>
```

#### Delete Broker

```http
DELETE /api/v1/admin/brokers/:id
Authorization: Bearer <token>
```

**Note:** Broker cannot be deleted if associated with any firms.

---

### Trading Platform Management

#### List Platforms

```http
GET /api/v1/admin/platforms
Authorization: Bearer <token>
```

#### Create Platform

```http
POST /api/v1/admin/platforms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Platform Name",
  "slug": "platform-name",
  "category": "both",
  "logo_url": "https://...",
  "website_url": "https://...",
  "is_active": true
}
```

**Validation:**

- `name`: Required
- `slug`: Required, unique
- `category`: `prop` | `futures` | `both` (default: `both`)
- `logo_url`: Valid URL (optional)
- `website_url`: Valid URL (optional)
- `is_active`: Boolean (default: true)

#### Update Platform

```http
PUT /api/v1/admin/platforms/:id
Authorization: Bearer <token>
```

#### Toggle Platform Active Status

```http
PATCH /api/v1/admin/platforms/:id/toggle-active
Authorization: Bearer <token>
```

#### Delete Platform

```http
DELETE /api/v1/admin/platforms/:id
Authorization: Bearer <token>
```

**Note:** Platform cannot be deleted if associated with any firms.

---

### Payment Method Management

#### List Payment Methods

```http
GET /api/v1/admin/payment-methods
Authorization: Bearer <token>
```

#### Create Payment Method

```http
POST /api/v1/admin/payment-methods
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Credit Card",
  "slug": "credit-card",
  "logo_url": "https://...",
  "is_active": true
}
```

**Validation:**

- `name`: Required
- `slug`: Required, unique
- `logo_url`: Valid URL (optional)
- `is_active`: Boolean (default: true)

#### Update Payment Method

```http
PUT /api/v1/admin/payment-methods/:id
Authorization: Bearer <token>
```

#### Toggle Payment Method Active Status

```http
PATCH /api/v1/admin/payment-methods/:id/toggle-active
Authorization: Bearer <token>
```

#### Delete Payment Method

```http
DELETE /api/v1/admin/payment-methods/:id
Authorization: Bearer <token>
```

**Note:** Payment method cannot be deleted if associated with any firms.

---

### Payout Method Management

#### List Payout Methods

```http
GET /api/v1/admin/payout-methods
Authorization: Bearer <token>
```

#### Create Payout Method

```http
POST /api/v1/admin/payout-methods
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bank Transfer",
  "slug": "bank-transfer",
  "logo_url": "https://...",
  "is_active": true
}
```

**Validation:** Same as Payment Method

#### Update Payout Method

```http
PUT /api/v1/admin/payout-methods/:id
Authorization: Bearer <token>
```

#### Toggle Payout Method Active Status

```http
PATCH /api/v1/admin/payout-methods/:id/toggle-active
Authorization: Bearer <token>
```

#### Delete Payout Method

```http
DELETE /api/v1/admin/payout-methods/:id
Authorization: Bearer <token>
```

**Note:** Payout method cannot be deleted if associated with any firms.

---

### Futures Management

#### Instrument Types

##### List Instrument Types

```http
GET /api/v1/admin/futures/instrument-types
Authorization: Bearer <token>
```

##### Create Instrument Type

```http
POST /api/v1/admin/futures/instrument-types
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Forex",
  "description": "Forex instruments"
}
```

**Validation:**

- `name`: Max 255 characters (required)
- `description`: String (optional)

##### Update Instrument Type

```http
PUT /api/v1/admin/futures/instrument-types/:id
Authorization: Bearer <token>
```

##### Delete Instrument Type

```http
DELETE /api/v1/admin/futures/instrument-types/:id
Authorization: Bearer <token>
```

#### Futures Exchanges

##### List Futures Exchanges

```http
GET /api/v1/admin/futures/exchanges
Authorization: Bearer <token>
```

##### Create Futures Exchange

```http
POST /api/v1/admin/futures/exchanges
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "CME Group",
  "code": "CME"
}
```

**Validation:**

- `name`: Max 255 characters (required)
- `code`: Max 50 characters (required)

##### Update Futures Exchange

```http
PUT /api/v1/admin/futures/exchanges/:id
Authorization: Bearer <token>
```

##### Delete Futures Exchange

```http
DELETE /api/v1/admin/futures/exchanges/:id
Authorization: Bearer <token>
```

**Note:** Exchange cannot be deleted if associated with any firms.

#### Futures Programs

##### List Futures Programs

```http
GET /api/v1/admin/futures/programs
Authorization: Bearer <token>
```

##### Create Futures Program

```http
POST /api/v1/admin/futures/programs
Authorization: Bearer <token>
Content-Type: application/json

{
  "firm_id": "uuid",
  "name": "50K Program",
  "account_size": 50000,
  "price": 299.00,
  "profit_target": 5000.00,
  "max_drawdown": 2500.00,
  "trailing_drawdown": false,
  "reset_fee": 99.00,
  "notes": "Program notes"
}
```

**Validation:**

- `firm_id`: UUID (required)
- `name`: Max 255 characters (required)
- `account_size`: Integer, min 0 (required)
- `price`: Number, min 0 (required)
- `profit_target`: Number (required)
- `max_drawdown`: Number (required)
- `trailing_drawdown`: Boolean (default: false)
- `reset_fee`: Number, min 0 (optional)
- `notes`: String (optional)

##### Update Futures Program

```http
PUT /api/v1/admin/futures/programs/:id
Authorization: Bearer <token>
```

##### Delete Futures Program

```http
DELETE /api/v1/admin/futures/programs/:id
Authorization: Bearer <token>
```

---

### Prop Firm Management

#### Combined Prop Config

```http
GET /api/v1/admin/prop
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Prop config fetched successfully",
  "assets": [...],
  "accountTypes": [...],
  "evaluationStages": [...]
}
```

#### Assets

##### List Assets

```http
GET /api/v1/admin/prop/assets
Authorization: Bearer <token>
```

##### Create Asset

```http
POST /api/v1/admin/prop/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Forex"
}
```

**Validation:**

- `name`: Max 255 characters (required)

##### Update Asset

```http
PUT /api/v1/admin/prop/assets/:id
Authorization: Bearer <token>
```

##### Toggle Asset Active Status

```http
PATCH /api/v1/admin/prop/assets/:id/toggle-active
Authorization: Bearer <token>
```

##### Delete Asset

```http
DELETE /api/v1/admin/prop/assets/:id
Authorization: Bearer <token>
```

**Note:** Asset cannot be deleted if associated with any firms.

#### Account Types

##### List Account Types

```http
GET /api/v1/admin/prop/account-types
Authorization: Bearer <token>
```

##### Create Account Type

```http
POST /api/v1/admin/prop/account-types
Authorization: Bearer <token>
Content-Type: application/json

{
  "firm_id": "uuid",
  "name": "10K Challenge",
  "starting_balance": 10000,
  "price": 99.00,
  "profit_target": 1000.00,
  "daily_drawdown": 500.00,
  "max_drawdown": 1000.00,
  "profit_split": 80.00,
  "evaluation_required": true,
  "program_variant": "1-Step",
  "program_name": "Challenge"
}
```

**Validation:**

- `firm_id`: UUID (required)
- `name`: Max 255 characters (required)
- `starting_balance`: Integer, min 0 (required)
- `price`: Number, min 0 (required)
- `profit_target`: Number (required)
- `daily_drawdown`: Number (required)
- `max_drawdown`: Number (required)
- `profit_split`: Number, 0-100 (required)
- `evaluation_required`: Boolean (default: true)
- `program_variant`: Max 255 characters (optional)
- `program_name`: Max 255 characters (optional)

##### Update Account Type

```http
PUT /api/v1/admin/prop/account-types/:id
Authorization: Bearer <token>
```

##### Delete Account Type

```http
DELETE /api/v1/admin/prop/account-types/:id
Authorization: Bearer <token>
```

**Note:** Account type cannot be deleted if it has evaluation stages or coupon associations.

#### Evaluation Stages

##### List Evaluation Stages

```http
GET /api/v1/admin/prop/evaluation-stages
Authorization: Bearer <token>
```

##### Create Evaluation Stage

```http
POST /api/v1/admin/prop/evaluation-stages
Authorization: Bearer <token>
Content-Type: application/json

{
  "account_type_id": "uuid",
  "stage_number": 1,
  "profit_target": 1000.00,
  "max_daily_loss": 500.00,
  "max_total_loss": 1000.00,
  "min_trading_days": 5
}
```

**Validation:**

- `account_type_id`: UUID (required)
- `stage_number`: Integer, min 1 (required)
- `profit_target`: Number (required)
- `max_daily_loss`: Number (required)
- `max_total_loss`: Number (required)
- `min_trading_days`: Integer, min 0 (required)

##### Update Evaluation Stage

```http
PUT /api/v1/admin/prop/evaluation-stages/:id
Authorization: Bearer <token>
```

##### Delete Evaluation Stage

```http
DELETE /api/v1/admin/prop/evaluation-stages/:id
Authorization: Bearer <token>
```

---

### Rules and Payout Policies

#### Rules

##### List Rules

```http
GET /api/v1/admin/rules
Authorization: Bearer <token>
```

##### Create Rule

```http
POST /api/v1/admin/rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "firm_id": "uuid",
  "category": "trading",
  "title": "Rule Title",
  "description": "Rule description"
}
```

**Validation:**

- `firm_id`: UUID (required)
- `category`: `trading` | `risk` | `consistency` | `payout` (required)
- `title`: Max 255 characters (required)
- `description`: String (required)

##### Update Rule

```http
PUT /api/v1/admin/rules/:id
Authorization: Bearer <token>
```

##### Delete Rule

```http
DELETE /api/v1/admin/rules/:id
Authorization: Bearer <token>
```

#### Payout Policies

##### List Payout Policies

```http
GET /api/v1/admin/payout-policies
Authorization: Bearer <token>
```

##### Create Payout Policy

```http
POST /api/v1/admin/payout-policies
Authorization: Bearer <token>
Content-Type: application/json

{
  "firm_id": "uuid",
  "payout_frequency": "Weekly",
  "first_payout_days": 30,
  "profit_split_initial": 50.00,
  "profit_split_max": 90.00,
  "notes": "Payout policy notes",
  "program_type": "1-Step"
}
```

**Validation:**

- `firm_id`: UUID (required)
- `payout_frequency`: Max 255 characters (required)
- `first_payout_days`: Integer, min 0 (required)
- `profit_split_initial`: Number, 0-100 (required)
- `profit_split_max`: Number, 0-100 (required)
- `notes`: String (optional)
- `program_type`: Max 255 characters (optional)

##### Update Payout Policy

```http
PUT /api/v1/admin/payout-policies/:id
Authorization: Bearer <token>
```

##### Delete Payout Policy

```http
DELETE /api/v1/admin/payout-policies/:id
Authorization: Bearer <token>
```

---

### Coupon Management

#### List Coupons

```http
GET /api/v1/admin/coupons
Authorization: Bearer <token>
```

#### Create Coupon

```http
POST /api/v1/admin/coupons
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "SAVE50",
  "discount_text": "50% OFF",
  "discount_value": 50.00,
  "discount_type": "percentage",
  "description": "Coupon description",
  "start_date": "2024-01-01T00:00:00.000Z",
  "end_date": "2024-12-31T23:59:59.000Z",
  "is_active": true
}
```

**Validation:**

- `code`: Max 100 characters (required)
- `discount_text`: Max 255 characters (required)
- `discount_value`: Number, min 0 (optional)
- `discount_type`: `percentage` | `fixed` (required)
- `description`: String (optional)
- `start_date`: Date (optional)
- `end_date`: Date (optional)
- `is_active`: Boolean (default: true)

#### Update Coupon

```http
PUT /api/v1/admin/coupons/:id
Authorization: Bearer <token>
```

#### Toggle Coupon Active Status

```http
PATCH /api/v1/admin/coupons/:id/toggle-active
Authorization: Bearer <token>
```

#### Delete Coupon

```http
DELETE /api/v1/admin/coupons/:id
Authorization: Bearer <token>
```

**Note:** Coupon cannot be deleted if associated with firms or account types.

#### Assign Coupon to Firm

```http
POST /api/v1/admin/coupons/assign/firm
Authorization: Bearer <token>
Content-Type: application/json

{
  "firm_id": "uuid",
  "coupon_id": "uuid"
}
```

#### Assign Coupon to Account Type

```http
POST /api/v1/admin/coupons/assign/account-type
Authorization: Bearer <token>
Content-Type: application/json

{
  "account_type_id": "uuid",
  "coupon_id": "uuid"
}
```

---

### Country Management

#### List Countries

```http
GET /api/v1/admin/countries
Authorization: Bearer <token>
```

**Response:** Countries sorted alphabetically by name

#### Create Country

```http
POST /api/v1/admin/countries
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "United States",
  "code": "US",
  "flag_url": "https://..."
}
```

**Validation:**

- `name`: Required, unique
- `code`: 2 characters, unique (required)
- `flag_url`: Valid URL (optional)

#### Update Country

```http
PUT /api/v1/admin/countries/:id
Authorization: Bearer <token>
```

#### Delete Country

```http
DELETE /api/v1/admin/countries/:id
Authorization: Bearer <token>
```

**Note:** Country cannot be deleted if used as a restricted country for any firm.

---

### Commission Management

#### List Commissions

```http
GET /api/v1/admin/commissions
Authorization: Bearer <token>
```

**Query Parameters:**

- `account_type_id` (optional): Filter by account type
- `futures_program_id` (optional): Filter by futures program

**Example:**

```http
GET /api/v1/admin/commissions?account_type_id=uuid
```

#### Create Commission

```http
POST /api/v1/admin/commissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "account_type_id": "uuid",
  "asset_name": "EUR/USD",
  "commission_type": "per_lot",
  "commission_value": 7.00,
  "commission_text": "$7 per lot",
  "notes": "Commission notes"
}
```

**Validation:**

- Either `account_type_id` OR `futures_program_id` must be provided (not both)
- `asset_name`: Max 255 characters (required)
- `commission_type`: `per_lot` | `percentage` | `fixed` | `none` (required)
- `commission_value`: Number, min 0 (optional)
- `commission_text`: String (optional)
- `notes`: String (optional)

#### Update Commission

```http
PUT /api/v1/admin/commissions/:id
Authorization: Bearer <token>
```

#### Delete Commission

```http
DELETE /api/v1/admin/commissions/:id
Authorization: Bearer <token>
```

---

## Data Models

### User

```typescript
{
  id: UUID (primary key)
  name: string
  email: string (unique)
  password_hash: string
  role: "ADMIN" | "EDITOR"
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Firm

```typescript
{
  id: UUID (primary key)
  name: string
  slug: string (unique)
  firm_type: "prop_firm" | "futures_firm"
  logo_url: string (nullable)
  founded_year: integer (nullable)
  rating: decimal(3,2) (nullable)
  review_count: integer (default: 0)
  max_allocation: integer (nullable)
  description: text (nullable)
  location: string (nullable)
  guide_video_url: text (nullable)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

### Broker

```typescript
{
  id: UUID (primary key)
  name: string
  slug: string (unique)
  logo_url: text (nullable)
  broker_type: "broker" | "data_feed" | "both" (default: "broker")
  website_url: text (nullable)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

### TradingPlatform

```typescript
{
  id: UUID (primary key)
  name: string
  slug: string (unique)
  category: "prop" | "futures" | "both" (default: "both")
  logo_url: text (nullable)
  website_url: text (nullable)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

### AccountType (Prop Firm)

```typescript
{
  id: UUID (primary key)
  firm_id: UUID (foreign key -> Firm)
  name: string
  starting_balance: integer
  price: decimal(10,2)
  profit_target: decimal(10,2)
  daily_drawdown: decimal(10,2)
  max_drawdown: decimal(10,2)
  profit_split: decimal(5,2)
  evaluation_required: boolean (default: true)
  program_variant: string (nullable)
  program_name: string (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

### FuturesProgram

```typescript
{
  id: UUID (primary key)
  firm_id: UUID (foreign key -> Firm)
  name: string
  account_size: integer
  price: decimal(10,2)
  profit_target: decimal(10,2)
  max_drawdown: decimal(10,2)
  trailing_drawdown: boolean (default: false)
  reset_fee: decimal(10,2) (nullable)
  notes: text (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

### Rule

```typescript
{
  id: UUID (primary key)
  firm_id: UUID (foreign key -> Firm)
  category: "trading" | "risk" | "consistency" | "payout"
  title: string
  description: text
  created_at: timestamp
  updated_at: timestamp
}
```

### PayoutPolicy

```typescript
{
  id: UUID (primary key)
  firm_id: UUID (foreign key -> Firm)
  payout_frequency: string
  first_payout_days: integer
  profit_split_initial: decimal(5,2)
  profit_split_max: decimal(5,2)
  notes: text (nullable)
  program_type: string (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

### Coupon

```typescript
{
  id: UUID (primary key)
  code: string
  discount_text: string
  discount_value: decimal(10,2) (nullable)
  discount_type: "percentage" | "fixed"
  description: text (nullable)
  start_date: date (nullable)
  end_date: date (nullable)
  is_active: boolean (default: true)
  created_at: timestamp
  updated_at: timestamp
}
```

### Commission

```typescript
{
  id: UUID (primary key)
  account_type_id: UUID (foreign key -> AccountType, nullable)
  futures_program_id: UUID (foreign key -> FuturesProgram, nullable)
  asset_name: string
  commission_type: "per_lot" | "percentage" | "fixed" | "none" (default: "none")
  commission_value: decimal(10,2) (nullable)
  commission_text: text (nullable)
  notes: text (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

---

## Notes

1. **UUID Format**: All IDs are UUIDs (v4)
2. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
3. **Pagination**: Currently not implemented for list endpoints
4. **Filtering**: Public firm list supports filtering and sorting
5. **Active Coupons**: Public API automatically filters coupons based on:
   - `is_active = true`
   - `start_date <= NOW()` (or null)
   - `end_date > NOW()` (or null)
6. **Association Management**: When updating firm associations, providing an array replaces all existing associations
7. **Deletion Safety**: Most entities check for associations before allowing deletion
8. **CORS**: Configured to allow specific origins from `CLIENT_URL` environment variable

---

## Environment Variables

Required environment variables:

- `PORT`: Server port
- `JWT_SECRET`: Secret for JWT signing
- `JWT_EXPIRATION`: Token expiration (e.g., "7d")
- `APP_NAME`: Application name
- `CLIENT_URL`: Allowed CORS origins (comma-separated)
- `NODE_ENV`: Environment (development/production)
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`: Database credentials
- `VERSION`: API version (e.g., "v1")
- `COLORED_LOG`: Enable colored logs ("true"/"false")
- `MORGAN_LOG_LEVEL`: Morgan log level

Optional:

- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: For creating initial admin user

---

## Health Check

```http
GET /api/ping
```

**Response:**

```
ping success!
```

---

_Last Updated: 2024_
