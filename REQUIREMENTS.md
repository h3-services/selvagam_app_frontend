# Fast Cab Admin Portal - Requirements Documentation

## 1. Project Overview

**Fast Cab Admin Portal** is a comprehensive React-based web application for managing school transportation services. It provides administrators with tools to manage parents, drivers, buses, routes, and communication in a single unified platform.

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite |
| State | React Hooks (useState, useMemo, useEffect) |
| Routing | React Router DOM v6 |
| UI Components | AG Grid React, React-Leaflet |
| Icons | FontAwesome, React Icons |
| Styling | Tailwind CSS |
| Backend | Firebase (Auth, Firestore) |
| Notifications | FCM via custom API |
| Maps | Leaflet + OpenStreetMap |
| Deployment | Firebase Hosting |

---

## 2. User Roles

| Role | Access Level | Description |
|------|--------------|-------------|
| Super Admin | Full | Complete system access |
| Admin | Full | All management features |
| (Future) Staff | Limited | View-only access to certain modules |

---

## 3. Functional Requirements

### 3.1 Authentication Module
**Component:** `Login.jsx`

| Feature | Description |
|---------|-------------|
| Email/Password Login | Query Firestore users collection |
| Google OAuth | Firebase Google sign-in with popup |
| Session Persistence | Via Firebase Auth |
| Error Handling | Display inline error messages |

### 3.2 Dashboard Module
**Component:** `DashboardOverview.jsx`

| Feature | Description |
|---------|-------------|
| Statistics Cards | Active drivers, parents, buses, routes |
| Live Bus Map | Leaflet map showing active bus locations |
| Recent Activity Feed | Scrollable activity list |
| Quick Stats | Color-coded metric cards |

### 3.3 Parent Management Module
**Component:** `ParentAccess.jsx` (1028 lines)

| Feature | Description |
|---------|-------------|
| Parent CRUD | Add, edit, delete parent records |
| Approval Workflow | Approve/Reject/Pending parent requests |
| AG Grid Table | Sortable, filterable desktop view |
| Mobile Cards | Responsive card-based mobile view |
| Location Map | Interactive map for parent location |
| Detail View | Full parent profile with all info |
| Search | Real-time search filtering |

**Data Fields:**
- Name, Email, Phone, Address
- Student Name, Student ID, Grade
- Status (Active, Pending, Rejected)
- Location coordinates

### 3.4 Driver Management Module
**Component:** `DriverManagement.jsx` (523 lines)

| Feature | Description |
|---------|-------------|
| Driver CRUD | Add, edit, delete drivers |
| AG Grid Table | Desktop data grid view |
| Mobile Cards | Card-based mobile layout |
| Detail View | Driver profile with license info |
| Status Badges | Active/Inactive indicators |

**Data Fields:**
- Name, Email, Phone
- License Number, License Type
- Assigned Bus
- Status

### 3.5 Bus Management Module
**Component:** `BusManagement.jsx` (479 lines)

| Feature | Description |
|---------|-------------|
| Bus CRUD | Add, edit, delete buses |
| Status Management | Active, Maintenance, Inactive |
| Capacity Tracking | Seat count per bus |
| Driver Assignment | Link bus to driver |
| AG Grid + Mobile Views | Responsive layouts |

**Data Fields:**
- Bus Number (e.g., BUS-101)
- Capacity (seats)
- Assigned Driver Name
- Contact Number
- Status

### 3.6 Route Management Module
**Component:** `RouteManagement.jsx` (930+ lines)

| Feature | Description |
|---------|-------------|
| Route CRUD | Create routes with multiple stops |
| Interactive Map | Leaflet for stop placement |
| Geocoding Search | Nominatim API for location search |
| Stop Points | Add/remove stops with coordinates |
| Polyline Visualization | Route path on map |
| Bus Assignment | Dropdown to assign buses |
| Bus Reassignment Modal | Change bus with visual selector |

**Data Fields:**
- Route Name, Distance
- Assigned Bus
- Stop Points (name, coordinates)
- Start/End coordinates

### 3.7 Communication Module
**Component:** `Communication.jsx` (181 lines)

| Feature | Description |
|---------|-------------|
| Message Composer | Text or voice message input |
| Recipient Selection | Toggle between Parents/Drivers |
| Message Type | Text or Voice announcement |
| Push Notifications | Send via FCM API |
| Message History | View sent messages |

---

## 4. UI/UX Requirements

### 4.1 Design System
| Element | Specification |
|---------|---------------|
| Primary Color | `#40189d` (Purple) |
| Active State | White with rounded corners |
| Cards | 3xl border-radius, shadows |
| Buttons | Gradient, hover scale effects |
| Icons | FontAwesome solid icons |

### 4.2 Responsive Breakpoints
| Breakpoint | Layout |
|------------|--------|
| Mobile (<768px) | Card-based views, hamburger menu |
| Tablet (768-1024px) | Hybrid layout |
| Desktop (>1024px) | Sidebar + AG Grid tables |

### 4.3 Component Patterns
- **AG Grid**: Desktop data tables with custom cell renderers
- **Mobile Cards**: Card-based alternative for small screens
- **Slide-in Modals**: Right-side panels for add/edit forms
- **Detail Views**: Full-screen profile views
- **Maps**: Leaflet with custom markers and polylines

---

## 5. Navigation Structure

```
/login              → Login Page
/dashboard          → Dashboard Overview
/parents            → Parent Management
/drivers            → Driver Management
/buses              → Bus Management
/routes             → Route Management
/communication      → Communication Center
```

**Sidebar Menu Items:**
1. Dashboard
2. Parent Management
3. Driver Management
4. Bus Management
5. Route Management
6. Communication
7. Logout

---

## 6. Integration Requirements

### 6.1 Firebase
- **Authentication**: Email/password, Google OAuth
- **Firestore**: User data storage (`schools/{schoolId}/users`)
- **Analytics**: Page view tracking

### 6.2 Notification Service
- **Endpoint**: `http://localhost:3001/api/send-notification`
- **Topics**: `drivers`, `parents`
- **Message Types**: Text, Voice

### 6.3 External APIs
- **Nominatim (OpenStreetMap)**: Geocoding for location search
- **OpenStreetMap Tiles**: Map rendering

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Pagination on AG Grid (5, 10, 20, 50 items)
- Debounced search (500ms)
- Lazy loading for maps

### 7.2 Security
- Firebase Auth for authentication
- Admin key verification for notifications
- Protected routes (redirect to login)

### 7.3 Accessibility
- Keyboard navigation support
- Focus indicators on inputs
- Semantic HTML structure

---

## 8. File Structure

```
src/
├── components/
│   ├── Login.jsx           # Authentication
│   ├── Dashboard.jsx       # Layout wrapper
│   ├── DashboardOverview.jsx
│   ├── ParentAccess.jsx
│   ├── DriverManagement.jsx
│   ├── BusManagement.jsx
│   ├── RouteManagement.jsx
│   ├── Communication.jsx
│   ├── Sidebar.jsx
│   └── ComingSoon.jsx
├── services/
│   └── notificationService.js
├── constants/
│   └── colors.js
├── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 9. Future Enhancements

- [ ] Real-time bus tracking with live location updates
- [ ] Trip scheduling and management
- [ ] Driver attendance tracking
- [ ] Parent mobile app integration
- [ ] SMS notifications as fallback
- [ ] Report generation and analytics
- [ ] Multi-school support
- [ ] Role-based access control (RBAC)

---

## 10. Dependencies

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "ag-grid-react": "latest",
  "react-leaflet": "^4.x",
  "leaflet": "^1.x",
  "@fortawesome/react-fontawesome": "latest",
  "firebase": "^10.x",
  "vite": "^5.x"
}
```

---

*Document Version: 1.0*  
*Last Updated: December 26, 2024*
