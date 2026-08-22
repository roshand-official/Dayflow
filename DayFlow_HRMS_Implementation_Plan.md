You are a world-class product designer, UX architect, Odoo developer, frontend engineer, backend engineer, and enterprise SaaS product strategist.

Build a production-quality Odoo HR management product called:

DAYFLOW

TAGLINE:
"HR, without the busywork."

CORE PRODUCT IDEA:
Dayflow is a modern, intelligent Human Resource Management System built on Odoo. It transforms traditional HR administration into a calm, visual, action-oriented experience.

The product must feel like a premium global SaaS product, not a customized ERP screen.

IMPORTANT:
Do NOT simply decorate the existing Odoo UI.
Do NOT create a Dribbble-style visual prototype with fake functionality.
Do NOT use static JSON as the primary data source.
Do NOT build a generic ChatGPT clone and call it AI HR.
Build real workflows using Odoo models, ORM, permissions, validation, and dynamic data.

The product must combine:

1. Odoo's enterprise reliability
2. Modern premium SaaS UX
3. Real HR workflows
4. Real-time/dynamic data
5. Context-aware AI assistance
6. Strong visual hierarchy
7. Extremely low cognitive load
8. Responsive design
9. Accessibility
10. Production-quality engineering


==================================================
1. PRODUCT POSITIONING
==================================================

DAYFLOW is an HR operating workspace.

Traditional HR software makes HR managers search for problems.

Dayflow should surface what requires attention.

CORE PRODUCT PRINCIPLE:

"Don't make HR search for work.
Show HR what matters next."

The application should answer three questions immediately:

1. What is happening?
2. What needs attention?
3. What can I do about it?


==================================================
2. DESIGN DIRECTION
==================================================

Use the uploaded visual references as inspiration for the design language.

DO NOT copy the reference application.

Extract and adapt these characteristics:

- premium editorial SaaS aesthetic
- large rounded cards
- soft glass surfaces
- subtle translucency
- blurred gradients
- oversized numerical metrics
- minimal typography
- strong whitespace
- subtle data visualizations
- elegant micro-interactions
- restrained use of color
- floating controls
- visual hierarchy
- calm interface
- sophisticated motion
- minimal borders
- high-quality visual composition

The final product should feel comparable in visual quality to:

- Linear
- Stripe
- Notion
- Ramp
- modern Apple-style interfaces
- premium fintech dashboards

But Dayflow must retain its own visual identity.


==================================================
3. BRAND IDENTITY
==================================================

PRODUCT NAME:

DAYFLOW

Use:

DAY
FLOW

as the visual wordmark treatment where appropriate.

TAGLINE:

HR, without the busywork.


BRAND PERSONALITY:

- intelligent
- calm
- modern
- trustworthy
- human
- efficient
- premium
- enterprise-ready

Avoid:

- childish illustrations
- excessive gradients
- excessive neon
- generic blue corporate dashboards
- excessive shadows
- excessive icons
- dense ERP layouts
- unnecessary animations


==================================================
4. COLOR SYSTEM
==================================================

PRIMARY BACKGROUND:

#F7F6F2

PRIMARY TEXT:

#111111

SECONDARY TEXT:

#777777

CARD:

#FFFFFF

BORDER:

#E8E6E1

PRIMARY ACCENT:

#D7FF00

PRIMARY ACCENT DARK:

#A8C900

SUCCESS:

#BFE8C4

WARNING:

#F4D98A

DANGER:

#F2A6A0

INFO:

#BFDCE8

DARK SURFACE:

#161616


USE THE COLORS INTENTIONALLY.

Do NOT make the entire interface neon.

The lime color #D7FF00 is the signature Dayflow interaction/state color.

Use it primarily for:

- selected states
- important metrics
- active indicators
- primary CTA emphasis
- positive trend indicators
- key AI actions
- attention indicators

Use semantic colors consistently:

GREEN/LIME:
Positive / completed / healthy

AMBER:
Pending / warning

CORAL:
Critical / issue

BLUE:
Information

BLACK:
Primary actions / high contrast


==================================================
5. TYPOGRAPHY
==================================================

Primary font:

MANROPE

Fallback:

INTER, SYSTEM-UI, SANS-SERIF


Typography hierarchy:

PAGE TITLE:
32px
font-weight: 700

SECTION TITLE:
20px
font-weight: 650

CARD TITLE:
15–17px
font-weight: 600

PRIMARY METRIC:
36–48px
font-weight: 700

BODY:
15–16px
font-weight: 400

SECONDARY:
13–14px
font-weight: 400

LABEL:
11–13px
font-weight: 500


Use typography to establish hierarchy.

Do not make every element bold.


==================================================
6. DESIGN TOKENS
==================================================

Use a centralized design-token system.

Example:

--df-bg: #F7F6F2;
--df-surface: #FFFFFF;
--df-text: #111111;
--df-muted: #777777;
--df-border: #E8E6E1;
--df-lime: #D7FF00;
--df-lime-dark: #A8C900;
--df-success: #BFE8C4;
--df-warning: #F4D98A;
--df-danger: #F2A6A0;
--df-info: #BFDCE8;
--df-dark: #161616;

RADIUS:

small: 12px
medium: 16px
large: 24px
XL: 32px

CARD PADDING:

20–28px

GRID GAP:

16–24px

BUTTON HEIGHT:

44–48px

INPUT HEIGHT:

44–48px


==================================================
7. GLASSMORPHISM
==================================================

Use glass effects selectively.

Example:

background:
rgba(255,255,255,0.70)

backdrop-filter:
blur(20px)

border:
1px solid rgba(255,255,255,0.5)

border-radius:
24px


Use glass for:

- KPI cards
- Copilot
- floating panels
- overlays
- quick actions
- employee summary cards

Do NOT use glass for:

- dense tables
- complex forms
- configuration pages
- settings
- long text
- accessibility-critical content

Usability always wins over visual effects.


==================================================
8. GLOBAL APPLICATION STRUCTURE
==================================================

Desktop:

------------------------------------------------
DAYFLOW
------------------------------------------------
Overview
People
Attendance
Leave
Payroll
Performance
Reports
Copilot

------------------------------

Settings
Help
Profile
------------------------------------------------


MOBILE:

Bottom navigation:

Home
People
Attendance
Leave
More

AI Copilot should remain accessible from every major screen.


==================================================
9. DASHBOARD
==================================================

Create an exceptional HR dashboard.

Header:

Good morning, [User Name]

Subtitle:

"Here's what needs your attention today."


PRIMARY KPI CARDS:

Attendance

94%

+3.2% this week


Employees

248

+12 this month


On Leave

18

7 pending


Pending Actions

7

Requires attention


Payroll

₹24.8L

98.6% processed


Each KPI card should include:

- large number
- short label
- contextual comparison
- tiny visualization
- semantic status
- clickable interaction


==================================================
10. ATTENTION CENTER
==================================================

This is a signature Dayflow feature.

Create:

ATTENTION CENTER

Purpose:

Surface HR issues without requiring the HR manager to search through modules.


Example:

CRITICAL

3 employees have unusual attendance patterns

[Review]


NEEDS ATTENTION

7 leave requests awaiting approval

[Review]


NEEDS ATTENTION

4 employee documents expire this month

[Review]


ALL GOOD

Payroll processing completed


Each item should have:

- severity
- explanation
- affected count
- timestamp
- recommended action
- direct action button


IMPORTANT:

Attention Center must use actual Odoo data.

Do not hardcode examples.


==================================================
11. QUICK ACTIONS
==================================================

Create a visually elegant Quick Actions panel.

Actions:

+ Add Employee

Mark Attendance

Apply Leave

Approve Leave

Run Payroll

Create Announcement

View Reports

Ask Copilot


Quick actions should be context-aware.

For HR Admin:

Show administrative actions.

For Employee:

Show employee actions.

For Manager:

Show team-management actions.


==================================================
12. EMPLOYEE MANAGEMENT
==================================================

Create a modern employee directory.

Features:

- search
- filters
- department
- job position
- manager
- employment status
- attendance
- location
- joining date

Employee cards should show:

Avatar

Name

Role

Department

Attendance status

Current state

Quick action


Example:

ANANYA SHARMA

Product Designer

Engineering

96% Attendance

● Active


Use cards on visual views.

Provide table view for operational workflows.


==================================================
13. EMPLOYEE PROFILE
==================================================

Create a premium employee profile.

Header:

Avatar

ANANYA SHARMA

Product Designer

Engineering

Employee ID


Primary metrics:

Attendance

96%


Leave Balance

14 days


Performance

Excellent


Tasks

18 / 21


Then sections:

Attendance

Leave

Performance

Documents

Payroll

Activity

Manager

Team


Create a visual timeline.

Example:

Jan  ●
Feb  ●
Mar  ●
Apr  ●
May  ●
Jun  ○
Jul  ●
Aug  ●


Use real Odoo records.


==================================================
14. ATTENDANCE
==================================================

Create a visual attendance experience.

Header:

Attendance

94%

This Month


Include:

Present

Late

Absent

Leave

Work From Home


Calendar visualization:

MON TUE WED THU FRI

●   ●   ●   ●   ●

●   ●   ×   ●   ●


Color-code states semantically.

Provide:

- daily attendance
- monthly attendance
- attendance trends
- late arrivals
- absence patterns
- employee comparison
- department comparison


For managers:

Team Attendance.


==================================================
15. ATTENDANCE ANALYTICS
==================================================

Provide:

Attendance Trend

Daily

Weekly

Monthly


Metrics:

Average attendance

Late arrivals

Absence rate

Leave rate


Charts should be:

- clean
- minimal
- readable
- responsive

Avoid chart overload.


==================================================
16. LEAVE MANAGEMENT
==================================================

Create a visual leave management experience.

Employee view:

Annual Leave

14 days remaining


Used:

8 days

Pending:

2 requests


Create a leave timeline:

Jan ✓
Feb ✓
Mar ✓
Apr ×
May ✓
Jun ✓
Jul ✓
Aug ●


HR view:

Pending Requests

Employee

Leave Type

Duration

Reason

Status

Action


Actions:

Approve

Reject

Request clarification


Every approval/rejection must update actual Odoo records.


==================================================
17. PAYROLL
==================================================

Create a payroll overview.

Metrics:

Total Payroll

₹24.8L

Processed

98.6%

Pending

4

Exceptions

2


Show:

- payroll status
- department cost
- employee payroll
- processing status
- exceptions

Do not expose sensitive payroll data to unauthorized users.

Respect Odoo access rights.


==================================================
18. PERFORMANCE
==================================================

Create a modern performance module.

Metrics:

Goal completion

Performance review

Manager feedback

Employee development


Use:

- progress indicators
- timeline
- review cards
- goals
- feedback


Avoid arbitrary "AI employee scores."

Only display scores backed by actual defined metrics.


==================================================
19. RECENT CHANGES
==================================================

Create:

RECENT CHANGES

Examples:

Attendance updated

Leave request submitted

Payroll processed

Employee joined

Document updated


Each item:

Icon

Description

Person

Time

Status

Clicking it opens the corresponding Odoo record.


==================================================
20. DAYFLOW COPILOT
==================================================

This is the most important intelligent feature.

Do NOT build a generic chatbot.

Build:

DAYFLOW COPILOT


Purpose:

Allow HR users to ask questions about actual Odoo HR data and perform safe actions.


Example questions:

"Who is absent today?"

"Show employees with attendance below 90%."

"How many leave requests are pending?"

"Which employees are joining this month?"

"Show attendance for the Engineering team."

"Which employee documents expire this month?"

"Give me this month's attendance summary."

"Which departments have the highest absence rate?"


==================================================
21. COPILOT ACTIONS
==================================================

The Copilot should not only answer.

It should perform actions with confirmation.

Example:

USER:

"Show employees below 90% attendance."


COPILOT:

12 employees match your criteria.

[Employee results]


USER:

"Send them a reminder."


COPILOT:

You're about to send an attendance reminder to 12 employees.

Recipients:
12

Message:
"Please review your attendance record."


[Cancel]

[Send Reminder]


Only execute after explicit confirmation.


==================================================
22. COPILOT SECURITY
==================================================

CRITICAL.

AI must NEVER bypass Odoo permissions.

The Copilot must operate through the authenticated user's authorization context.

Rules:

- no privilege escalation
- no unauthorized payroll access
- no unauthorized employee data
- no arbitrary database queries
- validate every action
- log important actions
- require confirmation for destructive/sensitive operations


Sensitive actions require confirmation.

Examples:

- delete employee
- change payroll
- approve/reject leave
- modify attendance
- send bulk communication


==================================================
23. COPILOT RESPONSE DESIGN
==================================================

Do not produce huge paragraphs.

Use structured responses.

Example:

Attendance Summary

Engineering

94% average attendance

3 late arrivals

2 absences


Top concern:

Arun Kumar

84% attendance


[View Employee]


Use:

- cards
- tables
- metrics
- actions
- concise explanations


==================================================
24. AI ACTION PIPELINE
==================================================

Implement the Copilot architecture as:

User
 ↓
Intent detection
 ↓
Permission validation
 ↓
Odoo data retrieval
 ↓
Structured result
 ↓
LLM reasoning/summarization
 ↓
Action proposal
 ↓
User confirmation
 ↓
Odoo ORM action
 ↓
Audit log
 ↓
Result


Never allow the LLM to directly modify the database.


==================================================
25. AI FAILURE HANDLING
==================================================

If the Copilot cannot answer:

"I couldn't verify that from the available HR data."

Do not hallucinate.

If permissions prevent access:

"You don't have permission to access that information."


If data is incomplete:

"I found incomplete attendance data for 3 employees."


Accuracy is more important than sounding intelligent.


==================================================
26. RESPONSIVE DESIGN
==================================================

Desktop:

Sidebar + dashboard


Tablet:

Collapsible sidebar


Mobile:

Bottom navigation

Stacked cards

Horizontal scrolling where necessary

Touch-friendly controls


Minimum touch target:

44px


Never create horizontal overflow unnecessarily.


==================================================
27. ACCESSIBILITY
==================================================

Implement:

- keyboard navigation
- visible focus states
- semantic HTML
- ARIA where necessary
- sufficient contrast
- accessible labels
- non-color-only status indicators
- readable typography


Do not rely solely on green/red.

Use:

✓ Present

⚠ Pending

× Absent


==================================================
28. MICRO-INTERACTIONS
==================================================

Use subtle motion.

Examples:

Card hover:

translateY(-2px)

Button:

150–200ms transition

Status changes:

soft fade

Charts:

progressive rendering

Copilot:

typing/processing state


Avoid:

- excessive bouncing
- unnecessary page transitions
- distracting animation
- animation that slows workflow


Motion should communicate state.


==================================================
29. LOADING STATES
==================================================

Never show blank screens.

Use skeleton loaders.

Example:

Dashboard:

[████████]
[████████████]

Employee:

[avatar]
[████████]
[████████]


==================================================
30. EMPTY STATES
==================================================

Create useful empty states.

Example:

No pending leave requests.

"You're all caught up."

[View Leave History]


Not:

"No data."


==================================================
31. ERROR STATES
==================================================

Errors must explain:

What happened

Why

What the user can do


Example:

"Attendance could not be updated."

"The employee record could not be found."

[Try Again]


==================================================
32. SEARCH
==================================================

Global search should support:

Employees

Departments

Leave requests

Attendance

Documents

Payroll

Reports


Search should provide:

Recent searches

Suggestions

Grouped results


==================================================
33. FILTER SYSTEM
==================================================

Use reusable filters.

Examples:

Department

Status

Date

Manager

Location

Employment Type


Filters should be represented as compact pills.

Example:

Engineering ×

Active ×

This Month ×


==================================================
34. DATA VISUALIZATION
==================================================

Use charts only when they communicate useful information.

Preferred:

- line charts
- progress bars
- donut charts
- timeline
- KPI trend
- calendar heatmap

Avoid:

3D charts

decorative charts

unnecessary pie charts


==================================================
35. TABLE DESIGN
==================================================

Tables must remain operational.

Use:

Employee

Department

Status

Attendance

Leave

Actions


Actions:

View

Edit

Approve

Reject


Keep tables clean.

Use hover states.

Provide sorting.

Provide pagination.

Provide filters.


==================================================
36. ODOO INTEGRATION
==================================================

Use Odoo-native architecture.

Use Odoo ORM.

Use Odoo models.

Use access control.

Use record rules.

Use server actions where appropriate.

Use computed fields only where justified.

Use proper module structure.


Potential models/modules:

hr.employee

hr.department

hr.attendance

hr.leave

hr.leave.type

hr.contract

hr.job

hr.appraisal

hr.expense

hr.payslip

Use existing Odoo capabilities rather than recreating them.


==================================================
37. CUSTOM DAYFLOW MODELS
==================================================

Create custom models only where necessary.

Examples:

dayflow.attention

dayflow.ai.session

dayflow.ai.action

dayflow.activity

dayflow.insight

dayflow.notification


Keep the data model normalized.

Avoid duplicate Odoo data.


==================================================
38. SECURITY
==================================================

Implement role-based access.

Roles:

Employee

Manager

HR Officer

HR Manager

Administrator


Employee:

Own information

Own attendance

Own leave

Own payroll where permitted


Manager:

Team information

Team attendance

Team leave

Team performance


HR:

Organization-wide HR information


Administrator:

System configuration


Never expose sensitive employee information through frontend filtering alone.

Authorization must happen server-side.


==================================================
39. AUDITABILITY
==================================================

AI and important HR actions must be auditable.

Record:

User

Timestamp

Action

Target record

Before state

After state

Source

AI-generated or human-generated


Example:

AI Action

User:
HR Manager

Action:
Approved Leave

Employee:
Ananya Sharma

Timestamp:
10:42 AM

Confirmation:
Explicit


==================================================
40. NOTIFICATIONS
==================================================

Create a notification center.

Categories:

Attendance

Leave

Payroll

Documents

Performance

AI


Example:

7 pending actions

2 critical

5 normal


Notifications must deep-link to the appropriate record.


==================================================
41. DASHBOARD PERSONALIZATION
==================================================

Different roles should see different dashboards.

EMPLOYEE:

My attendance

My leave

My tasks

My documents

My payroll

Copilot


MANAGER:

Team attendance

Team leave

Team performance

Attention Center


HR:

Organization attendance

Leave requests

Employee lifecycle

Payroll

Attention Center

Copilot


==================================================
42. EMPLOYEE LIFECYCLE
==================================================

Where feasible support:

Candidate → Employee

Joining

Onboarding

Attendance

Leave

Performance

Payroll

Exit


Represent the lifecycle visually.


==================================================
43. ONBOARDING
==================================================

Create:

ONBOARDING PROGRESS

Employee:

Ananya Sharma

78% complete


Checklist:

✓ Personal details

✓ Documents

✓ Bank information

○ Policy acknowledgement

○ Manager introduction


Use progress visualization.


==================================================
44. HR REPORTS
==================================================

Create reports:

Attendance Report

Leave Report

Employee Report

Department Report

Payroll Summary

Employee Lifecycle

Performance Summary


Provide:

Filters

Date ranges

Export

Charts

Tables


==================================================
45. GLOBAL UX PRINCIPLE
==================================================

Every page must answer:

"What is the most important thing here?"


There should be exactly one dominant visual hierarchy.

Do not make every card equally important.


==================================================
46. VISUAL CARD SYSTEM
==================================================

Card types:

1. Metric Card
2. Insight Card
3. Action Card
4. Timeline Card
5. Chart Card
6. Employee Card
7. Attention Card
8. AI Card


All cards must belong to the same design system.


==================================================
47. SIGNATURE DAYFLOW COMPONENT
==================================================

Create a reusable:

DAYFLOW INSIGHT CARD


Structure:

[Icon]

TITLE

Large metric

Context

Trend

Action →


Example:

ATTENDANCE

94%

+3.2% from last month

● ● ● ● ● ●

View details →


==================================================
48. SIGNATURE ATTENTION COMPONENT
==================================================

Create:

ATTENTION CARD


Example:

⚠

Attendance anomaly

3 employees require review

Detected today


[Review]


Use severity styling.

Do not overuse red.


==================================================
49. SIGNATURE COPILOT COMPONENT
==================================================

Floating AI entry point:

✦


Click opens:

DAYFLOW COPILOT


Suggested actions:

Who is absent today?

Pending leave requests

Attendance summary

Employee search


The Copilot must remember the current page context.

Example:

If user is viewing Engineering:

User:

"Who is absent?"


Copilot should interpret:

"Who is absent in Engineering?"

unless the user explicitly asks for organization-wide data.


==================================================
50. CONTEXT-AWARE AI
==================================================

The Copilot should know:

Current user

Current role

Current page

Selected employee

Selected department

Selected date range

User permissions


This is a major differentiator.


==================================================
51. PERFORMANCE OPTIMIZATION
==================================================

Avoid unnecessary requests.

Use:

- pagination
- lazy loading
- caching where appropriate
- batched ORM queries
- optimized computed fields
- indexed fields where necessary


Avoid N+1 queries.

Do not load thousands of employee records into the browser.


==================================================
52. ENGINEERING QUALITY
==================================================

Code must be:

- modular
- readable
- maintainable
- documented where necessary
- secure
- testable


Avoid:

- duplicated code
- magic numbers
- massive components
- hardcoded business logic
- hardcoded dashboard values
- unnecessary dependencies


==================================================
53. TESTING
==================================================

Test:

Employee creation

Attendance creation

Leave request

Leave approval

Leave rejection

Permission boundaries

Copilot read operations

Copilot action confirmation

Unauthorized access

Dashboard calculations

Responsive layout


AI actions must have additional tests.


==================================================
54. DEMO DATA
==================================================

Create realistic demo data through Odoo.

Use believable:

Employees

Departments

Attendance

Leave

Payroll

Performance


Do not use:

John Doe

test@test.com

Lorem ipsum


Use realistic Indian enterprise data.

Example departments:

Engineering

Human Resources

Finance

Operations

Sales

Marketing


==================================================
55. DEMO EXPERIENCE
==================================================

The product must be demoable in approximately 3 minutes.

Demo sequence:

1. Login

2. Dashboard

3. Attention Center

4. Open attendance anomaly

5. Open employee profile

6. Show attendance trend

7. Open leave request

8. Approve leave

9. Open Copilot

10. Ask:

"Show employees with attendance below 90%."

11. Show real Odoo data

12. Ask:

"Send them an attendance reminder."

13. Show confirmation

14. Execute

15. Show updated activity/audit record


The demo should feel like one continuous story.


==================================================
56. DEMO NARRATIVE
==================================================

OPEN WITH:

"HR doesn't have a data problem.
HR has an attention problem."


THEN:

"Dayflow turns Odoo's HR data into an operating workspace."


SHOW:

Dashboard

↓

Attention Center

↓

Problem

↓

Employee

↓

AI Copilot

↓

Action

↓

Confirmation

↓

Odoo update


CLOSE WITH:

"Dayflow doesn't just tell HR what happened.

It tells HR what matters next."


==================================================
57. VISUAL QUALITY BAR
==================================================

Before considering the product complete, compare every major screen against these questions:

Does it look premium?

Does it look intentional?

Is the hierarchy obvious?

Can an HR manager understand it within 5 seconds?

Is there unnecessary information?

Are the cards visually consistent?

Are numbers prominent?

Are actions obvious?

Does it feel like one product?

Does it look better than a default Odoo implementation?

If not, redesign it.


==================================================
58. DO NOT OVERDESIGN
==================================================

World-class does NOT mean:

more gradients

more animations

more glass

more colors

more cards

more charts


World-class means:

less friction

better hierarchy

better information architecture

better defaults

better interaction design

better feedback

better consistency


==================================================
59. FINAL VISUAL COMPOSITION
==================================================

The ideal Dayflow screen should feel approximately:

60% clean information

20% visual analytics

10% actions

10% personality


Use whitespace aggressively.

Do not fill every pixel.


==================================================
60. FINAL PRODUCT STANDARD
==================================================

The final result must feel like a product that could realistically be launched as a global HR SaaS company.

It must NOT feel like:

"an Odoo hackathon project."

It must feel like:

"a serious HR product that happens to be powered by Odoo."


FINAL PRODUCT POSITIONING:

DAYFLOW

HR, without the busywork.

ONE WORKSPACE.
EVERYTHING HR NEEDS.
INTELLIGENCE WHERE IT MATTERS.


==================================================
IMPLEMENTATION PRIORITY
==================================================

PHASE 1 — MUST HAVE

1. Dayflow Dashboard
2. Attention Center
3. Employee Directory
4. Employee Profile
5. Attendance
6. Leave Management
7. Dayflow Copilot
8. Odoo integration
9. Role-based access
10. Responsive UI


PHASE 2

11. Payroll
12. Performance
13. Reports
14. Notifications
15. Employee onboarding


PHASE 3

16. Advanced analytics
17. AI insights
18. Workflow automation
19. Advanced employee lifecycle
20. Additional integrations


==================================================
MOST IMPORTANT IMPLEMENTATION RULE
==================================================

DO NOT BUILD EVERYTHING AT ONCE.

First build an extremely polished vertical slice:

Dashboard
→ Attention Center
→ Employee
→ Attendance
→ Copilot
→ Real Odoo action

Make this workflow excellent.

Then expand.


==================================================
FINAL INSTRUCTION
==================================================

Build Dayflow as a cohesive product.

Every screen must share the same design language.

Every important number must come from real data.

Every important action must use real Odoo workflows.

Every AI action must respect permissions and require confirmation where appropriate.

Every component must be reusable.

Every page must be responsive.

Every interaction must provide feedback.

Every failure must be handled.

Every sensitive operation must be auditable.

Do not optimize for feature count.

Optimize for:

PRODUCT QUALITY
UX QUALITY
ENGINEERING QUALITY
DEMO QUALITY
RELIABILITY
INTELLIGENCE

The final result should be visually distinctive enough to be remembered after the judging session and technically credible enough to demonstrate that it is a real Odoo product rather than a static prototype.