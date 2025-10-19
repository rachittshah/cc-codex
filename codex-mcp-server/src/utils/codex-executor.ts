import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface CodexExecutionOptions {
  model?: string;
  fullAuto?: boolean;
  sandbox?: 'read-only' | 'workspace-write' | 'danger-full-access';
  json?: boolean;
  outputFile?: string;
  workingDirectory?: string;
  sessionId?: string;
}

export interface CodexExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  sessionId?: string;
}

export class CodexExecutor {
  private defaultModel = 'gpt-5';
  private sharedContextDir = path.join(process.cwd(), 'shared-context');

  async execute(
    prompt: string,
    options: CodexExecutionOptions = {}
  ): Promise<CodexExecutionResult> {
    const startTime = Date.now();

    try {
      // Build codex command
      const command = this.buildCommand(prompt, options);

      // Store session context before execution
      if (options.sessionId) {
        await this.storeSessionContext(options.sessionId, {
          prompt,
          timestamp: new Date().toISOString(),
          options,
        });
      }

      // Execute codex (uses authenticated CLI session, no API key needed)
      const { stdout, stderr } = await execAsync(command, {
        cwd: options.workingDirectory || process.cwd(),
        env: {
          ...process.env,
          // No API key needed - codex CLI uses ChatGPT account authentication
        },
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });

      const executionTime = Date.now() - startTime;

      // Parse output if JSON mode
      let output = stdout;
      if (options.json && stdout.trim()) {
        try {
          // Codex outputs JSONL, parse last line
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const parsed = JSON.parse(lastLine);
          output = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // If parsing fails, return raw output
          console.error('Failed to parse JSON output:', e);
        }
      }

      // Store result in shared context
      if (options.sessionId) {
        await this.storeSessionResult(options.sessionId, {
          output,
          success: true,
          executionTime,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        success: true,
        output,
        error: stderr || undefined,
        executionTime,
        sessionId: options.sessionId,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Store error in shared context
      if (options.sessionId) {
        await this.storeSessionResult(options.sessionId, {
          output: '',
          success: false,
          error: errorMessage,
          executionTime,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        success: false,
        output: '',
        error: errorMessage,
        executionTime,
        sessionId: options.sessionId,
      };
    }
  }

  private buildCommand(prompt: string, options: CodexExecutionOptions): string {
    const parts: string[] = ['codex', 'exec'];

    // Model (default to gpt-5)
    const model = options.model || this.defaultModel;
    parts.push('-m', model);

    // Full auto mode
    if (options.fullAuto !== false) {
      parts.push('--full-auto');
    }

    // Sandbox mode
    if (options.sandbox) {
      parts.push('--sandbox', options.sandbox);
    }

    // JSON output
    if (options.json) {
      parts.push('--json');
    }

    // Output file
    if (options.outputFile) {
      parts.push('-o', options.outputFile);
    }

    // Prompt (properly escaped)
    parts.push(JSON.stringify(prompt));

    return parts.join(' ');
  }

  private async storeSessionContext(
    sessionId: string,
    context: any
  ): Promise<void> {
    try {
      await fs.mkdir(this.sharedContextDir, { recursive: true });
      const contextFile = path.join(
        this.sharedContextDir,
        `session-${sessionId}-context.json`
      );

      // Read existing context or create new
      let existingContext: any = {};
      try {
        const existing = await fs.readFile(contextFile, 'utf-8');
        existingContext = JSON.parse(existing);
      } catch {
        // File doesn't exist, that's okay
      }

      // Merge contexts
      const updatedContext = {
        ...existingContext,
        lastUpdate: new Date().toISOString(),
        requests: [...(existingContext.requests || []), context],
      };

      await fs.writeFile(
        contextFile,
        JSON.stringify(updatedContext, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to store session context:', error);
    }
  }

  private async storeSessionResult(
    sessionId: string,
    result: any
  ): Promise<void> {
    try {
      await fs.mkdir(this.sharedContextDir, { recursive: true });
      const resultFile = path.join(
        this.sharedContextDir,
        `session-${sessionId}-results.json`
      );

      // Read existing results or create new
      let existingResults: any = {};
      try {
        const existing = await fs.readFile(resultFile, 'utf-8');
        existingResults = JSON.parse(existing);
      } catch {
        // File doesn't exist, that's okay
      }

      // Merge results
      const updatedResults = {
        ...existingResults,
        lastUpdate: new Date().toISOString(),
        results: [...(existingResults.results || []), result],
      };

      await fs.writeFile(
        resultFile,
        JSON.stringify(updatedResults, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Failed to store session result:', error);
    }
  }

  async getSessionContext(sessionId: string): Promise<any> {
    try {
      const contextFile = path.join(
        this.sharedContextDir,
        `session-${sessionId}-context.json`
      );
      const data = await fs.readFile(contextFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async getSessionResults(sessionId: string): Promise<any> {
    try {
      const resultFile = path.join(
        this.sharedContextDir,
        `session-${sessionId}-results.json`
      );
      const data = await fs.readFile(resultFile, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
