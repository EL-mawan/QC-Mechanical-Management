# QC Mechanical Management System

A comprehensive Quality Control Management System for mechanical fabrication projects with full MDR (Manufacturing Data Report) compliance tracking.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Setup database
bun prisma db push --force-reset
bun prisma generate
node prisma/seed.js

# Start development server
bun run dev
```

Access the application at `http://localhost:3003`

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@qc.com | password |
| Inspector | inspector@qc.com | password |

## ✨ Features

### Master Data Management
- ✅ **Client Management** - Full CRUD with real-time sync
- ✅ **Project Tracking** - Location-based monitoring
- ✅ **Welder Registry** - Performance scoring & certification
- ✅ **Material Inventory** - Heat number traceability
- ✅ **WPS Standards** - Welding procedure library
- ✅ **Technical Drawings** - Revision control

### MDR (Manufacturing Data Report) Modules
- ✅ **Incoming Inspection** - Material receiving & MTC validation
- ✅ **Cutting & Dimension** - Part traceability
- ✅ **Fit-up Inspection** - Pre-welding assembly checks
- ✅ **Welding Log** - Joint tracking with WPS compliance
- ✅ **NDT Management** - RT, UT, MT, PT, VI testing
- ✅ **Painting & Coating** - Environmental tracking & DFT
- ✅ **Final Release** - Dossier validation & handover

### Quality Control
- ✅ **ITP (Inspection Test Plan)** - Hold/Witness point management
- ✅ **NCR (Non-Conformance Report)** - Root cause analysis

### Dashboard
- Real-time inspection metrics
- Interactive charts (Recharts)
- Production velocity tracking
- Defect analysis
- Operational activity logs

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.0
- **Database**: SQLite + Prisma ORM
- **Authentication**: NextAuth.js
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Runtime**: Bun

## 📁 Project Structure

```
src/
├── app/
│   ├── actions/           # Server Actions for CRUD
│   ├── api/              # API routes (NextAuth)
│   ├── dashboard/        # Protected dashboard routes
│   │   ├── master/       # Master data modules
│   │   ├── mdr/          # MDR inspection modules
│   │   ├── itp/          # Inspection Test Plans
│   │   └── ncr/          # Non-Conformance Reports
│   ├── login/            # Authentication page
│   └── page.tsx          # Main dashboard
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── app-sidebar.tsx  # Navigation sidebar
│   └── dashboard-header.tsx
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   └── db.ts            # Prisma client
└── middleware.ts        # Route protection

prisma/
├── schema.prisma        # Database schema
└── seed.js             # Database seeding
```

## 📊 Database Schema

### Core Models
- **User** - Authentication & roles
- **Client** - Corporate entities
- **Project** - Fabrication projects
- **Welder** - Certified personnel
- **Material** - Inventory with heat numbers
- **WPS** - Welding procedures
- **Drawing** - Technical blueprints
- **MDRReport** - Manufacturing data
- **ITP** - Inspection test plans
- **NCR** - Non-conformance reports

See `DATABASE_STRUCTURE.md` for complete ERD.

## 🎨 Design System

### Colors
- **Primary**: `#1a4d4a` (Teal)
- **Background**: `#f8fafa`
- **Success**: Emerald
- **Error**: Rose/Red
- **Warning**: Amber

### Components
- Rounded corners (2xl, 3xl)
- Glassmorphism effects
- Micro-animations on hover
- Status-driven badge colors

## 📝 Available Scripts

```bash
bun run dev          # Start development server (port 3003)
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

## 🔒 Authentication

- Session-based authentication with NextAuth.js
- Role-based access control (Admin, Inspector)
- Protected routes via middleware
- Automatic redirect to dashboard after login

## 📖 Documentation

- **SYSTEM_DOCUMENTATION.md** - Complete feature documentation
- **DATABASE_STRUCTURE.md** - Database schema & ERD
- **prisma/schema.prisma** - Prisma schema definition

## 🚀 Deployment

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3003"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Production Build
```bash
bun run build
bun run start
```

## 📞 Support

For technical documentation, see `SYSTEM_DOCUMENTATION.md`

## 📄 License

Proprietary - QC Mechanical Management System  
© 2024 All Rights Reserved

---

**Version**: 1.0.0  
**Status**: Production Ready (Core Modules)  
**Last Updated**: February 11, 2026
