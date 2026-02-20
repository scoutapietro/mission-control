import { mutation } from "./_generated/server";

export default mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const tasks = await ctx.db.query("tasks").collect();
    const contentItems = await ctx.db.query("contentItems").collect();
    const jobs = await ctx.db.query("scheduledJobs").collect();
    const memories = await ctx.db.query("memories").collect();
    const agents = await ctx.db.query("agents").collect();

    await Promise.all([
      ...tasks.map(t => ctx.db.delete(t._id)),
      ...contentItems.map(c => ctx.db.delete(c._id)),
      ...jobs.map(j => ctx.db.delete(j._id)),
      ...memories.map(m => ctx.db.delete(m._id)),
      ...agents.map(a => ctx.db.delete(a._id)),
    ]);

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    // Seed Tasks
    await Promise.all([
      ctx.db.insert("tasks", {
        title: "Review quarterly reports",
        description: "Analyze Q4 performance metrics and prepare summary",
        status: "backlog",
        assignee: "me",
        priority: "high",
        createdAt: now - oneDay,
        updatedAt: now - oneDay,
      }),
      ctx.db.insert("tasks", {
        title: "Update website content",
        description: "Refresh homepage and add new features section",
        status: "in_progress",
        assignee: "scout",
        priority: "medium",
        createdAt: now - oneHour * 6,
        updatedAt: now - oneHour * 2,
      }),
      ctx.db.insert("tasks", {
        title: "Deploy v2.1.0",
        description: "Push latest release to production",
        status: "done",
        assignee: "scout",
        priority: "high",
        createdAt: now - oneDay * 2,
        updatedAt: now - oneHour * 4,
      }),
      ctx.db.insert("tasks", {
        title: "Research AI trends",
        description: "Investigate latest developments in LLMs",
        status: "backlog",
        assignee: "me",
        priority: "low",
        createdAt: now - oneHour * 3,
        updatedAt: now - oneHour * 3,
      }),
      ctx.db.insert("tasks", {
        title: "Code review",
        description: "Review pull requests for authentication module",
        status: "in_progress",
        assignee: "me",
        priority: "medium",
        createdAt: now - oneHour * 8,
        updatedAt: now - oneHour,
      }),
    ]);

    // Seed Content Items
    await Promise.all([
      ctx.db.insert("contentItems", {
        title: "How to Build an AI Agent",
        type: "video",
        stage: "script",
        script: "Introduction to AI agents and their capabilities...",
        createdAt: now - oneDay * 3,
        updatedAt: now - oneDay,
      }),
      ctx.db.insert("contentItems", {
        title: "Modern Web Development Guide",
        type: "blog",
        stage: "idea",
        createdAt: now - oneHour * 12,
        updatedAt: now - oneHour * 12,
      }),
      ctx.db.insert("contentItems", {
        title: "OpenClaw Tutorial Series",
        type: "video",
        stage: "filming",
        script: "Complete tutorial on using OpenClaw...",
        thumbnailUrl: "/thumbnails/openclaw.jpg",
        createdAt: now - oneDay * 5,
        updatedAt: now - oneHour * 6,
      }),
      ctx.db.insert("contentItems", {
        title: "Year in Review 2024",
        type: "blog",
        stage: "published",
        script: "Looking back at the achievements of 2024...",
        createdAt: now - oneDay * 10,
        updatedAt: now - oneDay * 2,
      }),
    ]);

    // Seed Scheduled Jobs
    await Promise.all([
      ctx.db.insert("scheduledJobs", {
        name: "Daily Backup",
        description: "Backup database and critical files",
        schedule: "0 2 * * *",
        lastRun: now - oneDay,
        nextRun: now + (oneDay - (oneHour * 2)),
        status: "active",
        createdAt: now - oneDay * 7,
      }),
      ctx.db.insert("scheduledJobs", {
        name: "Weekly Reports",
        description: "Generate weekly analytics report",
        schedule: "0 9 * * 1",
        nextRun: now + oneDay * 2,
        status: "active",
        createdAt: now - oneDay * 14,
      }),
      ctx.db.insert("scheduledJobs", {
        name: "System Health Check",
        description: "Monitor server performance and uptime",
        schedule: "*/15 * * * *",
        lastRun: now - (15 * 60 * 1000),
        nextRun: now + (15 * 60 * 1000),
        status: "active",
        createdAt: now - oneDay * 30,
      }),
      ctx.db.insert("scheduledJobs", {
        name: "Update Dependencies",
        description: "Check for and update package dependencies",
        schedule: "0 10 * * 6",
        lastRun: now - oneDay * 8,
        nextRun: now + oneDay * 6,
        status: "paused",
        createdAt: now - oneDay * 21,
      }),
    ]);

    // Seed Memories
    await Promise.all([
      ctx.db.insert("memories", {
        title: "Project Kickoff Meeting",
        content: "Discussed project scope, timeline, and deliverables. Key decisions: React for frontend, PostgreSQL for database, and Docker for deployment.",
        category: "meeting",
        tags: ["project", "planning", "architecture"],
        createdAt: now - oneDay * 5,
      }),
      ctx.db.insert("memories", {
        title: "API Design Patterns",
        content: "Learned about RESTful API best practices: proper HTTP status codes, resource naming conventions, and pagination strategies.",
        category: "learning",
        tags: ["api", "rest", "backend"],
        createdAt: now - oneDay * 3,
      }),
      ctx.db.insert("memories", {
        title: "Debugging Production Issue",
        content: "Memory leak in the image processing service. Fixed by implementing proper cleanup in the worker threads.",
        category: "code",
        tags: ["debugging", "memory", "performance"],
        createdAt: now - oneDay * 2,
      }),
      ctx.db.insert("memories", {
        title: "New Feature Ideas",
        content: "Brainstormed features: dark mode toggle, advanced search filters, real-time notifications, and mobile app support.",
        category: "idea",
        tags: ["features", "ui", "mobile"],
        createdAt: now - oneDay,
      }),
      ctx.db.insert("memories", {
        title: "Client Feedback Session",
        content: "Client loves the new dashboard design. Requested minor color adjustments and additional analytics charts.",
        category: "project",
        tags: ["client", "feedback", "ui"],
        createdAt: now - oneHour * 16,
      }),
      ctx.db.insert("memories", {
        title: "Security Best Practices",
        content: "Implemented JWT authentication, HTTPS everywhere, input validation, and rate limiting to prevent attacks.",
        category: "learning",
        tags: ["security", "jwt", "authentication"],
        createdAt: now - oneHour * 8,
      }),
    ]);

    // Seed Agents
    await Promise.all([
      ctx.db.insert("agents", {
        name: "Scout",
        role: "Main Agent",
        avatar: "/avatars/scout.jpg",
        status: "active",
        description: "Primary AI agent responsible for task coordination, user interaction, and system management.",
        responsibilities: [
          "Task management and coordination",
          "User communication and support",
          "System monitoring and alerts",
          "Decision making and planning"
        ],
        lastActive: now - (5 * 60 * 1000),
      }),
      ctx.db.insert("agents", {
        name: "Developer",
        role: "Development Agent",
        avatar: "/avatars/dev.jpg",
        status: "active",
        description: "Specialized in code development, debugging, and technical implementation tasks.",
        responsibilities: [
          "Code generation and review",
          "Bug fixing and debugging",
          "Architecture design",
          "Testing and quality assurance"
        ],
        lastActive: now - (2 * 60 * 1000),
      }),
      ctx.db.insert("agents", {
        name: "Writer",
        role: "Content Agent",
        avatar: "/avatars/writer.jpg",
        status: "idle",
        description: "Focused on content creation, documentation, and communication tasks.",
        responsibilities: [
          "Content writing and editing",
          "Documentation creation",
          "Marketing copy",
          "User guides and tutorials"
        ],
        lastActive: now - oneHour,
      }),
      ctx.db.insert("agents", {
        name: "Researcher",
        role: "Research Agent",
        avatar: "/avatars/researcher.jpg",
        status: "idle",
        description: "Handles research tasks, data analysis, and information gathering.",
        responsibilities: [
          "Market research and analysis",
          "Technical research",
          "Competitive analysis",
          "Data mining and insights"
        ],
        lastActive: now - (oneHour * 3),
      }),
    ]);

    return { success: true, message: "Seed data inserted successfully" };
  },
});