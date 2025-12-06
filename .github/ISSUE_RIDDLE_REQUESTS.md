# Issue-Based Riddle Request System

This document explains how the automated riddle request system works when triggered by GitHub issues.

## Overview

The Issue Riddle Request Handler workflow automatically:
1. Watches for new issues being opened or labeled
2. Detects if the issue is a request for a new riddle/poem
3. Assigns GitHub Copilot to handle the request
4. Triggers the Riddle Finder Agent workflow
5. Automatically creates and merges a new riddle PR

## How It Works

### 1. Issue Detection

The workflow triggers when:
- A new issue is opened, **AND**
- The issue has any of these characteristics:
  - Contains 'Riddle' or 'riddle' in the title
  - Contains 'Poem' or 'poem' in the title
  - Has the 'enhancement' label
  - Has the 'documentation' label

### 2. Copilot Assignment

When a riddle request is detected:
- GitHub Copilot is automatically assigned to the issue
- A comment is automatically added to the issue confirming the request
- The workflow provides status updates as comments

### 3. Riddle Finder Activation

The workflow automatically triggers the Riddle Finder Agent with:
- **Source Type**: `mixed` (includes all riddle categories)
- **Difficulty**: `hard` (challenging riddles)

### 4. Automated Workflow

The complete flow:
```
Issue Created → Detected → Commented → Riddle Finder Triggered → 
Riddle Created → PR Opened → Auto-Merged → Issue Updated
```

## Using the System

### For Users

**Creating a Riddle Request:**

1. Go to the [Issues](https://github.com/statikfintechllc/The_GateKeepers_Riddle.Interactive/issues) tab
2. Click "New Issue"
3. Use the "Riddle_Request" template (or create a custom issue)
4. Include "Riddle" or "Poem" in the title, **OR**
5. Add the `enhancement` or `documentation` label
6. Submit the issue

**What Happens Next:**

1. Within seconds, you'll see a comment confirming your request
2. The Riddle Finder Agent begins processing
3. A second comment provides a link to track the workflow in Actions
4. When complete, a PR is automatically created and merged
5. The new riddle is immediately available in the game!

### Issue Template

The repository includes a dedicated issue template at:
`.github/ISSUE_TEMPLATE/riddle_request.md`

This template is pre-configured with:
- Title: "New Riddle Requested"
- Labels: `documentation`, `enhancement`
- Assignees: `Copilot`

## Workflow Configuration

### Location
`.github/workflows/issue-riddle-request.yml`

### Trigger Events
```yaml
on:
  issues:
    types: [opened, labeled]
```

### Permissions Required
```yaml
permissions:
  contents: write
  issues: write
  pull-requests: write
```

### Conditional Execution

The workflow only runs when:
```yaml
if: |
  (contains(github.event.issue.labels.*.name, 'enhancement') || 
   contains(github.event.issue.labels.*.name, 'documentation') ||
   contains(github.event.issue.title, 'Riddle') ||
   contains(github.event.issue.title, 'riddle') ||
   contains(github.event.issue.title, 'poem') ||
   contains(github.event.issue.title, 'Poem'))
```

## Auto-Merge Feature

The Riddle Finder Agent workflow has been enhanced with auto-merge capability:

### How It Works

1. After creating the riddle PR, the workflow attempts to merge it automatically
2. Uses the `squash` merge method for clean history
3. Adds a confirmation comment to the PR
4. Includes error handling if auto-merge fails

### When Auto-Merge Fails

If auto-merge cannot be completed:
- The PR remains open for manual review
- A comment explains why auto-merge failed
- The riddle still needs manual approval and merging

### Requirements for Auto-Merge

- Repository must allow auto-merge
- No merge conflicts
- All required checks must pass
- Branch protection rules are satisfied

## Customization

### Changing Detection Keywords

Edit the workflow condition in `.github/workflows/issue-riddle-request.yml`:

```yaml
if: |
  (contains(github.event.issue.title, 'YourKeyword') ||
   contains(github.event.issue.title, 'AnotherKeyword'))
```

### Adjusting Riddle Parameters

Modify the workflow dispatch inputs:

```yaml
inputs: {
  source_type: 'philosophical',  # or 'logic', 'wordplay', 'technical', 'mixed'
  difficulty: 'expert'           # or 'medium', 'hard'
}
```

### Custom Comments

Edit the comment messages in the workflow steps to match your project's tone.

## Monitoring

### Viewing Workflow Runs

1. Go to the [Actions](https://github.com/statikfintechllc/The_GateKeepers_Riddle.Interactive/actions) tab
2. Select "Issue Riddle Request Handler" from the workflows list
3. View recent runs and their status

### Debugging

If the workflow doesn't trigger:
- Check if the issue title/labels match the detection criteria
- Verify the workflow file is on the default branch
- Check workflow permissions in repository settings
- Review the Actions logs for errors

## Integration with Other Workflows

This workflow integrates seamlessly with:

- **Riddle Finder Agent** (`riddle-finder-agent.yml`)
  - Triggered automatically by the Issue Riddle Request Handler
  - Creates and processes new riddles
  - Handles file creation and PR submission
  
- **Repository Mapper Agent** (`repo-mapper-agent.yml`)
  - Updates repository documentation when new files are added
  - Tracks the new riddle in the repository map

## Security Considerations

### Permissions

The workflow requires write permissions to:
- Create comments on issues
- Trigger other workflows
- Create and merge pull requests

### Token Usage

Uses `${{ secrets.GITHUB_TOKEN }}` which is automatically provided by GitHub Actions with appropriate scoped permissions.

### Rate Limiting

GitHub API has rate limits:
- Be mindful when creating many issues rapidly
- The workflow includes built-in delays to avoid hitting limits

## Troubleshooting

### Issue: Workflow Doesn't Trigger

**Solutions:**
- Ensure the issue title contains 'Riddle' or 'Poem'
- Add 'enhancement' or 'documentation' labels
- Check that the workflow file exists on the default branch

### Issue: Riddle Not Created

**Possible Causes:**
- Riddle Finder Agent may have found a duplicate
- Network issues when searching for riddles
- Validation errors in riddle content

**Check:**
- View the Riddle Finder Agent logs in Actions tab
- Look for error messages in issue comments

### Issue: Auto-Merge Failed

**Common Reasons:**
- Branch protection rules require reviews
- Repository doesn't allow auto-merge
- Merge conflicts detected
- Required status checks not passing

**Resolution:**
- Manually review and merge the PR
- Adjust repository settings if needed

## Future Enhancements

Potential improvements:
- Support for custom riddle parameters in issue body
- AI-powered riddle generation based on issue description
- Multi-riddle batch processing
- Integration with external riddle databases
- User voting on generated riddles before merge

## Examples

### Example Issue Title
```
New Riddle Requested: Technology Theme
```

### Example Issue with Keywords
```
Title: Please add a poem about artificial intelligence
```

### Example with Labels
```
Title: Enhancement request
Labels: enhancement
```

## Support

For issues or questions:
- Open an issue with the tag `help wanted`
- Check existing issues for similar problems
- Review workflow logs in the Actions tab
- Contact the repository maintainers

## Related Documentation

- [Automated Riddles](AUTOMATED_RIDDLES.md) - Daily automated riddle submission
- [Riddle Finder Agent](.github/agents/riddle-finder.agent.md) - Agent instructions
- [Repository README](../README.md) - Main project documentation

---

*This system is powered by GitHub Actions and the Riddle Finder Agent*
