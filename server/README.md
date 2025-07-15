# Vehicle Service Management API Documentation

## Base URL
```
http://localhost:3001/api
```

## Table of Contents
- [Customer Management](#customer-management)
- [Inventory Management](#inventory-management)
- [Service Management](#service-management)
- [Invoice Management](#invoice-management)
- [Analytics](#analytics)
- [Error Handling](#error-handling)

---

## Customer Management

### Get All Customers
**GET** `/customers`

Get a list of all customers with optional search functionality.

**Query Parameters:**
- `search` (optional): Search by name, mobile, or vehicle registration number

**Request Example:**
```http
GET /api/customers?search=john
```

**Response Example:**
```json
[
  {
    "_id": "64f5a8b9c1234567890abcde",
    "name": "John Doe",
    "mobile": "1234567890",
    "address": "123 Main St, City",
    "vehicleRegNo": "ABC123",
    "vehicleModel": "Honda Civic",
    "engineNo": "ENG001",
    "frameNo": "FRAME001",
    "createdAt": "2023-09-04T10:30:00Z"
  }
]
```

### Create or Find Customer
**POST** `/customers`

Create a new customer or find existing customer by vehicle registration number.

**Request Body:**
```json
{
  "name": "John Doe",
  "mobile": "1234567890",
  "address": "123 Main St, City",
  "vehicleRegNo": "ABC123",
  "vehicleModel": "Honda Civic",
  "engineNo": "ENG001",
  "frameNo": "FRAME001"
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abcde",
  "name": "John Doe",
  "mobile": "1234567890",
  "address": "123 Main St, City",
  "vehicleRegNo": "ABC123",
  "vehicleModel": "Honda Civic",
  "engineNo": "ENG001",
  "frameNo": "FRAME001",
  "createdAt": "2023-09-04T10:30:00Z"
}
```

### Get Customer by ID
**GET** `/customers/:id`

Get a specific customer by their ID.

**Request Example:**
```http
GET /api/customers/64f5a8b9c1234567890abcde
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "_id": "64f5a8b9c1234567890abcde",
    "name": "John Doe",
    "mobile": "1234567890",
    "address": "123 Main St, City",
    "vehicleRegNo": "ABC123",
    "vehicleModel": "Honda Civic",
    "engineNo": "ENG001",
    "frameNo": "FRAME001",
    "createdAt": "2023-09-04T10:30:00Z"
  }
}
```

### Update Customer
**PATCH** `/customers/:id`

Update customer information (vehicle registration number cannot be changed).

**Request Body:**
```json
{
  "name": "John Smith",
  "mobile": "9876543210",
  "address": "456 Oak Ave, City"
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abcde",
  "name": "John Smith",
  "mobile": "9876543210",
  "address": "456 Oak Ave, City",
  "vehicleRegNo": "ABC123",
  "vehicleModel": "Honda Civic",
  "engineNo": "ENG001",
  "frameNo": "FRAME001",
  "createdAt": "2023-09-04T10:30:00Z"
}
```

---

## Inventory Management

### Get All Inventory Items
**GET** `/inventory`

Get all inventory items with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category ("spare-part" or "consumable")
- `search` (optional): Search by name or SKU
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `inStock` (optional): Filter items in stock ("true")

**Request Example:**
```http
GET /api/inventory?category=spare-part&inStock=true
```

**Response Example:**
```json
[
  {
    "_id": "64f5a8b9c1234567890abcdf",
    "name": "Oil Filter",
    "sku": "OF001",
    "price": 25.99,
    "quantity": 50,
    "category": "spare-part"
  }
]
```

### Add Inventory Item
**POST** `/inventory`

Add a new inventory item.

**Request Body:**
```json
{
  "name": "Oil Filter",
  "sku": "OF001",
  "price": 25.99,
  "quantity": 50,
  "category": "spare-part"
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abcdf",
  "name": "Oil Filter",
  "sku": "OF001",
  "price": 25.99,
  "quantity": 50,
  "category": "spare-part"
}
```

### Get Inventory Item by ID
**GET** `/inventory/:id`

Get a specific inventory item by ID.

**Request Example:**
```http
GET /api/inventory/64f5a8b9c1234567890abcdf
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abcdf",
  "name": "Oil Filter",
  "sku": "OF001",
  "price": 25.99,
  "quantity": 50,
  "category": "spare-part"
}
```

### Update Inventory Item
**PATCH** `/inventory/:id`

Update inventory item details (SKU cannot be modified).

**Request Body:**
```json
{
  "name": "Premium Oil Filter",
  "price": 29.99,
  "quantity": 75
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abcdf",
  "name": "Premium Oil Filter",
  "sku": "OF001",
  "price": 29.99,
  "quantity": 75,
  "category": "spare-part"
}
```

### Delete Inventory Item
**DELETE** `/inventory/:id`

Delete an inventory item.

**Request Example:**
```http
DELETE /api/inventory/64f5a8b9c1234567890abcdf
```

**Response Example:**
```json
{
  "message": "Inventory item deleted successfully"
}
```

### Restock Inventory Item
**POST** `/inventory/:id/restock`

Add quantity to existing inventory item.

**Request Body:**
```json
{
  "quantity": 25
}
```

**Response Example:**
```json
{
  "message": "Restocked 25 units to Oil Filter",
  "updatedQuantity": 75
}
```

---

## Service Management

### Create Service
**POST** `/service`

Create a new service record and automatically deduct inventory.

**Request Body:**
```json
{
  "customerId": "64f5a8b9c1234567890abcde",
  "km": 50000,
  "serviceCost": 150.00,
  "sparePartsUsed": [
    {
      "item": "64f5a8b9c1234567890abcdf",
      "quantity": 2,
      "unitPrice": 25.99
    }
  ],
  "description": "Regular maintenance service"
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abce0",
  "customer": "64f5a8b9c1234567890abcde",
  "date": "2023-09-04T10:30:00Z",
  "km": 50000,
  "serviceCost": 150.00,
  "sparePartsUsed": [
    {
      "item": "64f5a8b9c1234567890abcdf",
      "quantity": 2,
      "unitPrice": 25.99
    }
  ],
  "description": "Regular maintenance service"
}
```

---

## Invoice Management

### Get All Invoices
**GET** `/invoice`

Get all invoices with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status ("pending" or "paid")
- `fromDate` (optional): Filter from date (ISO format)
- `toDate` (optional): Filter to date (ISO format)

**Request Example:**
```http
GET /api/invoice?status=pending&fromDate=2023-09-01
```

**Response Example:**
```json
[
  {
    "_id": "64f5a8b9c1234567890abce1",
    "invoiceNumber": "INV-20230904-001",
    "customer": {
      "_id": "64f5a8b9c1234567890abcde",
      "name": "John Doe",
      "vehicleRegNo": "ABC123"
    },
    "service": {
      "_id": "64f5a8b9c1234567890abce0",
      "date": "2023-09-04T10:30:00Z",
      "description": "Regular maintenance service"
    },
    "totalAmount": 201.98,
    "discount": 0,
    "netAmount": 201.98,
    "issuedAt": "2023-09-04T10:30:00Z",
    "status": "pending"
  }
]
```

### Create Invoice
**POST** `/invoice`

Create an invoice for an existing service.

**Request Body:**
```json
{
  "customerId": "64f5a8b9c1234567890abcde",
  "serviceId": "64f5a8b9c1234567890abce0",
  "discount": 10.00
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abce1",
  "invoiceNumber": "INV-20230904-001",
  "customer": "64f5a8b9c1234567890abcde",
  "service": "64f5a8b9c1234567890abce0",
  "totalAmount": 201.98,
  "discount": 10.00,
  "netAmount": 191.98,
  "issuedAt": "2023-09-04T10:30:00Z",
  "status": "pending"
}
```

### Create Complete Invoice
**POST** `/invoice/complete`

Create a complete invoice with customer, service, and inventory management in a single transaction.

**Request Body:**
```json
{
  "customerDetails": {
    "name": "Jane Smith",
    "mobile": "9876543210",
    "address": "789 Pine St, City",
    "vehicleRegNo": "XYZ789",
    "vehicleModel": "Toyota Corolla",
    "engineNo": "ENG002",
    "frameNo": "FRAME002"
  },
  "serviceDetails": {
    "km": 75000,
    "serviceCost": 200.00,
    "sparePartsUsed": [
      {
        "item": "64f5a8b9c1234567890abcdf",
        "quantity": 1,
        "unitPrice": 25.99
      }
    ],
    "description": "Full service with parts replacement"
  },
  "discount": 15.00
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abce2",
  "invoiceNumber": "INV-20230904-002",
  "customer": {
    "_id": "64f5a8b9c1234567890abce3",
    "name": "Jane Smith",
    "mobile": "9876543210",
    "address": "789 Pine St, City",
    "vehicleRegNo": "XYZ789",
    "vehicleModel": "Toyota Corolla",
    "engineNo": "ENG002",
    "frameNo": "FRAME002"
  },
  "service": {
    "_id": "64f5a8b9c1234567890abce4",
    "customer": "64f5a8b9c1234567890abce3",
    "date": "2023-09-04T10:30:00Z",
    "km": 75000,
    "serviceCost": 200.00,
    "sparePartsUsed": [
      {
        "item": {
          "_id": "64f5a8b9c1234567890abcdf",
          "name": "Oil Filter",
          "sku": "OF001"
        },
        "quantity": 1,
        "unitPrice": 25.99
      }
    ],
    "description": "Full service with parts replacement"
  },
  "totalAmount": 225.99,
  "discount": 15.00,
  "netAmount": 210.99,
  "issuedAt": "2023-09-04T10:30:00Z",
  "status": "pending"
}
```

### Get Invoice by ID
**GET** `/invoice/:id`

Get a specific invoice with full details.

**Request Example:**
```http
GET /api/invoice/64f5a8b9c1234567890abce1
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abce1",
  "invoiceNumber": "INV-20230904-001",
  "customer": {
    "_id": "64f5a8b9c1234567890abcde",
    "name": "John Doe",
    "mobile": "1234567890",
    "address": "123 Main St, City",
    "vehicleRegNo": "ABC123",
    "vehicleModel": "Honda Civic"
  },
  "service": {
    "_id": "64f5a8b9c1234567890abce0",
    "date": "2023-09-04T10:30:00Z",
    "km": 50000,
    "serviceCost": 150.00,
    "sparePartsUsed": [
      {
        "item": {
          "_id": "64f5a8b9c1234567890abcdf",
          "name": "Oil Filter",
          "sku": "OF001",
          "price": 25.99
        },
        "quantity": 2,
        "unitPrice": 25.99
      }
    ],
    "description": "Regular maintenance service"
  },
  "totalAmount": 201.98,
  "discount": 0,
  "netAmount": 201.98,
  "issuedAt": "2023-09-04T10:30:00Z",
  "status": "pending"
}
```

### Get New Invoice ID
**GET** `/invoice/new-id`

Get the next available invoice number.

**Request Example:**
```http
GET /api/invoice/new-id
```

**Response Example:**
```json
{
  "invoiceNumber": "INV-20230904-003"
}
```

### Get Invoices by Customer
**GET** `/invoice/customers/:customerId/invoices`

Get all invoices for a specific customer.

**Request Example:**
```http
GET /api/invoice/customers/64f5a8b9c1234567890abcde/invoices
```

**Response Example:**
```json
[
  {
    "_id": "64f5a8b9c1234567890abce1",
    "invoiceNumber": "INV-20230904-001",
    "service": {
      "_id": "64f5a8b9c1234567890abce0",
      "date": "2023-09-04T10:30:00Z",
      "km": 50000,
      "serviceCost": 150.00
    },
    "totalAmount": 201.98,
    "discount": 0,
    "netAmount": 201.98,
    "issuedAt": "2023-09-04T10:30:00Z",
    "status": "pending"
  }
]
```

### Update Invoice Status
**PATCH** `/invoice/:id/status`

Update the payment status of an invoice.

**Request Body:**
```json
{
  "status": "paid"
}
```

**Response Example:**
```json
{
  "_id": "64f5a8b9c1234567890abce1",
  "invoiceNumber": "INV-20230904-001",
  "customer": {
    "_id": "64f5a8b9c1234567890abcde",
    "name": "John Doe"
  },
  "service": {
    "_id": "64f5a8b9c1234567890abce0",
    "date": "2023-09-04T10:30:00Z"
  },
  "totalAmount": 201.98,
  "discount": 0,
  "netAmount": 201.98,
  "issuedAt": "2023-09-04T10:30:00Z",
  "status": "paid"
}
```

---

## Analytics

### Get Revenue Analytics
**GET** `/analytics/revenue`

Get revenue analytics grouped by time period.

**Query Parameters:**
- `period` (optional): Time period ("month", "year", "week") - defaults to "month"

**Request Example:**
```http
GET /api/analytics/revenue?period=month
```

**Response Example:**
```json
[
  {
    "_id": {
      "year": 2023,
      "month": 9
    },
    "totalRevenue": 1250.50,
    "invoiceCount": 8
  },
  {
    "_id": {
      "year": 2023,
      "month": 8
    },
    "totalRevenue": 980.25,
    "invoiceCount": 6
  }
]
```

### Get Service Frequency
**GET** `/analytics/services`

Get service frequency analytics.

**Query Parameters:**
- `months` (optional): Number of months to look back (default: 6)

**Request Example:**
```http
GET /api/analytics/services?months=3
```

**Response Example:**
```json
[
  {
    "_id": {
      "year": 2023,
      "month": 9
    },
    "count": 12
  },
  {
    "_id": {
      "year": 2023,
      "month": 8
    },
    "count": 8
  }
]
```

---

## Error Handling

### Error Response Format
All API endpoints return errors in the following format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400,
    "type": "BadRequestError"
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Types
- `BadRequestError` - Invalid request data
- `NotFoundError` - Resource not found
- `ValidationError` - Data validation failed

### Example Error Responses

**Bad Request (400):**
```json
{
  "error": {
    "message": "All fields (name, sku, price, quantity, category) are required",
    "status": 400,
    "type": "BadRequestError"
  }
}
```

**Not Found (404):**
```json
{
  "error": {
    "message": "Customer not found",
    "status": 404,
    "type": "NotFoundError"
  }
}
```

**Validation Error (400):**
```json
{
  "error": {
    "message": "Vehicle registration number cannot be changed",
    "status": 400,
    "type": "BadRequestError"
  }
}
```

---

## Notes

### Invoice Number Format
Invoice numbers are automatically generated in the format: `INV-YYYYMMDD-XXX` where:
- `YYYY` is the year
- `MM` is the month
- `DD` is the day
- `XXX` is a 3-digit sequence number

### Categories
Inventory items must have one of these categories:
- `spare-part` - Spare parts for vehicles
- `consumable` - Consumable items like oil, filters

### Status Values
Invoice status can be:
- `pending` - Invoice is pending payment
- `paid` - Invoice has been paid

### Transaction Safety
The following operations use database transactions to ensure data consistency:
- Creating complete invoices
- Creating services (with inventory deduction)

### Inventory Management
- Inventory quantities are automatically reduced when services are created
- Stock validation is performed before creating services
- Restocking adds to existing quantities
