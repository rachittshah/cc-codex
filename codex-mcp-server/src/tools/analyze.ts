import { CodexExecutor } from '../utils/codex-executor.js';
import { AnalysisOutputSchema } from '../utils/schema-validator.js';

export interface AnalyzeToolInput {
  target: string;
  focusAreas?: string[];
  depth?: 'quick' | 'standard' | 'deep';
  sessionId?: string;
}

export async function analyzeTool(input: AnalyzeToolInput) {
  const executor = new CodexExecutor();

  const prompt = buildAnalysisPrompt(input);

  const result = await executor.execute(prompt, {
    model: 'gpt-5',
    fullAuto: true,
    sandbox: 'read-only',
    json: true,
    sessionId: input.sessionId,
  });

  if (!result.success) {
    throw new Error(`Codex analysis failed: ${result.error}`);
  }

  return {
    analysis: result.output,
    executionTime: result.executionTime,
    sessionId: result.sessionId,
  };
}

function buildAnalysisPrompt(input: AnalyzeToolInput): string {
  let prompt = `Code Analysis Task: ${input.target}\n\n`;

  const depth = input.depth || 'standard';
  const depthDescriptions = {
    quick: 'quick scan for major issues',
    standard: 'thorough analysis of common issues',
    deep: 'comprehensive deep-dive analysis',
  };

  prompt += `Analysis Depth: ${depthDescriptions[depth]}\n\n`;

  if (input.focusAreas && input.focusAreas.length > 0) {
    prompt += `Focus Areas:\n${input.focusAreas.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n`;
  }

  prompt += `Perform a ${depth} analysis and provide:

1. **Summary**: Overview of the analysis
2. **Findings**: Categorized findings with:
   - Category (e.g., security, performance, maintainability)
   - Severity (critical/high/medium/low/info)
   - Description
   - Location (file/line if applicable)
   - Recommendation for fixing
3. **Metrics** (if applicable):
   - Lines of code
   - Complexity indicators
   - Test coverage
   - Performance characteristics
4. **Recommendations**: Prioritized list of improvements

Focus on actionable insights and concrete recommendations.`;

  return prompt;
}
