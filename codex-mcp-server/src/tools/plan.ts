import { CodexExecutor } from '../utils/codex-executor.js';
import { PlanOutputSchema } from '../utils/schema-validator.js';

export interface PlanToolInput {
  task: string;
  constraints?: string;
  timeline?: string;
  sessionId?: string;
}

export async function planTool(input: PlanToolInput) {
  const executor = new CodexExecutor();

  const prompt = buildPlanningPrompt(input);

  const result = await executor.execute(prompt, {
    model: 'gpt-5',
    fullAuto: true,
    json: true,
    sessionId: input.sessionId,
  });

  if (!result.success) {
    throw new Error(`Codex planning failed: ${result.error}`);
  }

  return {
    plan: result.output,
    executionTime: result.executionTime,
    sessionId: result.sessionId,
  };
}

function buildPlanningPrompt(input: PlanToolInput): string {
  let prompt = `Create Implementation Plan: ${input.task}\n\n`;

  if (input.constraints) {
    prompt += `Constraints:\n${input.constraints}\n\n`;
  }

  if (input.timeline) {
    prompt += `Timeline: ${input.timeline}\n\n`;
  }

  prompt += `Generate a detailed, actionable implementation plan with:

1. **Overview**: High-level summary of the plan
2. **Phases**: Break down into logical phases, each with:
   - Phase name and description
   - Specific steps with duration estimates
   - Dependencies between steps
   - Potential risks
3. **Technologies**: Required technologies/tools
4. **Timeline**: Overall timeline estimate
5. **Risks**: Project-level risks and mitigation strategies
6. **Next Steps**: Immediate actionable next steps

Make the plan concrete, realistic, and implementation-ready.`;

  return prompt;
}
