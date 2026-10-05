# Kovsie Park

I am working on a final-year Software Engineering group project at the University of the Free State (UFS), South Africa.

I need you to act as an experienced software engineer, UI/UX designer, system analyst, and full-stack application developer.

Your task is to help me DESIGN and BUILD a professional prototype/application called:

KOVSIEPARK
University Smart Parking and Permit Management System (USPMS)

IMPORTANT:
Do not randomly create screens or features.

The application must follow the system requirements, actors, use cases, and functionalities provided below.

The system must be designed consistently so that:

Functional Requirements
        ↓
Use Cases
        ↓
UML
        ↓
User Interface
        ↓
User Interaction Steps

all describe the same system.

The application should look like a realistic, modern university parking management system.

==================================================
1. PROJECT BACKGROUND
==================================================

The University of the Free State (UFS) experiences parking challenges due to:

- Difficulty finding available parking
- Unauthorized parking in restricted zones
- Inefficient permit management
- Congestion during peak academic hours
- Manual parking fine administration
- Lack of real-time parking information

The university wants a centralized digital system to modernize campus parking operations.

The system is called:

KOVSIEPARK

Full name:

University Smart Parking and Permit Management System (USPMS)

The system will be used by:

1. Students
2. Academic Staff
3. Administrative Staff
4. System Administrators
5. Campus Security Officers
6. Visitors

The application must be easy to use for all user roles.

==================================================
2. CORE REQUIRED FUNCTIONALITIES
==================================================

The project assignment requires the following four core features:

A. Parking Permit Management

The system must support:

- Multiple parking permit types
- Student permits
- Staff permits
- Visitor permits
- Disability permits
- Reserved permits

Users must be able to:

- Apply for a parking permit
- Provide required information
- Submit the application

Administrators must be able to:

- View permit applications
- Review applications
- Approve applications
- Reject applications
- Manage permits

The system must:

- Store the permit validity period
- Show permit status
- Identify active permits
- Identify expired permits
- Allow permit renewal

Possible permit statuses:

- Pending
- Approved
- Rejected
- Active
- Expired
- Cancelled

==================================================
3. PARKING ZONE MANAGEMENT
==================================================

Administrators must be able to manage parking zones.

The system should support zone categories such as:

- Student Parking
- Staff Parking
- Visitor Parking
- Disability Parking
- Reserved Parking
- Restricted Parking

Administrators must be able to:

- Create a parking zone
- Edit a parking zone
- Define the zone category
- Define parking restrictions
- Assign permit types allowed in the zone
- Activate or deactivate zones

Each zone can include information such as:

- Zone ID
- Zone Name
- Zone Category
- Location
- Number of Parking Bays
- Available Bays
- Allowed Permit Types
- Status

The system should make it easy to see which parking zones have available spaces.

==================================================
4. VISITOR PARKING MANAGEMENT
==================================================

The system must support visitor parking.

The visitor parking process should include:

1. Visitor pre-registration
2. Capturing visitor information
3. Selecting visitor type
4. Entering vehicle details
5. Searching for suitable available parking
6. Reserving a parking bay
7. Generating a temporary parking permit
8. Sending a reservation confirmation
9. Allowing a reservation to be cancelled
10. Returning a cancelled parking bay to availability

Visitor information may include:

- Full Name
- Email Address
- Phone Number
- Visitor Type
- Vehicle Registration Number
- Vehicle Description
- Visit Date
- Arrival Time
- Departure Time
- Destination or Person Being Visited

==================================================
5. NOTIFICATIONS AND ALERTS
==================================================

The system must keep users informed.

Create a notification system that supports:

- Permit expiry reminders
- Permit expired notifications
- Permit approval notifications
- Permit rejection notifications
- Visitor reservation confirmations
- Visitor reservation cancellations
- Important parking-related alerts

Users should have a notification area or notification centre.

The UI should include a notification icon.

When clicked, it should show recent notifications.

==================================================
6. ADDITIONAL FEATURE: ALPR / LPR
==================================================

Our group has proposed an additional feature involving:

Automatic License Plate Recognition (ALPR)

This feature is also referred to as:

License Plate Recognition (LPR)

IMPORTANT:
We are NOT designing the actual camera hardware or the technology that reads license plates.

Instead, we are designing how the KovsiePark software responds after a license plate is detected.

The LPR functionality should work as follows:

1. A vehicle enters or is detected in a parking zone.

2. The LPR system sends the detected license plate number to KovsiePark.

3. KovsiePark checks the vehicle registration number against the permit database.

4. The system checks:

   - Does the vehicle have a valid permit?
   - Is the permit active?
   - Is the permit expired?
   - Is the vehicle allowed to park in this zone?
   - Is the permit type compatible with the parking zone?

5. If the vehicle is authorized:

   Display:

   "Vehicle Authorized"

   Show:

   - License Plate
   - Permit Number
   - Permit Type
   - Zone
   - Permit Status

6. If the vehicle is NOT authorized:

   Display:

   "Unauthorized Vehicle Detected"

   The system must record the event.

7. A grace period should be applied before a fine is generated.

For example:

Grace Period:
10–15 minutes

During the grace period:

- No fine is immediately issued.
- The event is recorded.
- The driver may correct the problem.

After the grace period:

If the violation is still unresolved:

- Create a parking violation record
- Generate a fine
- Notify campus security
- Record the date and time
- Record the vehicle registration number
- Record the parking zone
- Record the reason for the violation

Possible violation statuses:

- Detected
- Grace Period Active
- Resolved
- Fine Issued
- Closed

Create an ALPR / Compliance dashboard for Campus Security.

The dashboard should allow security officers to:

- View recent vehicle scans
- Search for a vehicle registration number
- Check permit status
- View unauthorized vehicle alerts
- View vehicles currently in a grace period
- View violations
- View generated fines

For demonstration purposes, create a SIMULATED ALPR scan.

For example:

A button:

"Simulate Vehicle Scan"

When clicked:

- Use a sample vehicle registration number
- Check it against the application's permit records
- Display the result

Examples:

VALID VEHICLE:

Registration:
FSK 123 GP

Result:
Vehicle Authorized

INVALID VEHICLE:

Registration:
ABC 999 FS

Result:
Unauthorized Vehicle Detected

Do not attempt to build actual camera recognition technology.

The application should simulate the LPR data being received by KovsiePark.

==================================================
7. USER ROLES
==================================================

The application must support role-based access.

Roles:

1. Student

Student functionality:

- Register
- Log in
- View dashboard
- Apply for parking permit
- View permit status
- Renew permit
- View notifications
- Manage profile
- Add/manage vehicle information

2. Staff Member

Staff functionality:

- Log in
- View dashboard
- Apply for permit
- View permit status
- Renew permit
- View notifications
- Manage vehicle information

Academic and administrative staff may have similar parking functionality.

3. Administrator

Administrator functionality:

- Log in
- View dashboard
- View parking statistics
- Review permit applications
- Approve applications
- Reject applications
- Manage parking permits
- Manage parking zones
- Define parking restrictions
- View visitor reservations
- Reserve visitor parking
- Manage notifications
- View ALPR/compliance information

4. Campus Security Officer

Security functionality:

- Log in
- View security dashboard
- Check vehicle registration numbers
- Check permit validity
- Check whether a vehicle is authorized for a zone
- View ALPR scans
- View unauthorized vehicles
- View grace period violations
- View violations
- View generated fines

5. Visitor

Visitor functionality:

- Access visitor pre-registration
- Enter visitor information
- Enter vehicle information
- Select visit date and time
- Search available parking
- Receive parking reservation
- Receive temporary permit
- Cancel reservation if allowed

==================================================
8. APPLICATION TYPE
==================================================

Build the application as a modern, responsive web application.

It should work well on:

- Desktop
- Laptop
- Tablet
- Mobile

Use a clean modern dashboard design.

The application should feel like a real system rather than a student project with basic forms.

However, do NOT add unnecessary features that are outside the project scope.

==================================================
9. DESIGN STYLE
==================================================

Create a professional university technology design.

The visual identity should be inspired by:

- Modern technology
- Smart campus systems
- Digital parking management
- University professionalism

Suggested design direction:

Primary colour:
Deep blue

Secondary colour:
White

Accent colour:
Orange or gold

Use colour carefully.

Do not make the entire application extremely colourful.

Use:

- White or light backgrounds
- Deep blue navigation
- Clear cards
- Modern buttons
- Rounded corners
- Subtle shadows
- Clear spacing
- Professional icons

The UI should feel similar to a modern SaaS dashboard.

==================================================
10. APPLICATION STRUCTURE
==================================================

Create the application in the following order.

DO NOT try to create everything randomly at once.

STEP 1:
Create the project structure.

STEP 2:
Create the global application design.

This includes:

- Logo text: KovsiePark
- Navigation
- Colour palette
- Typography
- Buttons
- Form components
- Cards
- Tables
- Alerts
- Notification component
- Status badges

STEP 3:
Create the authentication screens.

Required screens:

1. Login
2. Registration
3. Forgot Password
4. Reset Password

LOGIN SCREEN MUST INCLUDE:

- KovsiePark logo
- Email or Username field
- Password field
- Show/hide password
- Forgot Password link
- Log In button
- Link to registration if applicable

For the prototype, provide demo accounts for different roles.

For example:

Student:
student@ufs.ac.za

Administrator:
admin@ufs.ac.za

Security:
security@ufs.ac.za

The application should demonstrate role-based login.

After login, redirect each user to the correct dashboard.

==================================================
11. DASHBOARDS
==================================================

Create separate dashboards based on user roles.

A. STUDENT DASHBOARD

Display:

- Welcome message
- Current permit status
- Permit expiry date
- Registered vehicle
- Notifications
- Quick actions

Quick actions:

- Apply for Permit
- Renew Permit
- View Permit
- Manage Vehicle

B. ADMIN DASHBOARD

Display summary cards:

- Pending Permit Applications
- Active Permits
- Expiring Permits
- Active Parking Zones
- Visitor Reservations
- Available Parking Bays
- Recent Alerts

Include:

- Recent permit applications
- Parking zone overview
- Recent notifications

Quick actions:

- Review Applications
- Manage Zones
- Manage Visitor Parking
- View Reports

C. SECURITY DASHBOARD

Display:

- Recent ALPR scans
- Unauthorized vehicles
- Vehicles in grace period
- Active violations
- Fines generated

Quick actions:

- Simulate Vehicle Scan
- Search Vehicle
- Check Permit
- View Violations

D. VISITOR PARKING PAGE

Create a simple guided process:

Step 1:
Visitor Details

Step 2:
Vehicle Details

Step 3:
Visit Details

Step 4:
Available Parking

Step 5:
Reservation Confirmation

Use a progress indicator.

==================================================
12. MAIN SCREENS TO CREATE
==================================================

Create these screens:

AUTHENTICATION

1. Login
2. Registration
3. Forgot Password
4. Reset Password

STUDENT / STAFF

5. User Dashboard
6. Apply for Permit
7. My Permit
8. Permit Renewal
9. Vehicle Management
10. Notifications
11. Profile

ADMINISTRATION

12. Administrator Dashboard
13. Permit Applications
14. Permit Application Details
15. Parking Permit Management
16. Parking Zone Management
17. Create/Edit Parking Zone
18. Visitor Reservations
19. Parking Bay Availability
20. Notifications Management

SECURITY / ALPR

21. Security Dashboard
22. ALPR Scan Simulation
23. Vehicle Search
24. Vehicle Authorization Result
25. Active Grace Periods
26. Parking Violations
27. Fine Details

VISITOR

28. Visitor Pre-registration
29. Available Parking Selection
30. Reservation Confirmation
31. Temporary Parking Permit
32. Cancel Reservation

==================================================
13. NAVIGATION
==================================================

Create navigation based on the user role.

Example Student navigation:

Dashboard
My Permit
Apply for Permit
Vehicles
Notifications
Profile
Log Out

Example Administrator navigation:

Dashboard
Permit Applications
Permits
Parking Zones
Visitor Parking
Notifications
LPR / Compliance
Settings
Log Out

Example Security navigation:

Dashboard
Vehicle Check
ALPR Scans
Grace Periods
Violations
Fines
Notifications
Profile
Log Out

==================================================
14. IMPORTANT DATA RELATIONSHIPS
==================================================

Design the application around realistic business objects.

The main business entities should include:

User
Student
Staff
Administrator
SecurityOfficer
Visitor
Vehicle
Permit
PermitApplication
PermitType
ParkingZone
ParkingBay
VisitorReservation
Notification
LPRScan
ParkingViolation
Fine

Important relationships include:

A User may have one or more Vehicles.

A User may submit Permit Applications.

A Permit Application may result in a Permit.

A Permit is associated with a Vehicle.

A Permit Type determines where a vehicle is allowed to park.

A Parking Zone contains Parking Bays.

A Parking Zone has rules and allowed permit types.

A Visitor Reservation is associated with:

- A Visitor
- A Vehicle
- A Parking Zone
- A Parking Bay
- A Temporary Permit

An ALPR Scan checks a Vehicle against its Permit and Parking Zone.

An unauthorized ALPR Scan may create a Parking Violation.

A Parking Violation may eventually result in a Fine.

==================================================
15. DATA AND DEMO CONTENT
==================================================

Create realistic sample data so that the application looks functional.

Include:

- Sample students
- Sample staff
- Sample administrators
- Sample security officers
- Sample vehicles
- Sample permits
- Pending permit applications
- Approved permits
- Expired permits
- Multiple parking zones
- Parking bays
- Visitor reservations
- Notifications
- ALPR scans
- Authorized vehicles
- Unauthorized vehicles
- Grace period examples
- Parking violations
- Fines

The demo should allow me to demonstrate different system scenarios.

==================================================
16. DEVELOPMENT APPROACH
==================================================

Work in phases.

PHASE 1:
Set up the application and design system.

PHASE 2:
Build authentication.

PHASE 3:
Build the Student/Staff dashboard and permit management.

PHASE 4:
Build Parking Zone Management.

PHASE 5:
Build Visitor Parking Management.

PHASE 6:
Build Notifications.

PHASE 7:
Build the Security and ALPR/Compliance functionality.

PHASE 8:
Connect all screens and make navigation functional.

PHASE 9:
Add realistic demo data.

PHASE 10:
Review the entire application and make sure the workflow is consistent.

==================================================
17. IMPORTANT CONSISTENCY RULE
==================================================

Before creating any screen, check:

1. Which actor uses this functionality?
2. What is the use case?
3. What information does the user need to enter?
4. What action does the user perform?
5. What business object is affected?
6. What should happen after the action?
7. What happens if the action fails or information is invalid?

Do not create screens that have no connection to the system requirements.

==================================================
18. WHAT I WANT FROM YOU FIRST
==================================================

Do not immediately generate every screen in one response.

Start by giving me:

1. Your recommended technology stack for building this application.

2. The complete proposed application architecture.

3. The recommended folder structure.

4. A list of all pages/screens.

5. The navigation structure for each user role.

6. The data model/entities needed for the prototype.

7. Then begin building the application STEP BY STEP.

START WITH:

STEP 1 — PROJECT SETUP

Explain exactly:

- What technology you recommend
- Why you recommend it
- What files and folders should be created
- What command I should run first
- What I should do after that

Then continue to:

STEP 2 — GLOBAL UI DESIGN

Then:

STEP 3 — LOGIN AND AUTHENTICATION

IMPORTANT:

Build the project in small, manageable steps.

After completing each step, clearly tell me:

"STEP X COMPLETE"

Then tell me exactly what to do next.

Do not skip steps.

Do not assume I am an experienced programmer.

Explain where every file should go and provide complete code when necessary.

The final result should be a professional, realistic, consistent KovsiePark prototype/application that I can use to demonstrate the system for my Software Engineering project.
```

---



### Step 1

* Technology choice
* Project setup
* Folder structure

Then you move to:

### Step 2

* Global design system

Then:

### Step 3

* Login

Then:

### Step 4

* Dashboards

This will make it much easier to fix errors.


to build it as a web application using:

HTML → structure of the pages

CSS → professional styling, colours, layout, responsiveness

JavaScript → buttons, navigation, forms, validation, dashboard interactions, notifications, etc.

For now, you can build a front-end prototype that demonstrates how KovsiePark would work. 

The application should include these main areas

1. Login

Users should be able to select or log in according to their role:

 Student

 Staff

 Administrator

 Campus Security

 Visitor

After login, the user should be directed to the appropriate dashboard.

2. Dashboard

The dashboard should provide different functionality depending on the user.

For example:

Student/Staff Dashboard

 View parking permit

 Apply for permit

 Renew permit

 View permit status

 View notifications

 Manage registered vehicle

Administrator Dashboard

 View permit applications

 Approve or reject applications

 Manage parking zones

 Manage visitor reservations

 View parking information

 Manage notifications

Security Dashboard

 Search or enter a vehicle registration number

 Check whether a vehicle has a valid permit

 Check whether the vehicle is authorised for a particular zone

 View parking violations or alerts

Visitor Section

 Pre-register a visit

 Select visitor type

 Enter vehicle information

 View available/reserved parking

 Receive a temporary parking permit

 Cancel a reservation

3. Permit Management

This should support:

 Applying for a permit

 Selecting permit type

 Entering vehicle details

 Viewing application status

 Approving/rejecting applications for administrators

 Permit expiry dates

 Permit renewal

4. Zone Management

The administrator should be able to:

 View parking zones

 Add a zone

 Edit a zone

 Categorise zones

Examples:

 Student Parking

 Staff Parking

 Visitor Parking

 Disability Parking

 Restricted Parking

The system should show which permit types are allowed in each zone.

5. Visitor Parking Management

The visitor workflow could be:

Pre-register → Enter visitor details → Enter vehicle registration → Select visitor type → Check available parking → Reserve a bay → Generate temporary permit → Receive confirmation.

6. Notifications and Alerts

Examples:

 Permit is expiring soon

 Permit has expired

 Permit application approved

 Permit application rejected

 Visitor reservation confirmed

 Visitor reservation cancelled

Important: ALPR/LPR feature

Since your team proposed the Compliance & Fine Escalation Engine, Gemini should include a simulation screen for ALPR/LPR.

The UI does not need to connect to a real camera.

Instead, create a simulated process:

License plate detected → System searches permit records → System checks permit status → System checks authorised zone → Result displayed.

For example:

Vehicle Detected: FS123456

Zone: Staff Parking Zone A

Permit Status: Valid

Result: ✅ Vehicle is authorised.

Or:

Permit Status: Expired

Result: ⚠️ Possible parking violation detected.

For the proposed grace period:

Vehicle detected without valid authorisation → Warning created → Grace period starts → Security/admin can review → Violation/fine record can be generated if the issue remains unresolved.

That will visually demonstrate your proposed feature without pretending that you have actually implemented real ALPR hardware.

My recommendation for the technology



. Create the project as a professional front-end web application with multiple pages or dynamically loaded sections. Use dummy/sample data because this is currently a UI prototype and demonstration of the proposed system.

Also note that ufs has 3 campus/Bloemfontein campus and qwaqwa campus and south campus.You maybe search online for ufs using this www.ufs.ac.za to look for more ifnromation that might be helpful.Try to use the background from the ufs and their logo

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kovsiepark-smart-parking.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e51fd5e3-6a85-441d-a19a-093c0105c4e8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
