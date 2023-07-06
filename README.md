# Job board backend  

## Description
Backend for [job board application](https://github.com/TymonSliwinski/job-board).

### Prerequisites
- Node.js  
- Prisma  
- PostgreSQL database  

## Project setup  

1. Clone the repository `git clone https://github.com/TymonSliwinski/job-board-backend.git`  
2. Run `npm install` to install all dependencies  
3. Create `.env` file in the root directory and add the following variables:  
```
APP_URL=http://localhost
PORT=5000

TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=
REFRESH_TOKEN_EXPIRATION=

DB_PASSWORD=
DB_USER=
DB_NAME=
DATABASE_URL=

# used by passport-google-oauth20
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=
```
4. Run `npm start` to start the server in development mode  

## API endpoints

### Auth  
#### Register
`POST /api/auth/register`  

**body**:  
```json
{
    "email": "email@example.com",
    "password": "Passwd!1", // 8 characters, 1 number, 1 uppercase, 1 special,
    "userType": "developer", // or "company"
    
    // if userType is "developer"
    "firstName": "John",
    "lastName": "Doe",
    "avatar: "base64 encoded image" // optional
    
    // if userType is "company"
    "name": "Company",
    "location": "City, Country",
    "avatar: "base64 encoded image"
}
```
**response**:  
- **201** - user created  
```json
{
    "message": "User created"
}
```
- **400** - validation error  
```json
{
    "message": "Error message"
}
```
  
#### Login  
`POST /api/auth/login`  

**body**:  
```json
{
    "email": "email@example.com",
    "password": "Passwd!1"
}
```  
**response**:  
- **200**  
```json
{
    "message": "Logged in",
    "accessToken": "access token",
    "refreshToken": "refresh token"
    "userType": "developer" // or "company"
}
```
- **400**  
```json
{
    "message": "No username/email or password provided"
}
```
- **401**  
```json
{
    "message": "Wrong password!"
}
```
- **404**  
```json
{
    "message": "User not found"
}
```
  
#### Refresh token  
`GET /api/auth/refresh`  
**headers**:  
```
Bearer <refresh token>
```
**response**:  
- **200**  
```json
{
    "message": "Token refreshed",
    "tokens": {
        "accessToken": "access token",
        "refreshToken": "refresh token"
    }
}
```
- **400**  
```json
{
    "message": "Error message"
}
```
  
#### Logout  
`GET /api/auth/logout`  
  
### Offers  
  
#### Get all offers  
`GET /api/offers`  
**params**:  
| Param | Value | Description |
| --- | --- | --- |
| page | integer, default 1 | Page number, optional |
| text | string, default "" | Search text in offer title, optional |
| size | integer, default 20 | Offers per page, optional |
| category | Frontend, Backend, Fullstack, DevOps, BI, Data, PM, Design, default All | Category, optional |
| requirements | JSON, default {} | Requirements, key - requirement name, value - level 1-5, optional |
  
**response**:  
- **200**  
```json
{
    "data": [
        
    ],
    "meta": {
        "page": 1,
        "size": 20,
        "filters": {},
    }
}
```  
- **500**  
```json
{
    "message": "Error while getting offers",
    <error>
}
```  
#### Get offer by id  
`GET /api/offers/:id`  
**response**:  
- **200**
```json
{
    "id": 1,
    "title": "Offer title",
    "description": "Offer description",
    "category": "Frontend",
    "requirements": {
        "JavaScript": 5,
        "React": 4,
        "HTML": 3,
        "CSS": 3
    },
    "location": "City, Country",
    "salaryLower": 10000,
    "salaryUpper": 15000,
    "createdAt": "2021-01-01T00:00:00.000Z",
    "companyId": 1,
}
```  
- **400**  
```json
{
    "message": "Invalid offer id"
}
```  
- **404**  
```json
{
    "message": "Error - offer not found"
}
```  
#### Create offer  
`POST /api/offers`  
**headers**:  
```
Authorization: Bearer <access token>
```  
**body**:  
```json
{
    "title": "Offer title",
    "description": "Offer description",
    "category": "Frontend",
    "requirements": {
        "JavaScript": 5,
        "React": 4,
        "HTML": 3,
        "CSS": 3
    },
    "location": "City, Country",
    "salaryLower": 10000,
    "salaryUpper": 15000,
}
```  
**response**:  
- **201**  
  
**headers**:  
```
Location: /offers/<offer id>
```  
  
**body**:  
```json
{
    "id": 1,
    "title": "Offer title",
    "description": "Offer description",
    "category": "Frontend",
    "requirements": {
        "JavaScript": 5,
        "React": 4,
        "HTML": 3,
        "CSS": 3
    },
    "location": "City, Country",
    "salaryLower": 10000,
    "salaryUpper": 15000,
    "createdAt": "2021-01-01T00:00:00.000Z",
    "companyId": 1,
}
```
- **400**  
```json
{
    "message": "Invalid offer data",
    <error>
}
```  
- **401**  
```json
{
    "message": "Unauthorized!"
}
```  
- **403**  
```json
{
    "message": "Forbidden"
}
```  
#### Update offer  
`PUT /api/offers/:id`
**headers**:  
```
Location: /offers/<offer id>
```  
  
**body**:  
```json
{
    "id": 1,
    "title": "Offer title",
    "description": "Offer description",
    "category": "Frontend",
    "requirements": {
        "JavaScript": 5,
        "React": 4,
        "HTML": 3,
        "CSS": 3
    },
    "location": "City, Country",
    "salaryLower": 10000,
    "salaryUpper": 15000,
    "createdAt": "2021-01-01T00:00:00.000Z",
    "companyId": 1,
}
```
- **400**  
```json
{
    "message": "Invalid offer data", // or "Invalid offer id"
    <error>
}
```  
- **401**  
```json
{
    "message": "Unauthorized!"
}
```  
- **403**  
```json
{
    "message": "Forbidden"
}
```  
  
### Companies  
#### Get all companies  
`GET /api/companies`  
**response**:  
- **200**  
```json
[
    {
        "id": 1,
        "name": "Company name",
        "avatar": "base64 image",
        "location": "City, Country",
        "userId": 1,
    }
]
```  
#### Get company by id  
`GET /api/companies/:id`  
- **200**  
```json
{
    "id": 1,
    "name": "Company name",
    "avatar": "base64 image",
    "location": "City, Country",
    "userId": 1,
}
```  
- **400**  
```json
{
    "message": "Invalid company id"
}
```
- **404**  
```json
{
    "message": "Company not found"
}
```  
  
### Applications  
#### Get all applications  
`GET /api/applications`  
**headers**:  
```
Authorization: Bearer <access token>
```
  
**response**:  
- **200**:  
```json
[
    // if userType is developer
    "id": 1,
    "description": "Application description",
    "status": "pending", // or "accepted" or "rejected"
    "createdAt": "2021-01-01T00:00:00.000Z",
    "offer": {
        "id": 1,
        "title": "Offer title",
        "company": {
            "id": 1,
            "name": "Company name",
        }
    }
    // if userType is company
    "offerId": 1,
    "offerTitle": "Offer title",
    "applications": [
        {
            "id": 1,
            "status": "pending", // or "accepted" or "rejected"
            "description": "Application description",
            "createdAt": "2021-01-01T00:00:00.000Z",
            "developer": {
                "id": 1,
                "firstName": "John",
                "lastName": "Doe",
                "user": {
                    "email": "email@example.com"
                }
            }
        },
    ],
]
```
- **401**  
```json
{
    "message": "Unauthorized!"
}
```  
- **403**  
```json
{
    "message": "Forbidden"
}
```  
#### Apply for offer  
`POST /api/applications`  
**headers**:  
```
Authorization: Bearer <access token>
```  
**body**:  
```json
{
    "offerId": 1,
    "description": "Application description"
}
```  
**response**:  
- **201**  
```json
{
    "id": 1,
    "description": "Application description",
    "offerId": 1,
    "developerId": 1,
    "status": "pending", // or "accepted" or "rejected"
    "createdAt": "2021-01-01T00:00:00.000Z"
}
```  
- **400**  
```json
{
    "message": "Invalid application data",
    <error>
}
```  
- **401**  
```json
{
    "message": "Unauthorized!"
}
```  
- **403**  
```json
{
    "message": "Forbidden"
}
```
- **404**  
```json
{
    "message": "Offer not found"
}
```  
#### Resolve application  
`POST /api/applications/:id/status`  
**headers**:  
```
Authorization: Bearer <access token>
```  
**body**:  
```json
{
    "status": "accepted" // or "rejected" or "pending"
}
```  
**response**:  
- **200**  
```json
{
    "status": "accepted" // or "rejected" or "pending"
}
```  
- **400**  
```json
{
    "message": "Missing data",
    <error>
}
```  
- **401**  
```json
{
    "message": "Unauthorized!"
}
```  
- **403**  
```json
{
    "message": "Forbidden"
}
```