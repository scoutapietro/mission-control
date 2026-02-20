# OpenClaw Mission Control Dashboard

A comprehensive dashboard for managing OpenClaw agents, tasks, content pipeline, and system monitoring.

## Features

- **Task Board**: Kanban-style task management with drag & drop
- **Content Pipeline**: Visual content workflow from ideas to publication
- **Scheduled Jobs**: Cron job monitoring with time-until-next-run
- **Memory Bank**: Searchable knowledge base with categorization
- **Team Structure**: Visual org chart of agents and their status
- **Digital Office**: Interactive office layout showing agent activity

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with zinc/slate dark theme

## Quick Start

### Option 1: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Convex backend:**
   ```bash
   npx convex dev
   ```
   This will:
   - Start the Convex backend locally
   - Generate TypeScript types in `convex/_generated/`
   - Open dashboard at http://localhost:3001

3. **Seed the database (optional):**
   ```bash
   npx convex run seed:default
   ```

4. **Start the Next.js app:**
   ```bash
   npm run dev
   ```

5. **Open the dashboard:**
   Visit http://localhost:3000

### Option 2: Docker Compose

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Seed the database:**
   ```bash
   docker-compose exec app npx convex run seed:default
   ```

3. **Open the dashboard:**
   Visit http://localhost:3000

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_CONVEX_URL=http://localhost:3001
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Convex provider
│   ├── page.tsx            # Main dashboard page
│   ├── globals.css         # Global styles
│   └── ConvexProvider.tsx  # Convex client setup
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── input.tsx
│   ├── TaskBoard.tsx       # Kanban board component
│   ├── ContentPipeline.tsx # Content workflow
│   ├── Calendar.tsx        # Scheduled jobs
│   ├── MemoryScreen.tsx    # Knowledge base
│   ├── TeamStructure.tsx   # Agent org chart
│   ├── DigitalOffice.tsx   # Office layout
│   └── Navigation.tsx      # Sidebar navigation
└── lib/
    └── utils.ts           # Utility functions

convex/
├── schema.ts              # Database schema
├── tasks.ts              # Queries and mutations
└── seed.ts               # Sample data
```

## Database Schema

### Tables

- **tasks**: Task management (title, status, assignee, priority)
- **contentItems**: Content pipeline (title, type, stage, script)
- **scheduledJobs**: Cron jobs (name, schedule, nextRun, status)
- **memories**: Knowledge base (title, content, category, tags)
- **agents**: Team members (name, role, status, responsibilities)

## Development

### Adding New Components

1. Create component in `src/components/`
2. Add to navigation in `Navigation.tsx`
3. Add route in `page.tsx`
4. Update types if needed

### Database Changes

1. Update `convex/schema.ts`
2. Add/update queries in `convex/tasks.ts`
3. Run `npx convex dev` to regenerate types
4. Update seed data if needed

### Styling Guidelines

- Use zinc/slate colors for dark theme
- Components should have consistent padding and borders
- Use hover states and transitions for interactivity
- Follow the existing card-based layout pattern

## Deployment

### Convex Production

1. Create Convex project:
   ```bash
   npx convex deploy
   ```

2. Update environment variable:
   ```bash
   NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   ```

### Next.js Deployment

Deploy to Vercel, Netlify, or any Node.js hosting platform:

```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **Types not generated**: Run `npx convex dev` to generate types
2. **Database empty**: Run seed script with `npx convex run seed:default`
3. **Port conflicts**: Change ports in `docker-compose.yml` or environment
4. **Style issues**: Check Tailwind CSS configuration and dark mode setup

### Logs

- Next.js: Check browser console and terminal
- Convex: Check convex dashboard or local dev server logs
- Docker: `docker-compose logs app` or `docker-compose logs convex`

## License

MIT License - feel free to use this as a starting point for your own dashboard projects.