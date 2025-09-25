# 🔌 API Documentation

> **Comprehensive API documentation for Dog Breed Viewer backend services and external API integrations**

## 📋 Table of Contents

- [Backend API](#backend-api)
- [External API Integration](#external-api-integration)
- [Authentication & Security](#authentication--security)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Data Models](#data-models)
- [Examples & Usage](#examples--usage)

## Backend API

### Base URL
```
Development: http://localhost:3001
Production: https://your-domain.com
```

### Health Check

#### GET /health
Check if the backend service is running and healthy.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Service is healthy
- `503` - Service unavailable

---

## Favourites Management

### GET /api/favourites
Retrieve all favourite dog images saved by users.

**Response:**
```json
[
  {
    "id": 1,
    "image_url": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1007.jpg",
    "breed": "hound/afghan",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "image_url": "https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg",
    "breed": "retriever/golden",
    "created_at": "2024-01-15T10:35:00.000Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `500` - Internal server error

---

### POST /api/favourites
Add a new image to the favourites list.

**Request Body:**
```json
{
  "imageUrl": "https://images.dog.ceo/breeds/bulldog-boston/n02096585_1023.jpg",
  "breed": "bulldog/boston"
}
```

**Validation Rules:**
- `imageUrl`: Required, must be a valid URL from dog.ceo domain
- `breed`: Required, string matching breed format (main or main/sub)

**Response:**
```json
{
  "id": 3,
  "message": "Image added to favourites successfully"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Invalid request data
- `409` - Image already exists in favourites
- `500` - Internal server error

**Error Example:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "imageUrl",
      "message": "Invalid URL format"
    }
  ]
}
```

---

### DELETE /api/favourites
Remove an image from the favourites list.

**Request Body:**
```json
{
  "imageUrl": "https://images.dog.ceo/breeds/bulldog-boston/n02096585_1023.jpg"
}
```

**Response:**
```json
{
  "message": "Image removed from favourites successfully"
}
```

**Status Codes:**
- `200` - Removed successfully
- `400` - Invalid request data
- `404` - Image not found in favourites
- `500` - Internal server error

---

## External API Integration

### Dog CEO API

**Base URL:** `https://dog.ceo/api`
**Documentation:** https://dog.ceo/dog-api/documentation/
**Authentication:** None required
**Rate Limits:** No official limits (use responsibly)

#### GET /breeds/list/all
Fetch complete list of all dog breeds and sub-breeds.

**Example Response:**
```json
{
  "message": {
    "affenpinscher": [],
    "african": ["wild"],
    "australian": ["kelpie", "shepherd"],
    "beagle": [],
    "boxer": [],
    "bulldog": ["boston", "english", "french"],
    "retriever": ["chesapeake", "curly", "flatcoated", "golden"]
  },
  "status": "success"
}
```

**Data Structure:**
- Key: Main breed name
- Value: Array of sub-breed names (empty if no sub-breeds)

#### GET /breed/{breed}/images/random/{count}
Fetch random images for a specific breed.

**Parameters:**
- `breed`: Breed name (e.g., "labrador" or "bulldog/french")
- `count`: Number of images (1-50, default: 1)

**Example Request:**
```
GET https://dog.ceo/api/breed/retriever/golden/images/random/3
```

**Example Response:**
```json
{
  "message": [
    "https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg",
    "https://images.dog.ceo/breeds/retriever-golden/n02099601_101.jpg",
    "https://images.dog.ceo/breeds/retriever-golden/n02099601_102.jpg"
  ],
  "status": "success"
}
```

**Error Response:**
```json
{
  "message": "Breed not found (master breed does not exist)",
  "status": "error",
  "code": 404
}
```

---

## Authentication & Security

### Current Implementation
- **No Authentication Required**: Public API for demo purposes
- **CORS**: Configured for frontend domains
- **Content Security Policy**: Implemented via Helmet.js
- **Input Validation**: Zod schema validation for all endpoints

### Security Headers
```http
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Future Authentication (Roadmap)
```json
// Proposed JWT authentication
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "email": "user@example.com"
  }
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error title",
  "message": "Detailed error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/favourites"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource not found |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

---

## Rate Limiting

### Current Limits
- **General API**: 100 requests per 15 minutes per IP
- **Favourites POST**: 10 requests per minute per IP
- **Headers Included**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

### Rate Limit Response
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later",
  "retryAfter": 300
}
```

---

## Data Models

### TypeScript Interfaces

```typescript
// Favourite item in database
interface Favourite {
  id: number;
  image_url: string;
  breed: string;
  created_at: string;
}

// Dog breed structure from external API
interface BreedMap {
  [breedName: string]: string[]; // sub-breeds array
}

// Dog image with metadata
interface DogImage {
  url: string;
  breed: string;
}

// API request/response types
interface AddFavouriteRequest {
  imageUrl: string;
  breed: string;
}

interface RemoveFavouriteRequest {
  imageUrl: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
```

### Database Schema (SQLite)

```sql
-- Favourites table
CREATE TABLE favourites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT UNIQUE NOT NULL,
  breed TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_favourites_breed ON favourites(breed);
CREATE INDEX idx_favourites_created_at ON favourites(created_at);
```

---

## Examples & Usage

### Frontend API Integration

```typescript
// Fetch favourites
const fetchFavourites = async (): Promise<Favourite[]> => {
  const response = await fetch('/api/favourites');
  if (!response.ok) {
    throw new Error('Failed to fetch favourites');
  }
  return response.json();
};

// Add favourite
const addFavourite = async (imageUrl: string, breed: string): Promise<void> => {
  const response = await fetch('/api/favourites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl, breed })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Remove favourite
const removeFavourite = async (imageUrl: string): Promise<void> => {
  const response = await fetch('/api/favourites', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};
```

### CURL Examples

```bash
# Get health status
curl -X GET http://localhost:3001/health

# Fetch all favourites
curl -X GET http://localhost:3001/api/favourites

# Add favourite
curl -X POST http://localhost:3001/api/favourites \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1007.jpg",
    "breed": "hound/afghan"
  }'

# Remove favourite
curl -X DELETE http://localhost:3001/api/favourites \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1007.jpg"
  }'
```

### Error Handling Best Practices

```typescript
// Robust error handling
const handleApiCall = async <T>(
  apiCall: () => Promise<T>
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    if (error instanceof Response) {
      // Handle HTTP errors
      const errorData = await error.json();
      console.error('API Error:', errorData);

      if (error.status === 429) {
        // Rate limit exceeded - implement backoff
        await new Promise(resolve => setTimeout(resolve, 5000));
        return handleApiCall(apiCall); // Retry
      }
    }

    // Handle network errors
    console.error('Network Error:', error);
    return null;
  }
};
```

---

## Development & Testing

### Local Development
```bash
# Start backend server
npm run dev:backend

# Test API endpoints
npm run test:api

# Check API documentation
open http://localhost:3001/api-docs
```

### Testing with Postman

Import the following collection for comprehensive API testing:

```json
{
  "info": { "name": "Dog Breed Viewer API" },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/health"
      }
    },
    {
      "name": "Get Favourites",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/favourites"
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ]
}
```

---

## Changelog & Versioning

### v1.0.0 (Current)
- Initial release with favourites management
- Dog CEO API integration
- Rate limiting implementation
- SQLite database storage

### Planned Features (v1.1.0)
- User authentication with JWT
- Advanced search and filtering
- Breed comparison features
- Image upload capabilities
- API analytics and monitoring

---

**For questions or issues with the API, please [create an issue](https://github.com/example/dog-breed-viewer/issues) or contact the development team.**