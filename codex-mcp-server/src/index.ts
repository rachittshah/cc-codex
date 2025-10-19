#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { reasonTool } from './tools/reason.js';
import { planTool } from './tools/plan.js';
import { specTool } from './tools/spec.js';
import { analyzeTool } from './tools/analyze.js';
import { compareTool } from './tools/compare.js';

const server = new Server(
  {
    name: 'codex-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'codex_reason',
        description:
          'Deep reasoning and analysis using Codex with gpt-5. Use this for complex problems requiring thorough analysis, trade-off evaluation, and decision-making.',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'The question or problem to reason about',
            },
            context: {
              type: 'string',
              description: 'Additional context to inform the reasoning',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for context sharing',
            },
          },
          required: ['question'],
        },
      },
      {
        name: 'codex_plan',
        description:
          'Generate detailed implementation plans using Codex with gpt-5. Creates structured, actionable plans with phases, steps, timelines, and risk assessments.',
        inputSchema: {
          type: 'object',
          properties: {
            task: {
              type: 'string',
              description: 'The task or feature to plan',
            },
            constraints: {
              type: 'string',
              description: 'Any constraints or requirements',
            },
            timeline: {
              type: 'string',
              description: 'Target timeline or deadline',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for context sharing',
            },
          },
          required: ['task'],
        },
      },
      {
        name: 'codex_spec',
        description:
          'Create comprehensive technical specifications using Codex with gpt-5. Generates detailed specs with requirements, architecture, API design, and implementation guidance.',
        inputSchema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Title of the specification',
            },
            description: {
              type: 'string',
              description: 'High-level description of what to specify',
            },
            requirements: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of requirements to include',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for context sharing',
            },
          },
          required: ['title', 'description'],
        },
      },
      {
        name: 'codex_analyze',
        description:
          'Analyze code, architecture, or systems using Codex with gpt-5. Performs security, performance, and maintainability analysis with actionable recommendations.',
        inputSchema: {
          type: 'object',
          properties: {
            target: {
              type: 'string',
              description: 'What to analyze (file, directory, system)',
            },
            focusAreas: {
              type: 'array',
              items: { type: 'string' },
              description:
                'Specific areas to focus on (e.g., security, performance)',
            },
            depth: {
              type: 'string',
              enum: ['quick', 'standard', 'deep'],
              description: 'Depth of analysis',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for context sharing',
            },
          },
          required: ['target'],
        },
      },
      {
        name: 'codex_compare',
        description:
          'Compare multiple options or approaches using Codex with gpt-5. Evaluates options against criteria and provides recommendations with detailed rationale.',
        inputSchema: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
              description: 'What to compare (e.g., "Which database?")',
            },
            options: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of options to compare',
            },
            criteria: {
              type: 'array',
              items: { type: 'string' },
              description: 'Evaluation criteria',
            },
            context: {
              type: 'string',
              description: 'Additional context for the comparison',
            },
            sessionId: {
              type: 'string',
              description: 'Optional session ID for context sharing',
            },
          },
          required: ['question', 'options'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'codex_reason': {
        const result = await reasonTool(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'codex_plan': {
        const result = await planTool(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'codex_spec': {
        const result = await specTool(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'codex_analyze': {
        const result = await analyzeTool(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'codex_compare': {
        const result = await compareTool(args as any);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Codex MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
