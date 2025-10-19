#!/usr/bin/env python3
"""
Complexity Detection Hook for Claude Code

Analyzes user prompts to detect complexity and determine if delegation to Codex is recommended.
"""

import json
import re
import sys
from typing import Dict, List, Tuple

# Keywords that indicate complex reasoning/planning tasks
COMPLEXITY_INDICATORS = {
    "architectural": ["architecture", "design", "structure", "pattern", "approach"],
    "planning": ["plan", "roadmap", "strategy", "phases", "timeline", "milestones"],
    "decision": ["should we", "which is better", "compare", "versus", "vs", "choose", "decide"],
    "analysis": ["analyze", "evaluate", "assess", "review", "examine", "investigate"],
    "specification": ["spec", "specification", "requirements", "detailed design"],
    "multi_step": ["step 1", "step 2", "first", "then", "next", "after that", "finally"],
    "trade_offs": ["pros and cons", "trade-off", "trade off", "advantages", "disadvantages"],
}

# Phrases that indicate simple implementation tasks (should NOT delegate)
SIMPLE_INDICATORS = [
    "fix the bug",
    "add a comment",
    "rename this",
    "update the import",
    "change the color",
    "fix typo",
    "add console.log",
    "remove this line",
]


class ComplexityDetector:
    def __init__(self):
        self.complexity_score = 0
        self.triggers: List[str] = []
        self.indicators_found: List[Tuple[str, str]] = []

    def analyze(self, prompt: str) -> Dict:
        """Analyze prompt and return complexity assessment."""
        prompt_lower = prompt.lower()

        # Check for simple indicators first
        if any(indicator in prompt_lower for indicator in SIMPLE_INDICATORS):
            return {
                "should_delegate": False,
                "confidence": "high",
                "reason": "Simple implementation task detected",
                "complexity_score": 0,
            }

        # Check for complexity indicators
        for category, keywords in COMPLEXITY_INDICATORS.items():
            for keyword in keywords:
                if keyword in prompt_lower:
                    self.complexity_score += 1
                    self.indicators_found.append((category, keyword))
                    self.triggers.append(keyword)

        # Check for question marks (often indicate need for reasoning)
        question_count = prompt.count("?")
        if question_count > 0:
            self.complexity_score += question_count
            self.triggers.append(f"{question_count} question(s)")

        # Check for multiple sentences (might indicate multi-step task)
        sentence_count = len(re.split(r'[.!?]+', prompt))
        if sentence_count > 3:
            self.complexity_score += 1
            self.triggers.append("multiple sentences")

        # Check for bullet points or numbered lists
        if re.search(r'(\n[-*•]|\n\d+\.)', prompt):
            self.complexity_score += 2
            self.triggers.append("structured list")

        # Determine if should delegate
        should_delegate = self.complexity_score >= 3
        confidence = self._get_confidence()

        return {
            "should_delegate": should_delegate,
            "confidence": confidence,
            "complexity_score": self.complexity_score,
            "triggers": self.triggers,
            "indicators_found": self.indicators_found,
            "reason": self._get_reason(),
        }

    def _get_confidence(self) -> str:
        """Determine confidence level based on complexity score."""
        if self.complexity_score >= 5:
            return "high"
        elif self.complexity_score >= 3:
            return "medium"
        else:
            return "low"

    def _get_reason(self) -> str:
        """Generate human-readable reason for delegation recommendation."""
        if self.complexity_score == 0:
            return "No complexity indicators detected"
        elif self.complexity_score < 3:
            return f"Low complexity ({self.complexity_score} indicators)"
        elif self.complexity_score < 5:
            return f"Moderate complexity ({self.complexity_score} indicators): {', '.join(self.triggers[:3])}"
        else:
            return f"High complexity ({self.complexity_score} indicators): {', '.join(self.triggers[:5])}"


def main():
    """Main entry point for the hook."""
    try:
        # Read input from stdin (tool invocation data)
        input_data = json.load(sys.stdin)

        # Extract the prompt/user message
        tool_input = input_data.get("tool_input", {})
        user_message = tool_input.get("message", "")

        if not user_message:
            # No message to analyze, let it pass through
            sys.exit(0)

        # Analyze complexity
        detector = ComplexityDetector()
        result = detector.analyze(user_message)

        # Output analysis result (for logging/debugging)
        print(json.dumps(result, indent=2), file=sys.stderr)

        # If should delegate, return exit code 1 to trigger confirmation
        # (doesn't block, just signals potential delegation)
        if result["should_delegate"]:
            print(
                f"💡 Complex task detected ({result['complexity_score']} indicators). "
                f"Consider delegating to Codex for planning/reasoning.",
                file=sys.stderr
            )
            # Exit code 0 - don't block, just inform
            sys.exit(0)
        else:
            # Simple task, proceed normally
            sys.exit(0)

    except Exception as e:
        # Don't block on errors
        print(f"Complexity detection error: {e}", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
