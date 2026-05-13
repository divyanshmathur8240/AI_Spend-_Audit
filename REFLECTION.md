# Reflection

1. **The hardest bug I hit this week:** Getting npm to work in the Windows environment with optional dependency issues during Rollup installation. **How I debugged it:** I checked the PATH configuration, confirmed Node.js was installed at D:\Environment\nodejs, used npm.cmd to bypass PowerShell script execution policies, and then dealt with missing Rollup optional dependencies by doing a clean reinstall. The issue revealed itself through test execution failures when vitest couldn't load properly.

2. **A decision I reversed mid-week:** I initially planned to skip tests until deployment, but decided mid-way that 5 core audit engine tests were essential to validate the hardcoded logic—since the audit math must be defensible to users. This shift helped ensure the recommendation engine was correct before shipping.

3. **What I would build in week 2 if I had it:** 
   - Supabase backend for persistent lead storage + transactional email confirmations
   - Real Anthropic API integration with error telemetry
   - Expanded pricing data for all tool vendors (currently placeholders)
   - User interview synthesis into REFLECTION.md
   - Vercel deployment with real environment setup
   - Social proof component with real or mocked customer quotes

4. **How I used AI tools:** I used Claude (this tool) extensively for code generation of the audit engine, form components, and API routes. I did NOT trust it with pricing logic or savings calculations—those I hand-coded with clear reasoning. AI was wrong once when it suggested a cheaper plan that didn't fit the team size; I caught it by writing and reviewing the test case.

5. **Self-rating on a 1–10 scale:**
   - **Discipline: 8** — I stayed focused on MVP features and didn't add bonus features like PDF export early. I prioritized the audit engine, form, and sharing flow.
   - **Code quality: 7** — TypeScript, clear naming, proper imports, but the lead store is a placeholder and the summary prompt could be stronger.
   - **Design sense: 7** — Tailwind usage is clean and responsive, but I didn't invest in a custom brand identity or hero graphics. The visual hierarchy is clear but not memorable.
   - **Problem-solving: 9** — Adapted quickly to missing Node tooling, debugged npm issues, and designed the audit logic to handle edge cases like overprovisioned plans for small teams.
   - **Entrepreneurial thinking: 7** — I mapped the GTM and economics documents but didn't yet conduct real user interviews or validate product-market fit. The positioning is solid but untested.
