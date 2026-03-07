# Frontend Architecture Summary - OptiAsset Management System

**Submitted by:** Skandashri S.N  
**Email:** skandashrisn@gmail.com  
**Date:** March 7, 2026  

---

## Role: Unauthenticated User (Authentication Only)

### Page: /login (Authentication Entry Point)

**Component: <AuthLayout />**
- Centers login form with enterprise branding
- Responsive container with logo and title
- Theme toggle for light/dark mode preference

**Component: <LoginForm />**
- Email input with validation (required, email format)
- Password input with visibility toggle
- Submit button with loading state
- Error display for invalid credentials
- Auto-submits on Enter key

**Component: <SSOButtonGroup />** (Future Enhancement)
- Google OAuth integration
- Microsoft Azure AD login
- GitHub authentication option

**Component: <ForgotPasswordLink />** (Future Enhancement)
- "Forgot Password?" navigation link
- Opens password recovery modal
- Email-based reset token delivery

---

## Role: IT Administrator (Full System Access)

### Page: /dashboard (Main Admin Landing Page)

**Component: <Sidebar />**
- Primary navigation menu with RBAC filtering
- Shows all links: Dashboard, Inventory, Users, Assignments, Reports
- Collapsible for mobile responsiveness
- Active route highlighting
- Logout button at bottom

**Component: <TopNavbar />**
- Logged-in user profile display
- Notifications bell icon (future)
- Theme toggle (light/dark mode)
- Logout dropdown menu
- Breadcrumb navigation

**Component: <StatCards />**
- 4 metric cards in responsive grid:
  - Total Assets (with trend indicator)
  - Active Assignments count
  - Available Inventory count
  - Total Employees count
- Icon + value + percentage change layout

**Component: <RecentAssignmentsTable />**
- Last 5-10 asset assignments/returns
- Columns: Asset Tag, Model, Status, Current Holder, Date
- Sortable headers
- Click to view assignment details

**Component: <PendingIssuesWidget />** (Future)
- Open support tickets requiring admin action
- Priority badges (High, Medium, Low)
- Quick action buttons (Approve, Reject, Comment)

---

### Page: /inventory (Asset Management)

**Component: <Sidebar />** - Reused from dashboard

**Component: <TopNavbar />** - Reused from dashboard

**Component: <InventoryFilterHeader />**
- Search bar (asset tag, model name, serial number)
- Status filter dropdown (All, Available, Assigned, Maintenance, Retired)
- Category filter (Laptops, Monitors, Peripherals, Furniture)
- Date range picker for filtering

**Component: <AddAssetButton />**
- Primary CTA button (top-right)
- Opens AddAssetModal on click
- Requires `manage:assets` permission

**Component: <AssetDataTable />**
- Paginated table with server-side pagination
- Columns: Asset Tag, Model/Name, Category, Status, Current Holder, Actions
- Row selection with checkboxes
- Bulk actions toolbar (export, bulk update)
- Inline edit on double-click (future)

**Component: <ExportReportDropdown />**
- Export options: CSV, Excel, PDF
- Selected rows or full dataset
- Custom column selection

**Modals:**

**Component: <AddAssetModal />**
- Form fields: Asset Tag*, Model Name*, Category*, Serial Number, Purchase Date, Vendor, Value
- Auto-generate asset tag option
- Validation on submit
- Success toast notification

**Component: <EditAssetModal />**
- Pre-populated form with existing data
- Read-only fields (created date, ID)
- Update asset details
- Soft delete option

**Component: <ViewAssetModal />**
- Read-only detailed view
- Assignment history timeline
- Current status badge
- Quick actions (Edit, Deactivate)

**Component: <DeactivateConfirmModal />**
- Warning message about soft delete
- Confirmation checkbox
- Irreversible action warning

---

### Page: /users (User Management)

**Component: <Sidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <UserFilterHeader />**
- Search by name or email
- Role filter (Admin, Employee, All)
- Status filter (Active, Inactive)
- Department filter (future)

**Component: <AddUserButton />**
- Opens AddUserModal
- Requires `manage:users` permission

**Component: <UserDirectoryTable />**
- Columns: Name, Email, Role, Status, Join Date, Actions
- Avatar/initials display
- Row actions: View, Edit, Change Role, Deactivate
- Pagination controls

**Modals:**

**Component: <AddUserModal />**
- Form: Name*, Email*, Password*, Role*, Phone (optional)
- Email uniqueness validation
- Password strength meter
- Default role: Employee

**Component: <EditUserModal />**
- Update personal information
- Change email/phone
- Reset password option

**Component: <UserRoleManagementModal />**
- Role dropdown (Admin/Employee)
- Permission overview display
- Confirmation dialog for role changes
- Audit log entry creation

---

### Page: /assignments (Assignment Management)

**Component: <Sidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <NewAssignmentForm />**
- Two-step wizard:
  - Step 1: Select Asset (dropdown with search)
  - Step 2: Select Employee (dropdown with search)
- Expected return date picker
- Notes textarea (optional)
- Validation: Asset must be Available

**Component: <ActiveAssignmentsTable />**
- Columns: Asset, Assigned To, Assignment Date, Expected Return, Status, Actions
- Filter by overdue items
- "Return Asset" quick action button
- Export functionality

**Component: <RevokeAssignmentModal />**
- Return asset workflow
- Condition assessment (Good, Damaged, Lost)
- Notes field for return inspection
- Automatic status update to "Available"

---

### Page: /reports (Analytics & Reports)

**Component: <Sidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <CategoryDistributionChart />**
- Pie chart showing asset category breakdown
- Percentages and counts
- Interactive legend (click to filter)
- Library: Recharts or Chart.js

**Component: <AssetStatusBreakdownChart />**
- Stacked bar chart by status over time
- Trends visualization
- Comparison: This month vs last month

**Component: <FinancialDepreciationWidget />**
- Line graph of asset value over time
- Depreciation calculation method selector
- Total current value display
- Export to financial report

**Component: <ExportReportButton />**
- Generate PDF report with charts
- Scheduled email reports (future)
- Custom date range selection

---

## Role: Standard Employee (Limited Access - View Only)

### Page: /dashboard (Employee Workspace)

**Component: <EmployeeSidebar />**
- Simplified navigation: Dashboard, My Assets only
- No Users or Admin links visible
- Same visual design as admin sidebar

**Component: <TopNavbar />** - Reused

**Component: <MyAssetCountCard />**
- Large number display: "X Assets Assigned"
- Breakdown: Laptops, Monitors, Other
- Trend: Recently added/returned

**Component: <MyAssignedAssetsList />**
- Compact list/grid of assigned items
- Quick view per asset
- "Report Issue" button per item

**Component: <MyOpenTicketsWidget />** (Future)
- Active support tickets list
- Status badges (Open, In Progress, Resolved)
- Quick link to ticket details

---

### Page: /inventory (Browse Inventory - Read Only)

**Component: <Sidebar />** - Reused (shows only authorized links)

**Component: <TopNavbar />** - Reused

**Component: <SearchInput />**
- Search available inventory
- Real-time filtering
- No filters for employees (simplified view)

**Component: <AssetGridView />**
- Card layout instead of table
- Visual emphasis on product images (future)
- No edit/delete actions
- Read-only badge on each card

**Component: <AssetCard />**
- Asset image placeholder
- Asset Tag, Model, Category
- Status badge (Available/Assigned)
- "View Details" button → opens modal

---

### Page: /my-assets (Personal Assigned Equipment)

**Component: <EmployeeSidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <MyAssetGrid />**
- Card grid of personally assigned assets
- Filter: All, Laptops, Monitors, Peripherals
- Sort: Assignment Date (newest first)

**Component: <AssetDetailCard />**
- Larger card format with more details:
  - Assignment date
  - Expected return date
  - Warranty status
  - Support contact info
- "Report Issue" prominent button

**Component: <ViewDetailsButton />**
- Opens detailed asset view modal
- Shows full specifications
- Assignment history for this asset

---

### Page: /my-assets/[id] (Specific Asset Detail)

**Component: <EmployeeSidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <AssetDetailPane />**
- Full asset specifications
- Current status display
- Care/maintenance instructions (future)
- Support ticket history

**Component: <ReportIssueButton />**
- Prominent CTA button
- Opens ReportIssueModal
- Pre-selects current asset

---

### Page: /report-issue (Submit Support Ticket)

**Component: <EmployeeSidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <IssueSubmissionForm />**
- Multi-step form:
  - Step 1: Select Asset (from my assignments)
  - Step 2: Issue Category (Hardware, Software, Physical Damage, Other)
  - Step 3: Description (textarea with min character count)
  - Step 4: Upload Images (drag-drop, max 5 images)
  - Step 5: Review & Submit
- Progress indicator
- Save as draft option (future)

**Component: <CancelActionLink />**
- "Cancel" button returns to previous page
- Unsaved changes warning if form partially filled

---

### Page: /issues (Track Submitted Issues)

**Component: <EmployeeSidebar />** - Reused

**Component: <TopNavbar />** - Reused

**Component: <IssueStatusTrackerTable />**
- Columns: Ticket ID, Asset, Issue Type, Submitted Date, Status, Last Update
- Status color coding:
  - Open (Blue)
  - In Progress (Yellow)
  - Resolved (Green)
  - Closed (Gray)
- Sortable columns
- Click row to view details

**Component: <IssueDetailModal />**
- Full ticket timeline
- Admin responses/comments
- Status change history
- Resolution notes
- Close ticket button (if resolved)

---

## Shared Reusable Components (Global)

### Layout Components

**Component: <Button />**
- Variants: default, primary, secondary, destructive, outline, ghost, link
- Sizes: sm, md, lg
- Loading state with spinner
- Disabled state styling
- Icon + text layout support

**Component: <Badge />**
- Variants: default, success, warning, destructive, outline
- Sizes: sm, md
- Dot indicator option
- Custom color support

**Component: <TextInput />**
- Types: text, email, password, number, search, tel
- With/without label
- Error state with message
- Helper text support
- Character counter option

**Component: <DropdownSelect />**
- Single/multi-select modes
- Searchable options
- Grouped options support
- Clear selection button
- Custom option renderer

**Component: <ModalOverlay />**
- Backdrop with blur effect
- Slide-in animation
- Close on escape key
- Close on backdrop click
- Scroll lock when open

**Component: <DataTablePagination />**
- Page numbers with ellipsis
- Previous/Next buttons
- Jump to page input
- Rows per page selector
- Total count display

**Component: <Spinner />**
- Sizes: sm, md, lg
- Color variants
- Full-screen overlay mode
- Inline loading state

**Component: <ProtectedRoute />**
- Wraps protected page components
- Checks authentication state
- Validates permissions
- Redirects to login or dashboard
- Shows loading spinner during check

---

## File Structure Implementation

```
optiasset-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with providers
│   │   ├── page.tsx                   # Dashboard (role-aware)
│   │   ├── globals.css                # Global styles & theme
│   │   ├── login/
│   │   │   └── page.tsx               # Login page ✅ IMPLEMENTED
│   │   ├── inventory/
│   │   │   └── page.tsx               # Inventory page ✅ IMPLEMENTED (RBAC)
│   │   ├── users/
│   │   │   └── page.tsx               # Users page ✅ IMPLEMENTED (RBAC)
│   │   ├── assignments/
│   │   │   └── page.tsx               # Assignments (Future)
│   │   ├── reports/
│   │   │   └── page.tsx               # Reports (Future)
│   │   └── my-assets/
│   │       └── page.tsx               # Employee assets (Future)
│   │
│   ├── components/
│   │   ├── ui/                        # Shadcn primitives ✅ ALL INSTALLED
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── sidebar.tsx
│   │   │
│   │   ├── Sidebar.tsx                # ✅ IMPLEMENTED with RBAC
│   │   ├── Topbar.tsx                 # ✅ IMPLEMENTED
│   │   ├── ProtectedRoute.tsx         # ✅ IMPLEMENTED
│   │   ├── theme-provider.tsx         # ✅ IMPLEMENTED
│   │   └── theme-toggle.tsx           # ✅ IMPLEMENTED
│   │
│   ├── context/
│   │   └── AuthContext.tsx            # ✅ IMPLEMENTED with permissions
│   │
│   ├── hooks/
│   │   ├── usePermission.ts           # ✅ IMPLEMENTED
│   │   └── use-mobile.ts              # ✅ IMPLEMENTED
│   │
│   └── lib/
│       └── utils.ts                   # ✅ IMPLEMENTED (cn helper)
│
└── FRONTEND_ARCHITECTURE.md           # ✅ THIS DOCUMENT
```

---

## Implementation Status Legend

✅ = Implemented and tested  
🔄 = Partially implemented  
⏳ = Planned for future development  

---

## Next Steps (Post-Architecture)

1. **Initialize Next.js App:** `npx create-next-app@latest`
2. **Install Shadcn UI:** `npx shadcn-ui@latest init` (Already done ✅)
3. **Create Component Files:** Based on architecture list
4. **Implement Pages:** Convert architecture to actual routes
5. **Connect Backend APIs:** Integrate FastAPI endpoints
6. **Test RBAC:** Verify permission-based rendering
7. **Deploy:** Production build and hosting setup

---

**GitHub Repository Link:** [Will be provided upon submission]  
**Full Architecture Document:** `/optiasset-frontend/FRONTEND_ARCHITECTURE.md`

---

*This architecture document provides the complete blueprint for implementing the OptiAsset frontend system using Next.js and Shadcn UI components with comprehensive Role-Based Access Control.*
