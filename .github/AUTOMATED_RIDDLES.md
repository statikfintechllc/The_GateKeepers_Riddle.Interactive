# Automated Riddle Submission System

This document explains how the automated riddle submission system works and how users and maintainers can request new riddles.

## Overview

The Riddle Finder Agent workflow automatically:
1. Runs every day at 2 AM UTC (configurable)
2. Can be triggered by user requests via GitHub Issues with @copilot
3. Searches and generates interesting, challenging riddles
4. Validates riddles against the template schema
5. Creates new riddle files following the established format
6. Updates the riddles registry
7. Opens a pull request with quality validation
8. **Auto-merges** if all quality checks pass

## User Riddle Requests

### From the PWA/Game Interface

Users can request AI-curated riddles directly from the game with a streamlined one-click process:

1. Click the **More Options** button (three dots)
2. Select **Request Riddle**
3. Click **AI Curated**
4. GitHub issue creation page opens with pre-filled template mentioning @copilot
5. Click **Submit new issue** (one click - no sign-in required for public repos)
6. **@copilot** and the Riddle Finder Agent automatically process the request
7. A new riddle PR is created with quality validation
8. PR is **auto-merged** if all checks pass
9. Use **Refresh App** to see the new riddle immediately

### Automated Pipeline

```
User clicks "AI Curated" 
  → GitHub opens with pre-filled issue for @copilot
  → User clicks "Submit new issue"
  → @copilot + Riddle Finder Agent process request
  → New riddle PR created with quality checks
  → Auto-merge if validation passes
  → Riddle available in game
```

### GitHub Issue Trigger

The workflow is triggered when:
- An issue is opened with the label `ai-riddle-request` or `copilot`
- An existing issue is labeled with `ai-riddle-request`
- Issue mentions @copilot with riddle request

The issue will be automatically closed with a success comment once processed.

## Auto-Merge Feature

PRs are automatically merged if:
- ✅ Schema validation passes
- ✅ Required fields present
- ✅ No duplicate riddles detected
- ✅ High-quality content verified

If auto-merge fails, the PR will require manual review.

## Workflow Configuration

### Location
`.github/workflows/riddle-finder-agent.yml`

### Trigger Methods
1. **Schedule**: Runs daily at 2 AM UTC
2. **Manual**: Via the Actions tab (workflow_dispatch)
3. **Issue-based**: When issues with `ai-riddle-request` label are created
4. **Workflow Call**: Can be called by other workflows

### Permissions Required
- `contents: write` - To create commits
- `pull-requests: write` - To create PRs
- `issues: write` - To comment on and close issues

## How It Works

### 1. Riddle Discovery
The workflow searches predefined sources for riddles:
- Classic riddle collections
- Educational riddle websites  
- Community-submitted riddles

### 2. Riddle Processing
For each discovered riddle:
- Extracts the riddle text and answer
- Generates appropriate hints (progressive difficulty)
- Creates close answer variations
- Generates custom feedback messages
- Validates against the riddle template schema

### 3. Duplicate Detection
Before submitting:
- Checks if a riddle with the same ID already exists
- Skips if duplicate found
- Generates unique ID from riddle title

### 4. File Creation
Creates a new riddle file in `system/riddles/`:
- Follows naming convention: `{riddle-id}.riddle.js`
- Includes all required fields from template
- Adds metadata (source, date)

### 5. Registry Update
Automatically updates `system/riddles/riddles.js`:
- Adds import statement for new riddle
- Appends to riddles array
- Maintains proper formatting

### 6. Pull Request
Opens a PR with:
- Descriptive title: "🧩 New Riddle: {Title}"
- Detailed body with riddle info
- Review checklist
- Appropriate labels
- Auto-assigns reviewers

## Customization

### Adding Riddle Sources

Edit the workflow file and add to the `riddleSources` array:
```javascript
const riddleSources = [
  'https://your-riddle-source.com/riddles',
  'https://another-source.com/hard-riddles',
  // ... more sources
];
```

### Changing Schedule

Modify the cron expression:
```yaml
schedule:
  # Run every 12 hours
  - cron: '0 */12 * * *'
  
  # Run weekly on Monday
  - cron: '0 2 * * 1'
  
  # Run twice daily (2 AM and 2 PM UTC)
  - cron: '0 2,14 * * *'
```

### Quality Filters

The workflow includes quality checks:
- Minimum riddle length
- Required field validation
- Answer plausibility check
- Hint progression validation

## Manual Triggering

You can manually trigger the workflow:
1. Go to Actions tab in GitHub
2. Select "Daily Riddle Submission"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Reviewing Submissions

When a new riddle PR is created:

### Review Checklist
- [ ] **Riddle Quality**: Is it interesting and well-written?
- [ ] **Answers**: Are correct answers comprehensive?
- [ ] **Close Answers**: Do they make sense?
- [ ] **Hints**: Do they progress logically from vague to specific?
- [ ] **Feedback**: Are messages helpful and encouraging?
- [ ] **Explanation**: Does it make sense?
- [ ] **Uniqueness**: Not a duplicate of existing riddles?
- [ ] **Appropriate**: Family-friendly content?

### Actions
- ✅ **Approve**: Merge the PR to add the riddle
- ✏️ **Edit**: Make changes in the PR before merging
- ❌ **Close**: Reject if not suitable

## Troubleshooting

### Workflow Fails
Check the Actions logs for:
- Network errors (source unreachable)
- Parsing errors (HTML structure changed)
- Validation errors (missing required fields)

### No PRs Created
Possible reasons:
- All discovered riddles already exist
- Sources have no new content
- Quality filters rejected candidates

### Duplicate Riddles
The workflow checks for duplicates by ID:
- IDs are generated from titles
- Similar titles will have different IDs
- Manual review catches semantic duplicates

## Security Considerations

### API Keys
If using AI services for riddle generation:
1. Add API key to repository secrets
2. Reference as: `${{ secrets.YOUR_API_KEY }}`
3. Never commit keys to repository

### Source Validation
- Only scrape from approved sources
- Respect robots.txt
- Add rate limiting if needed
- Check for adult/inappropriate content

## Future Enhancements

Potential improvements:
- AI-powered riddle generation
- Quality scoring system
- Difficulty rating
- Category classification
- User voting integration
- Riddle popularity tracking

## Dependencies

The workflow uses:
- Node.js 20
- GitHub Actions official actions
- `peter-evans/create-pull-request@v6` for PR creation

## Support

For issues or questions:
- Open an issue on GitHub
- Check workflow logs in Actions tab
- Review PR comments for feedback
