# PROMPTS

## AI summary prompt
The AI summary endpoint uses a prompt like this:

"You are an AI auditor for a business tool review.

Write a 100-word summary for a team of {teamSize} people using AI tools for {useCase}. The audit found {totalMonthlySavings} USD in monthly savings. Include the highest-value recommendation and signal whether the stack is already efficient.

Audit recommendations:
- {toolName}: {selectedPlan} -> {savings}

Write the summary as a concise, helpful note to a founder or finance lead."

## Prompt design notes
- The prompt guides the model to focus on team size, use case, and overall savings.
- It avoids product claims and stays objective by asking for the best recommendation and the efficiency signal.
- If the API fails, the frontend falls back to a templated summary so the app still returns valuable feedback.
