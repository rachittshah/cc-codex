import { z } from 'zod';

// Plan output schema
export const PlanOutputSchema = z.object({
  task: z.string().describe('The task being planned'),
  overview: z.string().describe('High-level overview of the plan'),
  phases: z.array(
    z.object({
      phase: z.string().describe('Phase name'),
      description: z.string().describe('Phase description'),
      steps: z.array(
        z.object({
          step: z.string().describe('Step description'),
          duration: z.string().optional().describe('Estimated duration'),
          dependencies: z.array(z.string()).optional().describe('Dependencies'),
          risks: z.array(z.string()).optional().describe('Potential risks'),
        })
      ),
    })
  ),
  technologies: z.array(z.string()).optional().describe('Required technologies'),
  timeline: z.string().optional().describe('Overall timeline estimate'),
  risks: z.array(z.string()).optional().describe('Overall risks'),
  nextSteps: z.array(z.string()).describe('Immediate next steps'),
});

// Reasoning output schema
export const ReasoningOutputSchema = z.object({
  question: z.string().describe('The question or problem being reasoned about'),
  analysis: z.string().describe('Detailed analysis'),
  considerations: z.array(
    z.object({
      factor: z.string().describe('Factor name'),
      description: z.string().describe('Factor description'),
      impact: z.enum(['high', 'medium', 'low']).describe('Impact level'),
    })
  ),
  approaches: z.array(
    z.object({
      approach: z.string().describe('Approach name'),
      pros: z.array(z.string()).describe('Advantages'),
      cons: z.array(z.string()).describe('Disadvantages'),
      complexity: z.enum(['low', 'medium', 'high']).describe('Implementation complexity'),
      recommendation: z.string().optional().describe('Recommendation notes'),
    })
  ),
  recommendation: z.string().describe('Final recommendation'),
  rationale: z.string().describe('Reasoning behind the recommendation'),
});

// Specification output schema
export const SpecificationOutputSchema = z.object({
  title: z.string().describe('Specification title'),
  overview: z.string().describe('High-level overview'),
  requirements: z.object({
    functional: z.array(z.string()).describe('Functional requirements'),
    nonFunctional: z.array(z.string()).describe('Non-functional requirements'),
  }),
  architecture: z.object({
    components: z.array(
      z.object({
        name: z.string().describe('Component name'),
        description: z.string().describe('Component description'),
        responsibilities: z.array(z.string()).describe('Responsibilities'),
      })
    ),
    dataFlow: z.string().optional().describe('Data flow description'),
    integrations: z.array(z.string()).optional().describe('External integrations'),
  }),
  api: z
    .object({
      endpoints: z.array(
        z.object({
          method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
          path: z.string(),
          description: z.string(),
          requestSchema: z.any().optional(),
          responseSchema: z.any().optional(),
        })
      ),
    })
    .optional(),
  implementation: z.object({
    phases: z.array(z.string()).describe('Implementation phases'),
    technologies: z.array(z.string()).describe('Required technologies'),
    estimatedEffort: z.string().optional().describe('Estimated effort'),
  }),
});

// Analysis output schema
export const AnalysisOutputSchema = z.object({
  target: z.string().describe('What was analyzed'),
  summary: z.string().describe('Analysis summary'),
  findings: z.array(
    z.object({
      category: z.string().describe('Finding category'),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
      description: z.string().describe('Finding description'),
      location: z.string().optional().describe('File/location'),
      recommendation: z.string().optional().describe('Recommended fix'),
    })
  ),
  metrics: z
    .object({
      linesOfCode: z.number().optional(),
      complexity: z.string().optional(),
      coverage: z.string().optional(),
      performance: z.string().optional(),
    })
    .optional(),
  recommendations: z.array(z.string()).describe('Overall recommendations'),
});

// Comparison output schema
export const ComparisonOutputSchema = z.object({
  question: z.string().describe('What is being compared'),
  options: z.array(
    z.object({
      name: z.string().describe('Option name'),
      description: z.string().describe('Option description'),
      pros: z.array(z.string()).describe('Advantages'),
      cons: z.array(z.string()).describe('Disadvantages'),
      useCase: z.string().describe('Best use case'),
      score: z.number().min(0).max(10).optional().describe('Overall score'),
    })
  ),
  criteria: z.array(
    z.object({
      criterion: z.string().describe('Evaluation criterion'),
      weight: z.enum(['high', 'medium', 'low']).describe('Importance weight'),
      scores: z.record(z.number()).describe('Scores per option'),
    })
  ),
  recommendation: z.string().describe('Recommended option'),
  rationale: z.string().describe('Reasoning for recommendation'),
});

// Handoff schema - for passing tasks between Claude and Codex
export const HandoffSchema = z.object({
  taskId: z.string().describe('Unique task identifier'),
  from: z.enum(['claude', 'codex']).describe('Who is handing off'),
  to: z.enum(['claude', 'codex']).describe('Who is receiving'),
  taskType: z
    .enum(['implementation', 'reasoning', 'planning', 'specification', 'analysis'])
    .describe('Type of task'),
  description: z.string().describe('Task description'),
  context: z.any().optional().describe('Additional context'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  deadline: z.string().optional().describe('Deadline if applicable'),
  dependencies: z.array(z.string()).optional().describe('Task dependencies'),
  sessionId: z.string().optional().describe('Session ID for context sharing'),
});

export type PlanOutput = z.infer<typeof PlanOutputSchema>;
export type ReasoningOutput = z.infer<typeof ReasoningOutputSchema>;
export type SpecificationOutput = z.infer<typeof SpecificationOutputSchema>;
export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;
export type ComparisonOutput = z.infer<typeof ComparisonOutputSchema>;
export type Handoff = z.infer<typeof HandoffSchema>;

export function validateSchema<T>(schema: z.ZodSchema<T>, data: any): T {
  return schema.parse(data);
}

export function isValidSchema<T>(schema: z.ZodSchema<T>, data: any): boolean {
  try {
    schema.parse(data);
    return true;
  } catch {
    return false;
  }
}
