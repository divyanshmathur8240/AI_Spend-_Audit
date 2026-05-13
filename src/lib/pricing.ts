import type { ToolDefinition } from './types';

export const TOOL_DEFINITIONS: Record<string, ToolDefinition> = {
  cursor: {
    key: 'cursor',
    name: 'Cursor',
    plans: [
      { key: 'Hobby', label: 'Hobby', monthlyPrice: 0 },
      { key: 'Pro', label: 'Pro', monthlyPrice: 20 },
      { key: 'Business', label: 'Business', monthlyPrice: 40 },
      { key: 'Enterprise', label: 'Enterprise', monthlyPrice: 120 }
    ],
    useCaseNotes: {
      coding: 'Cursor is a strong editing workflow if you want a lightweight AI code assistant.',
      mixed: 'Cursor is a good secondary tool when you want commit-ready AI editing with browser integrations.'
    },
    alternative: 'GitHub Copilot Individual'
  },
  copilot: {
    key: 'copilot',
    name: 'GitHub Copilot',
    plans: [
      { key: 'Individual', label: 'Individual', monthlyPrice: 10 },
      { key: 'Business', label: 'Business', monthlyPrice: 19 },
      { key: 'Enterprise', label: 'Enterprise', monthlyPrice: 0 }
    ],
    useCaseNotes: {
      coding: 'Copilot is optimized for developer workflows and is often the cheapest option for code-heavy teams.',
      mixed: 'Copilot can be a strong primary AI assistant for most engineering teams.'
    },
    alternative: 'Claude Pro'
  },
  claude: {
    key: 'claude',
    name: 'Claude',
    plans: [
      { key: 'Free', label: 'Free', monthlyPrice: 0 },
      { key: 'Pro', label: 'Pro', monthlyPrice: 20 },
      { key: 'Max', label: 'Max', monthlyPrice: 100 },
      { key: 'Team', label: 'Team', monthlyPrice: 40 },
      { key: 'Enterprise', label: 'Enterprise', monthlyPrice: 0 },
      { key: 'API direct', label: 'API direct', monthlyPrice: 0 }
    ],
    useCaseNotes: {
      writing: 'Claude often performs well for creative and research writing needs.',
      research: 'Claude has strong context handling for long-form research workflows.'
    },
    alternative: 'ChatGPT Plus'
  },
  chatgpt: {
    key: 'chatgpt',
    name: 'ChatGPT',
    plans: [
      { key: 'Plus', label: 'Plus', monthlyPrice: 20 },
      { key: 'Team', label: 'Team', monthlyPrice: 30 },
      { key: 'Enterprise', label: 'Enterprise', monthlyPrice: 0 },
      { key: 'API direct', label: 'API direct', monthlyPrice: 0 }
    ],
    useCaseNotes: {
      coding: 'ChatGPT is useful for code exploration, but API billing can be expensive if you do a lot of generation.',
      writing: 'ChatGPT Plus is often enough for smaller writing teams.'
    },
    alternative: 'OpenAI API direct'
  },
  anthropic: {
    key: 'anthropic',
    name: 'Anthropic',
    plans: [
      { key: 'API direct', label: 'API direct', monthlyPrice: 0 }
    ],
    useCaseNotes: {
      writing: 'Anthropic API direct can be a lower-cost alternative for text-heavy prompts.',
      research: 'The Claude-compatible Anthropic stacking works well for long-context workloads.'
    },
    alternative: 'OpenAI API direct'
  },
  openai: {
    key: 'openai',
    name: 'OpenAI',
    plans: [
      { key: 'API direct', label: 'API direct', monthlyPrice: 0 }
    ],
    useCaseNotes: {
      data: 'OpenAI API direct is often the best choice for embedding and data workflows.',
      research: 'OpenAI remains the most flexible option for toolchain integration.'
    },
    alternative: 'Anthropic API direct'
  },
  gemini: {
    key: 'gemini',
    name: 'Gemini',
    plans: [
      { key: 'Pro', label: 'Pro', monthlyPrice: 20 },
      { key: 'Ultra', label: 'Ultra', monthlyPrice: 40 },
      { key: 'API', label: 'API', monthlyPrice: 0 }
    ],
    useCaseNotes: {
      coding: 'Gemini Pro can be a useful assistant for code explanation workflows.',
      mixed: 'Gemini is often chosen when a Google-aligned assistant is preferred.'
    },
    alternative: 'ChatGPT Plus'
  },
  windsurf: {
    key: 'windsurf',
    name: 'Windsurf',
    plans: [
      { key: 'Free', label: 'Free', monthlyPrice: 0 },
      { key: 'Pro', label: 'Pro', monthlyPrice: 15 },
      { key: 'Business', label: 'Business', monthlyPrice: 30 }
    ],
    useCaseNotes: {
      research: 'Windsurf can be an economical option for early-stage teams focused on research summaries.',
      writing: 'The clean writer flow makes Windsurf a decent low-cost alternative for draft generation.'
    },
    alternative: 'Claude Free'
  }
};

export const TOOL_KEYS = Object.keys(TOOL_DEFINITIONS) as Array<keyof typeof TOOL_DEFINITIONS>;
