import { CodexExecutor } from '../utils/codex-executor.js';
import { SpecificationOutputSchema } from '../utils/schema-validator.js';

export interface SpecToolInput {
  title: string;
  description: string;
  requirements?: string[];
  sessionId?: string;
}

export async function specTool(input: SpecToolInput) {
  const executor = new CodexExecutor();

  const prompt = buildSpecificationPrompt(input);

  const result = await executor.execute(prompt, {
    model: 'gpt-5',
    fullAuto: true,
    json: true,
    sessionId: input.sessionId,
  });

  if (!result.success) {
    throw new Error(`Codex specification failed: ${result.error}`);
  }

  return {
    specification: result.output,
    executionTime: result.executionTime,
    sessionId: result.sessionId,
  };
}

function buildSpecificationPrompt(input: SpecToolInput): string {
  let prompt = `Create Technical Specification: ${input.title}\n\n`;
  prompt += `Description: ${input.description}\n\n`;

  if (input.requirements && input.requirements.length > 0) {
    prompt += `Requirements:\n${input.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;
  }

  prompt += `Generate a comprehensive technical specification including:

1. **Overview**: High-level description of the system/feature
2. **Requirements**:
   - Functional requirements (what it must do)
   - Non-functional requirements (performance, security, scalability)
3. **Architecture**:
   - Components with descriptions and responsibilities
   - Data flow between components
   - External integrations
4. **API Design** (if applicable):
   - Endpoints with methods, paths, descriptions
   - Request/response schemas
5. **Implementation**:
   - Implementation phases
   - Required technologies
   - Estimated effort

Make it detailed, technically sound, and ready for implementation.`;

  return prompt;
}
