# 🐾 Alit Vet — Attendance & Leave Management System

A full-stack web application designed to simplify employee attendance and leave management for Alit Vet.

Built with React, TypeScript, Node.js, Express.js, and MongoDB, the system provides GPS-based attendance, shift scheduling, leave management, role-based access control, and a Decision Support System (DSS) using the SAW method.

## Live Demo

[View Live Demo](https://frontend-syntra.vercel.app)

## Screenshot PROJECT
**Admin side**
<img width="1600" height="1262" alt="thumnail-1" src="https://github.com/user-attachments/assets/e8d38586-0bb0-42d8-a1fe-b9915c678b30" />
**Employee Side**
<img width="1600" height="1200" alt="mockup user side" src="https://github.com/user-attachments/assets/8972e7a9-fbff-4d0e-950f-2a19b0940f22" />

## About The Project

Alit Vet Attendance & Leave Management System is a web-based application designed to manage employee attendance, work schedules, and leave requests in one centralized platform.

The application supports two user roles:

- **Admin** — Manage employees, shifts, schedules, attendance, leave requests, and leave recommendations.
- **Employee** — Check in and check out based on location, view attendance records, and submit leave requests.

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Different permissions for Admin and Employee

### 📍 GPS-Based Attendance

- Check-in and check-out using Browser Geolocation API
- Location validation based on workplace area
- Attendance records connected to employee schedules

### 🕐 Shift Management

- Create and manage shift templates
- Assign shifts to employees
- Support for overnight shifts
- Maximum of two shifts per day validation

### 📝 Leave Management

- Submit leave requests
- Manage leave requests
- Leave quota management
- Leave request status tracking

### 📊 Decision Support System

The system uses the **Simple Additive Weighting (SAW)** method to generate leave approval recommendations based on:

- Remaining leave quota
- Attendance rate
- Lateness rate

## 🛠️ Tech Stack

**Frontend**
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Vite

**Backend**
- Node.js
- Express.js
- REST API
- JWT

**Database**
- MongoDB

**Tools**
- Git
- GitHub
- Postman
- VS Code
- Vercel

## 🏗️ Architecture

```text
React + TypeScript
       │
       │ REST API
       ▼
Node.js + Express.js
       │
       ▼
    MongoDB
