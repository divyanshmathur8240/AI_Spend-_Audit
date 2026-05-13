# Automated Tests

## Files
- `src/lib/audit.test.ts` — unit tests for the audit engine and recommendation logic.

## Coverage
- Plan evaluation logic
- Cheaper plan recommendation for overprovisioned subscriptions
- Alternative suggestion generation
- Total savings aggregation across multiple tools
- No false savings when the selected plan is already appropriate

## Run tests
1. Install dependencies: `npm install`
2. Run: `npm test`
