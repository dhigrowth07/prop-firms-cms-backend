## PROP & FUTURES FIRMS BACKEND – IMPLEMENTATION CHECKLIST

Use this as a sequential roadmap to implement the entire backend and CMS as described in `PROP FIRMS BACKEND DOCUMENTATION.txt`.

---

## 0. Project & Environment Baseline

- [x] **Verify Node/Express setup**
  - [x] Confirm `index.js` boots without errors using sample env values.
  - [x] Confirm `/` and `/api/ping` work.
- [x] **Configure environment variables**
  - [x] Create `.env` with all required keys from `config/env.config.js`:
    - [x] `PORT`, `APP_NAME`, `VERSION`
    - [x] `CLIENT_URL`, `NODE_ENV`, `COLORED_LOG`, `MORGAN_LOG_LEVEL`
    - [x] `JWT_SECRET`, `JWT_EXPIRATION`
    - [x] `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`
  - [x] Verify app exits if any required env is missing.
- [x] **Verify DB connectivity**
  - [x] Ensure Postgres instance is running.
  - [x] Confirm credentials in `.env` match DB.
  - [x] Run the server and verify `connectDB()` succeeds.

---

## 1. Sequelize & Core Models

- [x] **Finalize Sequelize configuration**
  - [x] Confirm `config/connectDB.js` connects with retry logic.
  - [x] Decide on naming conventions (snake_case vs camelCase) and timestamps.
- [x] **Implement core `Firm` model**
  - [x] Create `models/Firm.model.js` for the `firms` table with fields:
    - [x] `id (UUID, PK)`
    - [x] `name`
    - [x] `slug (UNIQUE)`
    - [x] `firm_type (ENUM: prop_firm, futures_firm)`
    - [x] `logo_url`
    - [x] `founded_year`
    - [x] `rating`
    - [x] `review_count`
    - [x] `max_allocation`
    - [x] `description`
    - [x] `is_active`
    - [x] `created_at`, `updated_at`
  - [x] Register `Firm` in `config/connectDB.js` models section.
- [x] **Implement global reference models**
  - [x] `TradingPlatform` (`trading_platforms`)
  - [x] `Broker` (`brokers`)
  - [x] `PayoutMethod` (`payout_methods`)
  - [x] `PaymentMethod` (`payment_methods`)
  - [x] Ensure fields match documentation (name, slug, logo_url, category/broker_type, website_url, is_active).
- [x] **Implement futures-specific models**
  - [x] `InstrumentType` (`instrument_types`)
  - [x] `FuturesExchange` (`futures_exchanges`)
  - [x] `FuturesProgram` (`futures_programs`)
- [x] **Implement prop-specific models**
  - [x] `Asset` (`assets`)
  - [x] `AccountType` (`account_types`)
  - [x] `EvaluationStage` (`evaluation_stages`)
- [x] **Implement rules & policies models**
  - [x] `Rule` (`rules`)
  - [x] `PayoutPolicy` (`payout_policies`)
- [x] **Implement coupon models**
  - [x] `Coupon` (`coupons`)
  - [x] Junction `FirmCoupon` (`firm_coupons`)
  - [x] Optional `CouponAccountType` (`coupon_account_types`)

---

## 2. Model Associations

- [x] **Firm relationships**
  - [x] `Firm` ↔ `TradingPlatform` via `firm_trading_platforms`
  - [x] `Firm` ↔ `Broker` via `firm_brokers`
  - [x] `Firm` ↔ `PayoutMethod` via `firm_payout_methods`
  - [x] `Firm` ↔ `PaymentMethod` via `firm_payment_methods`
  - [x] `Firm` ↔ `FuturesExchange` via `firm_futures_exchanges`
  - [x] `Firm` ↔ `Asset` via `firm_assets`
  - [x] `Firm` ↔ `FuturesProgram` (one-to-many)
  - [x] `Firm` ↔ `AccountType` (one-to-many)
  - [x] `Firm` ↔ `Rule` (one-to-many)
  - [x] `Firm` ↔ `PayoutPolicy` (one-to-many).
- [x] **AccountType & EvaluationStage**
  - [x] `AccountType` ↔ `EvaluationStage` (one-to-many).
- [x] **Coupon relationships**
  - [x] `Firm` ↔ `Coupon` via `FirmCoupon`.
  - [x] `Coupon` ↔ `AccountType` via `CouponAccountType` (optional).
- [x] **Sync associations**
  - [x] Ensure each model exports an `associate(models)` function.
  - [x] In `connectDB.js`, wire up all models and call their `associate` functions.
  - [x] Run `scripts/syncModels.js` to verify tables/relations sync correctly.

---

## 3. Auth & User Management (CMS Access)

> Note: Documentation says "no user accounts (for now)", but CMS needs secure access. Implement minimal admin/auth only for CMS.

- [x] **Design `User` model (CMS users)**
  - [x] Fields: `id`, `name`, `email`, `password_hash`, `role (ADMIN | EDITOR)`, `is_active`, timestamps.
  - [x] Register `User` in Sequelize config.
- [x] **Implement password handling**
  - [x] Use `utils/passwordUtils.js` for hashing and comparison.
  - [ ] Seed at least one ADMIN user (migration/seed script or manual insert).
- [x] **Fix `authMiddleware`**
  - [x] Use `verifyToken` from `utils/jwtUtils.js`.
  - [x] Load `User` by `decoded.id`.
  - [x] Handle missing/expired/invalid token with proper `errorResponse`.
  - [x] Ensure `authorizeRoles` checks `req.user.role`.
- [x] **Auth routes & controller**
  - [x] `POST /api/{VERSION}/auth/login` for CMS login:
    - [x] Validate body with Joi (`validators/auth.validator.js`).
    - [x] Check email/password, issue JWT with `generateToken`.
    - [x] Return token (and optionally set HTTP-only cookie).
  - [x] `GET /api/{VERSION}/auth/me`:
    - [x] Use `authenticate` middleware.
    - [x] Return basic user profile and role.

---

## 4. Validation Layer (Joi Schemas)

- [x] **Create validators folder structure**
  - [x] `validators/firm.validator.js`
  - [x] `validators/platform.validator.js`
  - [x] `validators/broker.validator.js`
  - [x] `validators/payout.validator.js`
  - [x] `validators/payment.validator.js`
  - [x] `validators/futures.validator.js`
  - [x] `validators/prop.validator.js`
  - [x] `validators/rules.validator.js`
  - [x] `validators/coupon.validator.js`
  - [x] `validators/auth.validator.js`
- [x] **Define Joi schemas for admin APIs**
  - [x] Create/update payloads for each entity (firms, platforms, brokers, etc.).
  - [ ] Use `middleware/validation.middleware.js` to attach to routes.

---

## 5. Admin (CMS) API – Protected Routes

- [x] **Routing structure**
  - [x] Expand `routes/index.js` to include `/admin` namespace:
  - [x] `/admin/firms`
  - [x] `/admin/coupons`
  - [x] `/admin/platforms`
  - [x] `/admin/brokers`
  - [x] `/admin/payout-methods`
  - [x] `/admin/payment-methods`
  - [x] `/admin/futures`
  - [x] `/admin/prop`
- [x] **Controllers**
  - [x] Create controllers (e.g. `controllers/firm.controller.js`, etc.).
  - [x] Implement CRUD-style handlers with:
    - [x] Authentication (`authenticate`) for all admin routes.
    - [x] Role-based access control (`authorizeRoles("ADMIN", "EDITOR")`).
    - [x] Strict content rules (no financial logic).
    - [x] Soft delete where appropriate (e.g. mark `is_active` or `deleted_at`).
- [x] **Firms admin endpoints**
  - [x] `POST /api/{VERSION}/admin/firms`
  - [x] `PUT /api/{VERSION}/admin/firms/:id`
  - [x] Optional: `GET /admin/firms`, `GET /admin/firms/:id`.
- [x] **Coupons admin endpoints**
  - [x] `POST /api/{VERSION}/admin/coupons`
  - [x] `PUT /api/{VERSION}/admin/coupons/:id`
  - [x] Manage relations to firms and account types.
- [x] **Global reference admin endpoints**
  - [x] CRUD for trading platforms, brokers, payout methods, payment methods, assets, futures exchanges, instrument types.
- [x] **Rules & policies admin endpoints**
  - [x] CRUD for `rules` and `payout_policies` per firm.

---

## 6. Public Read-Only API

- [x] **Firms listing endpoints**
  - [x] `GET /api/{VERSION}/firms?firm_type=prop_firm`
  - [x] `GET /api/{VERSION}/firms?firm_type=futures_firm`
  - [x] Implement filters:
    - [x] Only `is_active = true`.
    - [x] Join and include related reference data (platforms, brokers, payouts, etc.).
  - [x] Shape responses using `successResponse` helper.
- [x] **Firm detail endpoint**
  - [x] `GET /api/{VERSION}/firms/:slug`
  - [x] Include:
    - [x] Core firm fields.
    - [x] Related platforms/brokers/payout/payment methods.
    - [x] For `prop_firm`: assets, account types, evaluation stages, rules, payout policies.
    - [x] For `futures_firm`: futures exchanges, instrument types, futures programs, rules, payout policies.
    - [x] Applicable coupons (filtered).
- [x] **Coupon filtering logic (display-only)**
  - [x] Implement query/filter that enforces:
    - [x] `is_active = true`
    - [x] `start_date <= NOW() OR start_date IS NULL`
    - [x] `end_date > NOW() OR end_date IS NULL`
  - [x] No tracking, no validation, no application logic.

---

## 7. Error Handling, Logging & Observability

- [x] **Standardize API responses**
  - [x] Ensure all controllers use `successResponse` and `errorResponse`.
  - [x] Use `errorMiddleware` for unhandled exceptions.
- [x] **Logging**
  - [x] Confirm `morganMiddleware` is used for request logging.
  - [x] Ensure `logger` is used inside controllers and DB operations.
  - [x] Configure file logging in production as needed.

---

## 8. Security & Hardening

- [ ] **CORS & cookies**
  - [ ] Verify `CLIENT_URL` list is correct and secure.
  - [ ] Confirm cookies (if used) are HTTP-only and secure in production.
- [ ] **JWT security**
  - [ ] Use strong `JWT_SECRET`.
  - [ ] Reasonable `JWT_EXPIRATION`.
  - [ ] Implement token refresh only if needed for CMS UX.

---

## 9. Testing & Verification

- [ ] **Unit tests (if added later)**
  - [ ] Models & associations.
  - [ ] Coupon filter logic.
  - [ ] Public endpoints shapes.
- [ ] **Manual API verification**
  - [ ] Smoke test all admin routes with valid/invalid payloads.
  - [ ] Smoke test all public routes from the frontend or Postman.
  - [ ] Verify frontend does not perform any business or financial logic.

---

## 10. Deployment & Maintenance

- [ ] **Deployment config**
  - [ ] Environment-specific `.env` handling.
  - [ ] Logging paths and log rotation for production.
- [ ] **CMS operations**
  - [ ] Document how admins create/update firms and global reference data.
  - [ ] Document how to safely soft-delete and unpublish content.
