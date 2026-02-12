# DATABASE STRUCTURE - QC MECHANICAL MANAGEMENT SYSTEM

## Overview
The database uses SQLite (via Prisma) with a relational structure designed for industrial quality control.

## ERD (Entity Relationship Diagram) Logic

### Core Entities
1.  **User & Role**: RBAC (Role-Based Access Control) system. Users belong to a Role (Admin, Inspector, etc.).
2.  **Client & Project**: Multi-client support. Each Project belongs to a Client.
3.  **Drawing**: Technical drawings linked to a Project. Used as a reference for all inspections and logs.

### Quality Control Modules
4.  **ITP (Inspection Test Plan)**: The master plan for quality.
    -   `ITP`: Main document for a project.
    -   `ITPItem`: Specific steps/stages (Hold Points, Witness Points).
5.  **Inspection**: Actual inspection events.
    -   Linked to a `Project`, an `Inspector`, and optionally an `ITPItem`.
    -   Status: Passed, Rejected, Pending.
6.  **NCR (Non-Conformance Report)**: Created when an `Inspection` fails.
    -   Linked 1:1 with a failed `Inspection`.
    -   Features: Root Cause, Corrective Action, Status tracking.
7.  **MDR (Manufacturing Data Report)**: Sequential reports for material lifecycle.
    -   Types: Incoming, Cutting, Fit-up, Welding, NDT, etc.

### Production Tracking
8.  **WeldLog**: Detailed tracking of welds.
    -   Linked to `Project`, `Drawing`, `Welder`, and `WPS`.
9.  **Welder**: Profile and performance metrics (Repair Rate, Performance Score).
10. **WPS (Welding Procedure Specification)**: Standards for welding.
11. **Material**: Track heat numbers and material allocation.

### Supporting
12. **EvidenceFile**: Centralized storage for photos/documents.
    -   Polymorphic-like relations to `Inspection`, `NCR`, `ITPItem`, and `MDRReport`.
13. **DefectCategory**: Catalog for statistical analysis of defects.

## TABLE SCHEMA SUMMARY

| Table | Description | Key Relations |
| :--- | :--- | :--- |
| `User` | Application users | Role, Inspections, ITPs |
| `Role` | User permissions | Users |
| `Client` | Owner of the project | Projects |
| `Project` | Main construction project | Client, Drawings, Inspections |
| `Drawing` | Technical blueprints | Project, WeldLogs |
| `ITP` | Inspection Test Plan | Project, ITPItems, Assignee |
| `ITPItem` | Sequence of hold/witness points | ITP, Inspections, Evidence |
| `Inspection` | Quality check records | Project, ITPItem, Inspector, NCR |
| `NCR` | Deviation management | Inspection, Evidence |
| `WeldLog` | Joint-by-joint tracking | Project, Drawing, Welder, WPS |
| `Welder` | Personnel records | WeldLogs |
| `WPS` | Welding standards | WeldLogs |
| `Material` | Stock and heat numbers | - |
| `EvidenceFile` | Files/Photos | Inspections, NCRs, ITPItems, MDRs |
| `DefectCategory` | Defect classification | - |
