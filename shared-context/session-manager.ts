import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface SessionContext {
  sessionId: string;
  createdAt: string;
  lastUpdated: string;
  source: 'claude' | 'codex';
  taskType?: string;
  currentGoal?: string;
  decisions: Decision[];
  artifacts: Artifact[];
  history: HistoryEntry[];
}

export interface Decision {
  id: string;
  timestamp: string;
  description: string;
  rationale: string;
  madeBy: 'claude' | 'codex' | 'user';
  impact: 'high' | 'medium' | 'low';
}

export interface Artifact {
  id: string;
  type: 'plan' | 'specification' | 'analysis' | 'reasoning' | 'code' | 'other';
  timestamp: string;
  createdBy: 'claude' | 'codex';
  content: any;
  metadata?: Record<string, any>;
}

export interface HistoryEntry {
  timestamp: string;
  actor: 'claude' | 'codex' | 'user';
  action: string;
  details?: any;
}

export class SessionManager {
  private contextDir: string;

  constructor(contextDir?: string) {
    this.contextDir = contextDir || path.join(process.cwd(), 'shared-context');
  }

  async createSession(source: 'claude' | 'codex'): Promise<string> {
    const sessionId = randomUUID();
    const session: SessionContext = {
      sessionId,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      source,
      decisions: [],
      artifacts: [],
      history: [
        {
          timestamp: new Date().toISOString(),
          actor: source,
          action: 'session_created',
        },
      ],
    };

    await this.saveSession(session);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<SessionContext | null> {
    try {
      const sessionPath = this.getSessionPath(sessionId);
      const data = await fs.readFile(sessionPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  async updateSession(
    sessionId: string,
    updates: Partial<SessionContext>
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const updatedSession: SessionContext = {
      ...session,
      ...updates,
      sessionId, // Ensure sessionId doesn't change
      lastUpdated: new Date().toISOString(),
    };

    await this.saveSession(updatedSession);
  }

  async addDecision(
    sessionId: string,
    decision: Omit<Decision, 'id' | 'timestamp'>
  ): Promise<string> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const decisionId = randomUUID();
    const fullDecision: Decision = {
      ...decision,
      id: decisionId,
      timestamp: new Date().toISOString(),
    };

    session.decisions.push(fullDecision);
    session.history.push({
      timestamp: new Date().toISOString(),
      actor: decision.madeBy,
      action: 'decision_added',
      details: { decisionId, description: decision.description },
    });

    await this.saveSession(session);
    return decisionId;
  }

  async addArtifact(
    sessionId: string,
    artifact: Omit<Artifact, 'id' | 'timestamp'>
  ): Promise<string> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const artifactId = randomUUID();
    const fullArtifact: Artifact = {
      ...artifact,
      id: artifactId,
      timestamp: new Date().toISOString(),
    };

    session.artifacts.push(fullArtifact);
    session.history.push({
      timestamp: new Date().toISOString(),
      actor: artifact.createdBy,
      action: 'artifact_added',
      details: { artifactId, type: artifact.type },
    });

    await this.saveSession(session);
    return artifactId;
  }

  async addHistoryEntry(
    sessionId: string,
    entry: Omit<HistoryEntry, 'timestamp'>
  ): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    session.history.push({
      ...entry,
      timestamp: new Date().toISOString(),
    });

    await this.saveSession(session);
  }

  async getArtifactsByType(
    sessionId: string,
    type: Artifact['type']
  ): Promise<Artifact[]> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return [];
    }

    return session.artifacts.filter((a) => a.type === type);
  }

  async getDecisionsByImpact(
    sessionId: string,
    impact: Decision['impact']
  ): Promise<Decision[]> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return [];
    }

    return session.decisions.filter((d) => d.impact === impact);
  }

  async listActiveSessions(): Promise<string[]> {
    try {
      await fs.mkdir(this.contextDir, { recursive: true });
      const files = await fs.readdir(this.contextDir);
      return files
        .filter((f) => f.startsWith('session-') && f.endsWith('.json'))
        .map((f) => f.replace('session-', '').replace('.json', ''));
    } catch {
      return [];
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessionPath = this.getSessionPath(sessionId);
    await fs.unlink(sessionPath);
  }

  async exportSession(sessionId: string, outputPath: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    await fs.writeFile(outputPath, JSON.stringify(session, null, 2), 'utf-8');
  }

  async importSession(inputPath: string): Promise<string> {
    const data = await fs.readFile(inputPath, 'utf-8');
    const session: SessionContext = JSON.parse(data);

    // Generate new session ID to avoid conflicts
    const newSessionId = randomUUID();
    session.sessionId = newSessionId;

    await this.saveSession(session);
    return newSessionId;
  }

  private async saveSession(session: SessionContext): Promise<void> {
    await fs.mkdir(this.contextDir, { recursive: true });
    const sessionPath = this.getSessionPath(session.sessionId);
    await fs.writeFile(sessionPath, JSON.stringify(session, null, 2), 'utf-8');
  }

  private getSessionPath(sessionId: string): string {
    return path.join(this.contextDir, `session-${sessionId}.json`);
  }
}

// Singleton instance
export const sessionManager = new SessionManager();
