---
name: Riddle_Request
about: Used by the GitHub Pages UI to request AI-curated riddles via Copilot
title: AI Curated Riddle Request
labels: documentation, enhancement, copilot
assignees: ''

---

@copilot please use the riddle-finder agent to find and add a new high-quality riddle to the repository.

## Instructions for Copilot

1. **Activate the riddle-finder agent** located at `.github/agents/riddle-finder.agent.md`
2. **Search for a new challenging riddle** that:
   - Is intellectually challenging
   - Has clear, logical answers
   - Is appropriate for all ages
   - Fits thematically with existing riddles
   - Is NOT a duplicate of existing riddles
3. **Create a new riddle file** following the template format in `system/riddles/riddle.template.js`
4. **Add the riddle to the index** in `system/riddles/riddles.js`
5. **Create a Pull Request** with:
   - The new riddle file
   - Updated riddles index
   - Clear description of the riddle and its theme
6. **The PR will auto-merge** after all checks pass

## Quality Standards

The riddle-finder agent will ensure:
- High quality and originality
- Proper formatting and structure
- No duplicates
- Appropriate difficulty level
- Family-friendly content

This request was generated from the PWA interface.

