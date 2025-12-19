# Admin Portal - Project Requirements Document

## 1. Project Overview
The **Admin Portal** is a web-based dashboard designed for school administrators to manage transport logistics. It provides a centralized interface to oversee drivers, buses, routes, and parent access. The application aims to streamline the management of daily school transport operations.

## 2. User Roles
- **Administrator**: The primary user with full access to all modules.
    - Can log in via Email/Password or Google.
    - Can manage Drivers, Buses, and Routes.
    - View Dashboard and Parent Access information.

## 3. Technical Stack
- **Frontend Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication (Email/Password, Google OAuth)
- **Database**: Firebase Firestore (configured for User Profiles)
- **Data Grid**: AG Grid React (for desktop table views)
- **Maps**: React Leaflet & OpenStreetMap (for Route visualization)
- **Icons**: FontAwesome

## 4. Functional Requirements

### 4.1 Authentication Module
- **Login Page**:
    - Users must be able to log in using their registered Email and Password.
    - **Google Sign-In**: Users can sign in using their Google account.
    - **Session Persistence**: The application remembers the logged-in user (configured via Firebase).
    - **Logout**: Secure logout functionality.
    - **Error Handling**: Displays messages for incorrect credentials or server errors.
    - **Backend Integration**: Firebase Authentication.

### 4.2 Dashboard Overview
- **Overview Stats**: Display high-level metrics (e.g., Total Buses, Active Routes, Total Students).
- **Quick Links**: Access to common management sections.
- *(Note: Currently implemented as a placeholder or basic view)*

### 4.3 Driver Management Module
- **View Drivers**:
    - **Desktop**: Sortable and filterable table (AG Grid) displaying Name, Email, Mobile, License No, Vehicle No, and Date joined.
    - **Mobile**: Responsive card view for better accessibility on smaller screens.
- **Add Driver**:
    - Modal form to input Driver Name, Email, Mobile, License Number, and Vehicle Number.
    - Validation for required fields.
- **Edit Driver**: Ability to modify existing driver details.
- **Delete Driver**: Ability to remove a driver from the system.
- **Search**: Real-time search by Name or Email.
- *(Current Status: Frontend logic with Mock Data)*

### 4.4 Bus Management Module
- **View Buses**:
    - **Desktop**: Table view showing Bus Number, Capacity, Assigned Driver, Contact Number, and Status.
    - **Mobile**: Care view showing key details.
- **Status Tracking**: Visual indicators for bus status:
    - **Active** (Green)
    - **Maintenance** (Orange)
    - **Inactive** (Red)
- **Add Bus**: Modal form to register a new bus with Capacity and Driver assignment.
- **Edit/Delete Bus**: Manage existing fleet records.
- *(Current Status: Frontend logic with Mock Data)*

### 4.5 Route Management Module
- **View Routes**:
    - Table view displaying Route Name, Total Distance, Assigned Bus, and Stop Count.
- **Interactive Map Integration**:
    - Visual map (Leaflet) to view route stops.
    - search functionality for locations (using OpenStreetMap/Nominatim).
- **Add Route**:
    - Define Route Name and assign a Bus.
    - **Stop Management**: Add, name, and remove stops visually on the map.
    - Auto-calculation of stop counts (Distance is currently manual input).
- **Edit Route**: Modify route details and adjust stops.
- *(Current Status: Frontend logic with Mock Data)*

### 4.6 Parent Access Module
- **View Parents**:
    - **Desktop**: Table view showing Parent Name, Child Name, Email, Mobile, and Status.
    - **Mobile**: Responsive card view.
- **Approval Workflow**:
    - **Status Management**: Parents can be **Pending**, **Approved**, or **Rejected**.
    - **Actions**: Admins can Approve, Reject, or Revert to Pending status directly from the list.
- **Filtering**:
    - **Tabs**: Filter list by status (All, Pending, Approved, Rejected).
    - **Search**: Real-time search by Name, Email, or Child Name.
- **Location & Map**:
    - **Geocoding**: Automatic location search using OpenStreetMap (Nominatim).
    - **Map View**: Visual confirmation of parent's address/pick-up point on a map.
- **Add/Edit Parent**: Full CRUD capability for parent records.
- *(Current Status: Frontend logic with Mock Data)*

## 5. Non-Functional Requirements
- **Responsiveness**: The application must be fully responsive, providing a seamless experience on Desktop, Tablet, and Mobile devices.
- **Performance**: Grid views should handle pagination and filtering efficiently.
- **Usability**: Consistent UI theme (Purple/White palette) with clear feedback for user actions (modals, loading states).

## 6. Future Roadmap
- **Backend Integration**: Replace mock data in Management modules with real-time Firestore connections.
- **Real-time Tracking**: Integrate live GPS tracking for buses.
- **Role-Based Access Control (RBAC)**: distinctive permissions for Super Admins vs. Transport Managers.
