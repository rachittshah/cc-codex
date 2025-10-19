import { CodexExecutor } from '../utils/codex-executor.js';
import { ReasoningOutputSchema } from '../utils/schema-validator.js';

export interface ReasonToolInput {
  question: string;
  context?: string;
  sessionId?: string;
}

export async function reasonTool(input: ReasonToolInput) {
  const executor = new CodexExecutor();

  const prompt = buildReasoningPrompt(input);

  const result = await executor.execute(prompt, {
    model: 'gpt-5',
    fullAuto: true,
    json: true,
    sessionId: input.sessionId,
  });

  if (!result.success) {
    throw new Error(`Codex reasoning failed: ${result.error}`);
  }

  return {
    reasoning: result.output,
    executionTime: result.executionTime,
    sessionId: result.sessionId,
  };
}

function buildReasoningPrompt(input: ReasonToolInput): string {
  let prompt = `Deep Reasoning Task: ${input.question}\n\n`;

  if (input.context) {
    prompt += `Context:\n${input.context}\n\n`;
  }

  prompt += `Please provide a comprehensive analysis following this structure:

1. **Analysis**: Detailed examination of the question/problem
2. **Considerations**: Key factors to consider (with impact levels: high/medium/low)
3. **Approaches**: Multiple approaches with pros, cons, and complexity
4. **Recommendation**: Your recommended approach
5. **Rationale**: Detailed reasoning for your recommendation

Be thorough, consider trade-offs, and provide actionable insights.`;

  return prompt;
}
