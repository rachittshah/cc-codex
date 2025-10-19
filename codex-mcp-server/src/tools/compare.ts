import { CodexExecutor } from '../utils/codex-executor.js';
import { ComparisonOutputSchema } from '../utils/schema-validator.js';

export interface CompareToolInput {
  question: string;
  options: string[];
  criteria?: string[];
  context?: string;
  sessionId?: string;
}

export async function compareTool(input: CompareToolInput) {
  const executor = new CodexExecutor();

  const prompt = buildComparisonPrompt(input);

  const result = await executor.execute(prompt, {
    model: 'gpt-5',
    fullAuto: true,
    json: true,
    sessionId: input.sessionId,
  });

  if (!result.success) {
    throw new Error(`Codex comparison failed: ${result.error}`);
  }

  return {
    comparison: result.output,
    executionTime: result.executionTime,
    sessionId: result.sessionId,
  };
}

function buildComparisonPrompt(input: CompareToolInput): string {
  let prompt = `Comparison Analysis: ${input.question}\n\n`;

  prompt += `Options to Compare:\n${input.options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\n`;

  if (input.criteria && input.criteria.length > 0) {
    prompt += `Evaluation Criteria:\n${input.criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n`;
  }

  if (input.context) {
    prompt += `Context:\n${input.context}\n\n`;
  }

  prompt += `Provide a comprehensive comparison including:

1. **Options**: For each option, provide:
   - Name and description
   - Pros (advantages)
   - Cons (disadvantages)
   - Best use case
   - Overall score (0-10)
2. **Criteria**: For each evaluation criterion:
   - Criterion name
   - Weight (high/medium/low importance)
   - Scores for each option
3. **Recommendation**: Which option is recommended
4. **Rationale**: Detailed reasoning for the recommendation

Be objective, consider trade-offs, and provide clear guidance.`;

  return prompt;
}
