---
name: AI Curated Riddle Request
about: Automated riddle request from the PWA UI - triggers the Riddle Finder Agent
title: "🤖 AI Curated Riddle Request"
labels: agent-task, riddle-request
assignees: ""

---

## Riddle Request via PWA

A user has requested a new AI-curated riddle through the PWA interface.

### Task for GitHub Copilot

@github-copilot please trigger the **Riddle Finder Agent** workflow to find and submit a new high-quality riddle.

**Steps to complete:**
1. Run the riddle-finder agent workflow (`.github/workflows/riddle-finder-agent.yml`)
2. The agent should:
   - Find a challenging, high-quality riddle
   - Validate it against the riddle template schema
   - Create a new riddle file in `system/riddles/`
   - Update `system/riddles/riddles.js` with the new riddle
   - Open a Pull Request with the changes

**Expected Result:**
- A new PR opened with a well-formatted riddle
- The riddle should follow the template structure defined in `system/riddles/riddle.template.js`
- All validation checks should pass
- PR should be ready for auto-merge after review

**Reference Files:**
- Agent Instructions: `.github/agents/riddle-finder.md`
- Workflow File: `.github/workflows/riddle-finder-agent.yml`
- Riddle Template: `system/riddles/riddle.template.js`

---
*This issue was automatically created by a user clicking "AI Curated" in the PWA interface.*
