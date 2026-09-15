# MYM Car Rental Frontend

A modern, responsive car rental web application built with **Angular 20**, **TypeScript**, and **Angular SSR**.

The application provides a complete customer-facing rental experience and an administrative dashboard for managing cars, categories, users, and bookings. It integrates with the MYM Car Rental ASP.NET Core Web API.

---

## Overview

**MYM Car Rental Frontend** is the Angular client application for the MYM Car Rental platform.

It includes:

* Customer-facing car rental pages
* Car listing and car details
* Rental booking workflow
* Customer booking history
* Authentication and Google Sign-In
* JWT and refresh-token integration
* Admin dashboard
* Car management
* Category management
* User management
* Booking management
* Arabic and English localization
* RTL/LTR layout support
* Angular Server-Side Rendering
* SEO metadata management
* Responsive design

---

## Technology Stack

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| Angular 20             | Frontend framework                   |
| TypeScript             | Main programming language            |
| Angular Router         | Application routing                  |
| Angular SSR            | Server-side rendering                |
| Angular Hydration      | Client hydration                     |
| RxJS                   | Reactive programming and API streams |
| Angular Signals        | Reactive state management            |
| Angular Reactive Forms | Form handling and validation         |
| SCSS                   | Styling                              |
| Font Awesome           | Icons                                |
| ngx-translate          | Arabic and English localization      |
| Express                | Angular SSR server                   |
| REST APIs              | Backend integration                  |

---

## Application Structure

```text
src/
└── app/
    │
    ├── admin/
    │   ├── layout/
    │   ├── pages/
    │   │   ├── dashboard/
    │   │   ├── cars/
    │   │   ├── categories/
    │   │   ├── users/
    │   │   └── bookings/
    │   ├── core/
    │   │   └── services/
    │   └── shared/
    │       ├── sidebar/
    │       ├── topbar/
    │       ├── stat-card/
    │       ├── admin-page-header/
    │       └── confirm-dialog/
    │
    ├── core/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── models/
    │   ├── services/
    │   └── initializers/
    │
    ├── features/
    │   ├── home/
    │   ├── cars/
    │   ├── booking/
    │   ├── login/
    │   ├── about-us/
    │   ├── company-services/
    │   ├── contact/
    │   ├── faq/
    │   └── not-found/
    │
    ├── layout/
    │   └── public/
    │       ├── customer-layout/
    │       └── navbar/
    │
    └── shared/
        └── components/
            └── date-picker/
```

---

## Customer Features

### Home Page

The home page includes:

* Hero section
* Featured cars
* Popular car categories
* Company benefits
* Customer-oriented navigation

### Car Browsing

Customers can:

* Browse available cars
* View featured cars
* Open car details
* View vehicle specifications
* View rental pricing
* Select a rental plan

Supported rental plans:

* Daily
* Weekly
* Monthly

### Car Details

The car details page displays vehicle information such as:

* Car name
* Vehicle specifications
* Fuel type
* Transmission
* Number of seats
* Number of doors
* Luggage capacity
* Rental prices
* Car images
* Featured status

### Booking Workflow

The booking process is organized into multiple steps:

1. Select rental dates
2. Select rental plan
3. Review rental information
4. Confirm booking

The frontend integrates with the backend booking API to create and manage customer reservations.

### Customer Bookings

Authenticated customers can:

* View their bookings
* Review booking information
* Check booking status
* Cancel eligible bookings

### Authentication

The application supports:

* Login
* Current-user initialization
* Google Sign-In
* JWT authentication integration
* Refresh-token flow
* Logout
* Protected routes

Authenticated pages such as booking and customer booking history are protected using Angular route guards.

---

## Admin Dashboard

The application includes a dedicated administration area with:

### Dashboard

* Statistics cards
* Administrative navigation
* Overview of platform data

### Car Management

Administrators can manage:

* Cars
* Car specifications
* Rental prices
* Car images
* Active/inactive status
* Featured cars
* Create and edit forms

### Category Management

Administrators can:

* Create categories
* Edit categories
* Manage category information
* Manage category images
* Activate or deactivate categories

### User Management

The admin area includes:

* User listing
* User details
* User management workflows

### Booking Management

Administrators can:

* View bookings
* Open booking details
* Review customer and rental information
* Manage booking statuses

---

## Authentication and HTTP Interceptors

The frontend uses multiple HTTP interceptors for authentication and API communication:

* Credentials interceptor
* Refresh-token interceptor
* SSR authentication-cookie interceptor

The refresh-token interceptor helps maintain authenticated sessions, while the SSR interceptor forwards authentication cookies during server-side requests.

---

## Internationalization

The application supports:

* Arabic
* English

The language service dynamically updates:

* Current language
* HTML language attribute
* Text direction
* RTL/LTR layout

```text
Arabic  → RTL
English → LTR
```

Translation files are loaded from:

```text
src/assets/i18n/
```

---

## Server-Side Rendering and SEO

The application is configured with Angular SSR and hydration.

Implemented capabilities include:

* Server-side rendering
* Client hydration
* Event replay
* Route-based lazy loading
* Dynamic page titles
* Meta descriptions
* Open Graph metadata
* Twitter card metadata
* Robots metadata
* Canonical URL metadata

These features improve the application's SEO readiness and initial page rendering experience.

---

## Routing

The application uses Angular Router with lazy-loaded components.

Main customer routes include:

```text
/
/about-us
/cars
/cars/:id
/booking
/my-bookings
/faq
/contact
/services
/login
/admin
```

Protected customer routes include:

```text
/booking
/my-bookings
```

The admin area is loaded through a dedicated admin route configuration.

---

## API Integration

The frontend communicates with the MYM Car Rental backend through RESTful APIs.

Main API services include:

* Authentication service
* Car service
* Car category service
* Booking service
* Admin cars service
* Admin categories service
* Admin users service
* Admin bookings service
* Admin dashboard service

Backend repository:

[MYM Car Rental Backend](https://github.com/Amrnaassar/mym-car-rental-backend)

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* Angular CLI
* Access to the MYM Car Rental backend API

### Install Dependencies

```bash
npm install
```

### Configure the API URL

Update the environment configuration with the backend API URL.

```text
src/environments/environment.ts
src/environments/environment.development.ts
```

### Run the Development Server

```bash
npm start
```

Open the application in your browser using the local URL shown by Angular CLI.

### Build the Application

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Run SSR Build

```bash
npm run build
npm run serve:ssr:mym-car-rental
```

---

## Project Status

The project is currently under active development as a freelance full-stack software engineering project.

The frontend is being developed alongside the ASP.NET Core backend, with ongoing improvements to the customer booking experience, administration features, and overall platform integration.

---

## Related Repository

Backend repository:

[MYM Car Rental Backend](https://github.com/Amrnaassar/mym-car-rental-backend)

---

## Author

**Omar Fathi Salah**

Full-Stack Software Engineer

Specialized in:

* Angular
* TypeScript
* ASP.NET Core
* C#
* RESTful APIs
* Entity Framework Core
* PostgreSQL
* Full-Stack Web Development

---

## License

This project is private and intended for the MYM Car Rental platform.
