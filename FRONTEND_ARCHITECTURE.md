# OptiAsset Management System - Frontend Architecture Document

**Project:** OptiAsset Asset Management System  
**Framework:** Next.js 16+ with TypeScript  
**UI Library:** React 19+ with Shadcn UI Components  
**Styling:** Tailwind CSS with Light/Dark Theme Support  
**Authentication:** JWT-based Role-Based Access Control (RBAC)  
**Date:** March 2026  

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Role Definitions](#role-definitions)
3. [Page Structure & Component Mapping](#page-structure--component-mapping)
4. [Reusable Components](#reusable-components)
5. [File Structure](#file-structure)
6. [Routing & Navigation](#routing--navigation)
7. [State Management](#state-management)
8. [Security Considerations](#security-considerations)

---

## Architecture Overview

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Components:** Shadcn UI (Radix UI primitives)
- **Styling:** Tailwind CSS with CSS Variables for theming
- **Authentication:** JWT tokens with OAuth2 password flow
- **State Management:** React Context API for auth state
- **HTTP Client:** Native Fetch API

### Design Principles
1. **Component Reusability:** Maximum DRY (Don't Repeat Yourself) principle
2. **RBAC-First:** Every page and component respects role permissions
3. **Responsive Design:** Mobile-first approach with desktop optimization
4. **Accessibility:** WCAG 2.1 AA compliance via Shadcn/Radix components
5. **Performance:** Server-side rendering where applicable, client-side for interactivity

---

## Role Definitions

### 1. Unauthenticated User
- **Access Level:** Authentication endpoints only
- **Permissions:** None (pre-authentication)
- **Entry Point:** `/login` page

### 2. IT Administrator (Admin Role)
- **Access Level:** Full system access
- **Permissions:** 
  - `all` (wildcard permission)
  - `manage:assets`, `view:assets`
  - `manage:users`, `view:users`
  - `manage:assignments`, `view:assignments`
  - `view:dashboard`, `view:reports`
- **Entry Point:** `/dashboard` (admin overview)

### 3. Standard Employee (Employee Role)
- **Access Level:** Limited to personal assets and view-only inventory
- **Permissions:**
  - `view:my_gear` (personal assigned assets)
  - `view:assets` (inventory browse, read-only)
  - `view:dashboard` (employee dashboard)
- **Entry Point:** `/dashboard` (employee workspace)

---

## Page Structure & Component Mapping

### Role: Unauthenticated User

#### Page: `/login` (Authentication)
**Route:** `src/app/login/page.tsx`  
**Description:** Enterprise authentication entry point with form validation

**Components:**
- `<AuthLayout />` - Centered layout with branding and visual hierarchy
- `<LoginForm />` - Email/password capture with real-time validation
- `<SSOButtonGroup />` - Federated login options (future enhancement)
- `<ForgotPasswordLink />` - Password recovery navigation (future)
- `<ThemeToggle />` - Light/dark mode switcher
- `<ErrorBanner />` - Displays authentication errors

**State:**
- Local: `email`, `password`, `loading`, `error`
- Context: `login()` function from AuthContext

**API Integration:**
- POST `/api/auth/login` - OAuth2 token endpoint
- Stores JWT token and user data in localStorage

---

### Role: IT Administrator

#### Page: `/` (Dashboard - Admin Overview)
**Route:** `src/app/page.tsx`  
**Description:** Primary landing page post-authentication with system health metrics

**Components:**
- `<Sidebar />` - Primary navigation with RBAC-filtered menu items
- `<Topbar />` - Top navigation bar with user profile and theme toggle
- `<StatCardGrid />` - Container for metric cards (4-column responsive grid)
  - `<StatCard>` - Individual metric display (icon + value + trend)
    - Total Assets count
    - Active Assignments count
    - Available Inventory count
    - Total Employees count
- `<RecentActivityTable />` - Last 5-10 asset assignments/returns
- `<PendingIssuesWidget />` - Open support tickets requiring admin action (future)

**Data Requirements:**
- Dashboard statistics from backend (`GET /api/dashboard`)
- Recent assignments list
- Real-time updates (future WebSocket integration)

---

#### Page: `/inventory` (Asset Management)
**Route:** `src/app/inventory/page.tsx`  
**Permission Required:** `view:assets` or `manage:assets`  
**Description:** Comprehensive inventory management interface

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<PageHeader />` - Title and description
- `<InventoryControls />` - Action toolbar
  - `<SearchInput />` - Real-time search by asset tag/name
  - `<StatusFilterDropdown />` - Filter: All, Available, Assigned, Maintenance
  - `<CategoryFilter />` - Filter by asset type (Laptops, Monitors, etc.)
  - `<NewAssetButton />` - Opens modal for asset creation
  - `<ExportButton />` - CSV/PDF export functionality
- `<AssetDataTable />` - Paginated data grid
  - Columns: Asset Tag, Name, Category, Status, Current Holder, Actions
  - Row actions: View, Edit, Deactivate (based on permissions)
- `<Pagination />` - Page navigation controls

**Modals:**
- `<AddAssetModal />` - Form for creating new assets
- `<EditAssetModal />` - Form for updating asset details
- `<ViewAssetModal />` - Read-only asset detail view
- `<DeactivateConfirmModal />` - Soft delete confirmation

**API Integration:**
- GET `/api/assets/` - List all assets (with filters)
- POST `/api/assets/` - Create new asset
- PUT `/api/assets/{id}` - Update asset
- PATCH `/api/assets/{id}/deactivate` - Soft delete

---

#### Page: `/users` (User Management)
**Route:** `src/app/users/page.tsx`  
**Permission Required:** `view:users` or `manage:users`  
**Description:** Employee directory and role administration

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<PageHeader />` - Title and description
- `<UserControls />` - Action toolbar
  - `<SearchInput />` - Search by name/email
  - `<RoleFilter />` - Filter by role (Admin, Employee)
  - `<StatusFilter />` - Active/Inactive users
  - `<AddUserButton />` - Opens user creation modal
- `<UserDirectoryTable />` - Paginated user list
  - Columns: Name, Email, Role, Status, Created Date, Actions
  - Row actions: View, Edit, Change Role, Deactivate

**Modals:**
- `<AddUserModal />` - Create new user account
- `<EditUserModal />` - Update user details
- `<ChangeRoleModal />` - Modify user role assignment
- `<ViewUserModal />` - User detail view with assignment history

**API Integration:**
- GET `/api/users/` - List all users
- POST `/api/users/` - Create user
- PUT `/api/users/{id}` - Update user
- PATCH `/api/users/{id}/role` - Change user role
- PATCH `/api/users/{id}/deactivate` - Soft delete user

---

#### Page: `/assignments` (Assignment Management)
**Route:** `src/app/assignments/page.tsx` (Future implementation)  
**Permission Required:** `manage:assignments` or `view:assignments`  
**Description:** Asset assignment workflow and tracking

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<PageHeader />` - Title and description
- `<AssignmentControls />` - Action toolbar
  - `<NewAssignmentButton />` - Opens assignment form
  - `<FilterByStatus />` - Active, Returned, Overdue
  - `<FilterByDate />` - Date range picker
- `<ActiveAssignmentsTable />` - Current active assignments
  - Columns: Asset, Assigned To, Assignment Date, Expected Return, Actions
- `<ReturnAssetButton />` - Initiate return workflow

**Modals:**
- `<NewAssignmentModal />` - Assign asset to employee form
- `<ReturnAssetModal />` - Process asset return
- `<ViewAssignmentModal />` - Assignment detail view

**API Integration:**
- GET `/api/assignments/` - List assignments
- POST `/api/assignments/` - Create assignment
- PATCH `/api/assignments/{id}/return` - Process return

---

#### Page: `/reports` (Analytics & Reports)
**Route:** `src/app/reports/page.tsx` (Future implementation)  
**Permission Required:** `view:reports`  
**Description:** Business intelligence and reporting dashboard

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<ReportTypeSelector />` - Tab navigation for report types
- `<CategoryDistributionChart />` - Pie/bar chart of asset categories
- `<AssetStatusBreakdownChart />` - Status distribution visualization
- `<FinancialDepreciationWidget />` - Asset value trends over time
- `<ExportReportDropdown />` - Export formats (CSV, PDF, Excel)

**Charts/Libraries:**
- Recharts or Chart.js for data visualization
- Date-fns for date manipulation

---

### Role: Standard Employee

#### Page: `/` (Dashboard - Employee Workspace)
**Route:** `src/app/page.tsx`  
**Description:** Employee personal landing page

**Components:**
- `<Sidebar />` - Simplified navigation (Dashboard, My Assets only)
- `<Topbar />` - Reused top navigation
- `<WelcomeMessage />` - Personalized greeting
- `<MyAssetCountCard />` - Total assigned assets count
- `<MyAssignedAssetsList />` - Quick view of current assignments
- `<QuickActions />` - Common actions
  - `<ReportIssueButton />` - Report problem with asset
  - `<RequestNewEquipmentButton />` - Request new equipment (future)
- `<MyOpenTicketsWidget />` - Active support tickets status

**Data Requirements:**
- User's assigned assets from `GET /api/assignments/` filtered by user_id
- Ticket information (future integration)

---

#### Page: `/inventory` (Browse Inventory - Read Only)
**Route:** `src/app/inventory/page.tsx`  
**Permission Required:** `view:assets`  
**Description:** Employee view of company inventory (read-only)

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<PageHeader />` - Title and description
- `<SearchInput />` - Search available inventory
- `<AssetGridView />` - Grid layout of asset cards
  - `<AssetCard />` - Compact asset summary card
    - Shows: Asset Tag, Name, Status, Category
    - No edit/delete actions (view-only)

**Restrictions:**
- No create/edit/delete buttons visible
- No status change capabilities
- Read-only API calls only

---

#### Page: `/my-assets` (My Assigned Assets)
**Route:** `src/app/my-assets/page.tsx` (Future implementation)  
**Permission Required:** `view:my_gear`  
**Description:** Employee's personally assigned equipment

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<PageHeader />` - "My Equipment" title
- `<MyAssetGrid />` - Card grid of assigned assets
  - `<AssetDetailCard />` - Detailed asset view
    - Asset info, assignment date, warranty status
- `<ReportIssueButton />` - Quick issue reporting per asset

**API Integration:**
- GET `/api/assignments/` - Filtered by current user
- GET `/api/assets/{id}` - Asset details

---

#### Page: `/report-issue` (Submit Issue Ticket)
**Route:** `src/app/report-issue/page.tsx` (Future implementation)  
**Permission Required:** `view:my_gear`  
**Description:** Issue/ticket submission form

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<IssueForm />` - Multi-step form
  - Step 1: Select asset from my assignments
  - Step 2: Issue category dropdown
  - Step 3: Description textarea
  - Step 4: Upload images (optional)
  - Step 5: Review and submit
- `<CancelButton />` - Abort submission

**API Integration:**
- POST `/api/tickets/` - Submit new support ticket (future endpoint)

---

#### Page: `/issues` (My Support Tickets)
**Route:** `src/app/issues/page.tsx` (Future implementation)  
**Permission Required:** `view:my_gear`  
**Description:** Track submitted issues and their status

**Components:**
- `<Sidebar />` - Reused navigation
- `<Topbar />` - Reused top navigation
- `<PageHeader />` - "My Support Tickets" title
- `<IssueStatusTrackerTable />` - Ticket list with status badges
  - Columns: Ticket ID, Asset, Issue Type, Submitted Date, Status, Actions
- `<IssueDetailModal />` - View ticket details and admin responses

---

## Reusable Components

### Layout Components

#### `<Sidebar />`
**Location:** `src/components/sidebar.tsx`  
**Purpose:** Primary navigation sidebar with RBAC logic

**Props:**
- `collapsed?: boolean` - Collapsed state for mobile
- `onToggle?: () => void` - Toggle callback

**Internal State:**
- Reads `user.permissions` from AuthContext
- Filters nav items based on `usePermission()` hooks

**Nav Items Configuration:**
```typescript
const navItems = [
  { title: "Dashboard", href: "/", icon: Home, show: true },
  { title: "Inventory", href: "/inventory", icon: Package, show: canViewAssets },
  { title: "Users", href: "/users", icon: Users, show: canManageUsers },
]
```

**Responsive Behavior:**
- Desktop: Fixed width (64px collapsed, 256px expanded)
- Mobile: Slide-out drawer with overlay

---

#### `<Topbar />`
**Location:** `src/components/topbar.tsx`  
**Purpose:** Top navigation bar with user controls

**Components:**
- `<MobileMenuButton />` - Hamburger menu for mobile sidebar toggle
- `<Breadcrumb />` - Current page navigation path
- `<NotificationBell />` - Alert notifications (future)
- `<ThemeToggle />` - Light/dark mode switcher
- `<UserMenuDropdown />` - Profile menu with logout option

---

#### `<ProtectedRoute />`
**Location:** `src/components/ProtectedRoute.tsx`  
**Purpose:** Higher-order component for route protection

**Props:**
- `children: React.ReactNode` - Child components
- `requiredPermission?: string` - Permission string to check
- `fallbackPath?: string` - Redirect path if unauthorized (default: "/login")

**Logic:**
1. Check authentication state from AuthContext
2. If unauthenticated → redirect to login
3. If missing permission → redirect to dashboard
4. Otherwise render children

**Usage Example:**
```typescript
export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermission="view:users">
      {/* Page content */}
    </ProtectedRoute>
  )
}
```

---

### UI Components (Shadcn)

#### Data Display
- `<Card />`, `<CardHeader />`, `<CardContent />`, `<CardFooter />`
- `<Table />`, `<TableHeader />`, `<TableBody />`, `<TableRow />`, `<TableCell />`
- `<Badge />` - Status indicators with color variants
- `<Avatar />` - User profile images
- `<Skeleton />` - Loading placeholders

#### Forms & Input
- `<Input />` - Text input with variants
- `<Label />` - Form field labels
- `<Textarea />` - Multi-line text input
- `<Select />`, `<SelectTrigger />`, `<SelectContent />`, `<SelectItem />`
- `<Switch />` - Boolean toggles
- `<Checkbox />` - Multi-select checkboxes

#### Interactive
- `<Button />` - Action buttons with variants (default, destructive, outline, ghost)
- `<DropdownMenu />` - Context menus
- `<Dialog />`, `<DialogContent />`, `<DialogHeader />`, `<DialogFooter />` - Modals
- `<Sheet />` - Slide-out panels

#### Feedback
- `<Spinner />` - Loading indicators
- `<Toast />` - Success/error notifications (future)
- `<Alert />`, `<AlertDescription />` - Warning/info banners

#### Utility
- `<Separator />` - Visual dividers
- `<Tooltip />`, `<TooltipContent />`, `<TooltipTrigger />` - Hover hints
- `<Pagination />` - Page navigation controls

---

## File Structure

```
optiasset-frontend/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Dashboard (role-aware)
│   │   ├── globals.css               # Global styles and theme variables
│   │   ├── login/
│   │   │   └── page.tsx              # Login/authentication page
│   │   ├── inventory/
│   │   │   └── page.tsx              # Inventory management/view page
│   │   ├── users/
│   │   │   └── page.tsx              # User management page
│   │   ├── assignments/
│   │   │   └── page.tsx              # Assignment management (future)
│   │   ├── reports/
│   │   │   └── page.tsx              # Analytics dashboard (future)
│   │   └── my-assets/
│   │       └── page.tsx              # Employee's assigned assets (future)
│   │
│   ├── components/
│   │   ├── ui/                       # Shadcn primitive components
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
│   │   │   └── sidebar.tsx           # Shadcn sidebar primitive
│   │   │
│   │   ├── Sidebar.tsx               # Custom app sidebar with RBAC
│   │   ├── Topbar.tsx                # Top navigation bar
│   │   ├── ProtectedRoute.tsx        # Route protection wrapper
│   │   ├── theme-provider.tsx        # Theme context provider
│   │   └── theme-toggle.tsx          # Light/dark mode toggle
│   │
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication state management
│   │
│   ├── hooks/
│   │   ├── usePermission.ts          # Permission checking hook
│   │   └── use-mobile.ts             # Mobile detection hook
│   │
│   ├── lib/
│   │   └── utils.ts                  # cn() utility for class merging
│   │
│   └── types/
│       └── index.ts                  # TypeScript type definitions
│
├── public/                           # Static assets
│   ├── logo.svg
│   └── favicon.ico
│
├── .env                              # Environment variables
├── .gitignore
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # Project documentation
```

---

## Routing & Navigation

### Route Hierarchy

```
/ (Root) → Redirects to /login if unauthenticated, /dashboard if authenticated
├── /login → Authentication page
├── /dashboard → Role-aware dashboard (Admin Overview / Employee Workspace)
├── /inventory → Inventory management (Admin) / Browse (Employee)
├── /users → User management (Admin only)
├── /assignments → Assignment management (Admin only)
├── /reports → Analytics dashboard (Admin only)
└── /my-assets → Employee's assigned assets (Employee only)
```

### Navigation Flow

**Admin User Flow:**
1. Login → `/login`
2. Redirect to `/` (Admin Dashboard)
3. Navigate via Sidebar:
   - `/inventory` → Manage assets
   - `/users` → Manage users
   - `/assignments` → Manage assignments
   - `/reports` → View analytics

**Employee User Flow:**
1. Login → `/login`
2. Redirect to `/` (Employee Dashboard)
3. Navigate via Sidebar:
   - `/inventory` → Browse assets (read-only)
   - (Future) `/my-assets` → View personal equipment
   - (Future) `/report-issue` → Submit ticket

### Programmatic Navigation

**Client-Side Navigation:**
```typescript
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/inventory') // Navigate to inventory
router.replace('/login')  // Replace current history entry
router.back()             // Go back
```

**Server-Side Navigation:**
```typescript
import { redirect } from 'next/navigation'

// In server component
if (!user) {
  redirect('/login')
}
```

---

## State Management

### Authentication State (Context API)

**Location:** `src/context/AuthContext.tsx`

**State Shape:**
```typescript
interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Employee"
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (userData: User, token: string) => void
  logout: () => void
  isLoading: boolean
}
```

**Storage:**
- User data and JWT token stored in `localStorage`
- Persists across page refreshes
- Auto-logout on token expiration

### Permission Checking (Custom Hooks)

**Location:** `src/hooks/usePermission.ts`

**Hooks:**
```typescript
usePermission(requiredPermission: string): boolean
// Returns true if user has permission

useHasAnyPermission(permissions: string[]): boolean
// Returns true if user has ANY of the listed permissions
```

**Usage:**
```typescript
const canEditAssets = usePermission('manage:assets')
const canViewReports = useHasAnyPermission(['view:reports', 'manage:reports'])
```

### Local Component State (useState/useReducer)

**Examples:**
- Form inputs (controlled components)
- Modal open/close states
- Table pagination state
- Search/filter states
- Loading states for async operations

---

## Security Considerations

### Frontend RBAC Implementation

**Permission Checks:**
1. **Navigation Filtering:** Sidebar hides unauthorized links
2. **Route Protection:** `<ProtectedRoute>` redirects unauthorized access
3. **Component Rendering:** Conditional rendering based on permissions
4. **Button Visibility:** Action buttons hidden without required permissions

**Important Note:**
> ⚠️ **Frontend security is UX-only.** All authorization must be enforced server-side. A malicious user can bypass frontend checks. The backend API validates permissions on every request.

### JWT Token Handling

**Token Storage:**
- Stored in `localStorage` for persistence
- Included in Authorization header: `Bearer <token>`
- Automatic injection via fetch wrapper (future enhancement)

**Token Expiration:**
- Tokens expire after 30 minutes (configurable)
- Frontend detects 401 Unauthorized responses
- Auto-redirect to login on expiration

**Future Enhancements:**
- Refresh token rotation
- Silent re-authentication
- Session timeout warnings

### XSS/CSRF Protection

**Best Practices:**
1. Sanitize all user inputs (DOMPurify for rich text)
2. Use Next.js built-in CSRF protection for forms
3. Validate all API responses before rendering
4. Content Security Policy (CSP) headers in production

---

## Future Enhancements

### Phase 2 Features

1. **Advanced Search & Filtering**
   - Debounced search inputs
   - Advanced filter builders
   - Saved search presets

2. **Real-Time Updates**
   - WebSocket integration for live data
   - Optimistic UI updates
   - Conflict resolution

3. **File Uploads**
   - Asset image uploads
   - Document attachments
   - Drag-and-drop interfaces

4. **Notifications System**
   - In-app notification center
   - Email digest preferences
   - Push notifications (PWA)

5. **Audit Logging**
   - User activity timeline
   - Change history viewer
   - Compliance reports

6. **Bulk Operations**
   - Bulk asset import/export
   - Batch user creation
   - Mass assignment updates

### Performance Optimizations

1. **Code Splitting:** Route-based lazy loading
2. **Image Optimization:** Next.js Image component
3. **API Caching:** React Query / SWR integration
4. **Virtual Scrolling:** For large datasets (1000+ rows)
5. **Service Worker:** Offline support and caching

---

## Development Workflow

### Setup Instructions

```bash
# Clone repository
git clone <repo-url>
cd optiasset-frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint codebase
npm run lint
```

### Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=OptiAsset
```

### Code Style & Conventions

**Naming Conventions:**
- Components: PascalCase (`UserProfile`)
- Files: kebab-case (`user-profile.tsx`)
- Utils: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)

**Component Structure:**
```typescript
"use client"  // For interactive components

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

interface ComponentProps {
  prop1: string
  prop2?: number
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks first
  const { user } = useAuth()
  const [state, setState] = useState(defaultValue)
  
  // Event handlers
  const handleClick = () => { ... }
  
  // Render
  return (
    <div>...</div>
  )
}
```

---

## Testing Strategy

### Unit Tests (Jest + React Testing Library)

**Test Coverage:**
- Utility functions (date formatting, string manipulation)
- Custom hooks (`usePermission`, `useAuth`)
- Isolated component rendering
- Form validation logic

**Example:**
```typescript
describe('usePermission', () => {
  it('returns true for admin with all permissions', () => {
    const { result } = renderHook(() => usePermission('manage:assets'), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: { permissions: ['all'] } }}>
          {children}
        </AuthContext.Provider>
      )
    })
    expect(result.current).toBe(true)
  })
})
```

### Integration Tests

**Test Scenarios:**
- Login flow with valid/invalid credentials
- Route protection redirects
- API error handling
- Permission-based UI rendering

### E2E Tests (Playwright/Cypress - Future)

**Critical Paths:**
1. Admin complete workflow (login → manage assets → logout)
2. Employee complete workflow (login → view assets → report issue)
3. Cross-browser compatibility
4. Mobile responsiveness

---

## Deployment

### Production Build Checklist

- [ ] Environment variables configured
- [ ] API URLs updated to production
- [ ] Build optimizations enabled (minification, tree-shaking)
- [ ] Source maps generated for debugging
- [ ] Static assets optimized
- [ ] Security headers configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics integration (Google Analytics)

### Hosting Options

**Recommended:** Vercel (creators of Next.js)
- Automatic deployments from Git
- Edge network CDN
- Serverless functions support
- Preview deployments for PRs

**Alternative:** Docker + Kubernetes
- Custom Dockerfile included
- Helm charts for K8s deployment
- Horizontal scaling capabilities

---

## Appendix A: Component Dependency Graph

```
App Layout
├── ThemeProvider
│   └── TooltipProvider
│       └── AuthProvider
│           ├── Sidebar (RBAC-filtered)
│           ├── Topbar
│           │   ├── ThemeToggle
│           │   └── UserMenuDropdown
│           └── Main Content Area
│               └── ProtectedRoute
│                   └── Page Component
│                       └── Feature Components
```

---

## Appendix B: API Endpoint Mapping

| Page | Component | API Method | Endpoint | Permission |
|------|-----------|------------|----------|------------|
| Login | LoginForm | POST | `/auth/login` | None |
| Dashboard | StatCardGrid | GET | `/dashboard` | `view:dashboard` |
| Inventory | AssetDataTable | GET | `/assets/` | `view:assets` |
| Inventory | NewAssetModal | POST | `/assets/` | `manage:assets` |
| Inventory | EditAssetModal | PUT | `/assets/{id}` | `manage:assets` |
| Users | UserDirectoryTable | GET | `/users/` | `view:users` |
| Users | AddUserModal | POST | `/users/` | `manage:users` |
| Assignments | ActiveAssignmentsTable | GET | `/assignments/` | `view:assignments` |
| Assignments | NewAssignmentModal | POST | `/assignments/` | `manage:assignments` |

---

**Document Version:** 1.0  
**Last Updated:** March 7, 2026  
**Maintained By:** Development Team  
**Review Cycle:** Per major feature release  

---

*This architecture document serves as the blueprint for implementing the OptiAsset frontend. All development should align with these specifications unless approved architectural changes are documented.*
