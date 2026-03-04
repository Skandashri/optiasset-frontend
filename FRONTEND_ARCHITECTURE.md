Role: Unauthenticated User (Can access authentication only)

Page: /login (Authentication page)

Component: <AuthLayout /> - Wraps login screen with enterprise branding layout.
Component: <LoginForm /> - Captures email and password with validation.
Component: <SSOButtonGroup /> - Provides federated login options.
Component: <ForgotPasswordLink /> - Navigates to password recovery flow.

Role: IT Administrator (Full access to manage assets, users, assignments, and reports)

Page: /dashboard (Main landing page after login)

Component: <Sidebar /> - Primary navigation menu (Dashboard, Assets, Users, Assignments, Reports).
Component: <TopNavbar /> - Displays notifications, profile dropdown, and logout.
Component: <StatCard /> - Shows key metrics like Total Assets, Assigned Assets, Broken Assets.
Component: <RecentAssignmentsTable /> - Displays latest assignment activities.
Component: <PendingIssuesWidget /> - Shows open support issues requiring action.

Page: /assets (Manage all company assets)

Component: <Sidebar /> - Reused navigation sidebar.
Component: <TopNavbar /> - Reused top navigation.
Component: <AssetFilterHeader /> - Search and filter controls (status, type, date).
Component: <NewAssetButton /> - Opens asset creation modal.
Component: <AssetDataGrid /> - Paginated and searchable asset table.
Component: <ExportReportDropdown /> - Allows CSV/PDF export.

Page: /assets/[id] (Single asset detail view)

Component: <Sidebar /> - Reused navigation sidebar.
Component: <TopNavbar /> - Reused top navigation.
Component: <BreadcrumbHeader /> - Displays navigation hierarchy.
Component: <AssetDetailCard /> - Displays complete asset information.
Component: <AssetStatusToggle /> - Marks asset as Available, Assigned, or Broken.
Component: <AssignmentHistoryTimeline /> - Shows full assignment history.
Component: <EditAssetModal /> - Updates asset details.

Page: /users (Manage employees)

Component: <Sidebar /> - Reused navigation sidebar.
Component: <TopNavbar /> - Reused top navigation.
Component: <UserFilterHeader /> - Search and role filters.
Component: <AddUserButton /> - Opens user creation modal.
Component: <UserDirectoryTable /> - Displays list of employees.
Component: <UserRoleManagementModal /> - Updates role and permissions.

Page: /assignments (Manage asset assignments)

Component: <Sidebar /> - Reused navigation sidebar.
Component: <TopNavbar /> - Reused top navigation.
Component: <NewAssignmentForm /> - Assigns asset to user.
Component: <ActiveAssignmentsTable /> - Shows active assignments.
Component: <RevokeAssignmentModal /> - Handles asset return workflow.

Page: /reports (Reports and analytics dashboard)

Component: <Sidebar /> - Reused navigation sidebar.
Component: <TopNavbar /> - Reused top navigation.
Component: <CategoryDistributionChart /> - Visualizes asset distribution by category.
Component: <AssetStatusBreakdownChart /> - Displays status analytics.
Component: <FinancialDepreciationWidget /> - Shows asset depreciation trends.
Component: <ExportReportButton /> - Exports report data.

Role: Standard Employee (Can view assigned assets and manage issues only)

Page: /my-dashboard (Employee landing page)

Component: <EmployeeSidebar /> - Navigation for employee-only routes.
Component: <TopNavbar /> - Displays profile and logout.
Component: <MyAssetCountCard /> - Shows total assigned assets.
Component: <MyAssignedList /> - Displays assets assigned to the user.
Component: <MyOpenTicketsWidget /> - Displays open reported issues.

Page: /my-assets (View all assigned assets)

Component: <EmployeeSidebar /> - Reused employee navigation.
Component: <TopNavbar /> - Reused top navigation.
Component: <MyAssetGrid /> - Grid layout of assigned assets.
Component: <AssetCard /> - Displays asset summary details.
Component: <ViewDetailsButton /> - Navigates to asset detail page.

Page: /my-assets/[id] (View specific assigned asset)

Component: <EmployeeSidebar /> - Reused employee navigation.
Component: <TopNavbar /> - Reused top navigation.
Component: <AssetDetailPane /> - Displays asset details with restricted permissions.
Component: <ReportIssueButton /> - Opens issue reporting modal.

Page: /report-issue (Submit new issue)

Component: <EmployeeSidebar /> - Reused employee navigation.
Component: <TopNavbar /> - Reused top navigation.
Component: <IssueSubmissionForm /> - Captures issue details and submits ticket.
Component: <CancelActionLink /> - Returns to previous page.

Page: /issues (Track reported issues)

Component: <EmployeeSidebar /> - Reused employee navigation.
Component: <TopNavbar /> - Reused top navigation.
Component: <IssueStatusTrackerTable /> - Displays reported issues and statuses.
Component: <IssueDetailModal /> - Shows detailed issue history.

Shared Reusable Components (Global)

Component: <Button /> - Reusable action button with variants.
Component: <Badge /> - Displays status labels.
Component: <TextInput /> - Reusable input field component.
Component: <DropdownSelect /> - Reusable dropdown selector.
Component: <ModalOverlay /> - Generic modal wrapper.
Component: <DataTablePagination /> - Reusable pagination controls.
Component: <Spinner /> - Loading indicator.
Component: <ProtectedRoute /> - Restricts access based on role.