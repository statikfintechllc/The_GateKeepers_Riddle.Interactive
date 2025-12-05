# Test Plan: Automated Riddle Retrieval System Fix

## Overview
This document outlines the test plan for verifying the fix to the automated riddle retrieval system.

## Test Environment
- **Repository**: statikfintechllc/The_GateKeepers_Riddle.Interactive
- **Branch**: copilot/fix-automated-riddle-retrieval
- **Workflow File**: `.github/workflows/issue-riddle-request.yml`
- **Called Workflow**: `.github/workflows/riddle-finder-agent.yml`

## Pre-Test Verification

### 1. YAML Syntax Validation
- [x] Validate issue-riddle-request.yml syntax
- [x] Validate riddle-finder-agent.yml syntax
- [x] Confirm no parsing errors

### 2. Code Security Scan
- [x] Run CodeQL security analysis
- [x] Confirm 0 security alerts
- [x] Verify no vulnerabilities introduced

### 3. Workflow Structure Review
- [x] Confirm workflow_call is properly configured
- [x] Verify permissions are correctly set
- [x] Ensure outputs are properly mapped

## Test Scenarios

### Scenario 1: Happy Path - New Riddle Request
**Objective**: Verify complete end-to-end flow when a valid riddle request is made

**Steps**:
1. Create new issue with title: "New Riddle Requested"
2. Add labels: "enhancement", "documentation"
3. Submit issue

**Expected Results**:
- [ ] Issue is created successfully
- [ ] `issue-riddle-request.yml` workflow triggers automatically
- [ ] `acknowledge-request` job runs and adds comment to issue
- [ ] Comment contains: "🤖 **Riddle Request Detected!**"
- [ ] `call-riddle-finder` job triggers `riddle-finder-agent.yml`
- [ ] Riddle Finder Agent executes and creates a new riddle (if not duplicate)
- [ ] New riddle file created in `system/riddles/`
- [ ] `riddles.js` is updated with new import
- [ ] Pull request is created with riddle changes
- [ ] Auto-merge attempts to merge the PR
- [ ] `update-issue` job runs and adds final comment
- [ ] Final comment shows riddle title and PR number
- [ ] Issue is automatically closed

**Timeline**: Should complete in 2-5 minutes

### Scenario 2: Duplicate Riddle
**Objective**: Verify behavior when selected riddle already exists

**Steps**:
1. Note existing riddles in `system/riddles/`
2. Manually trigger workflow or wait for duplicate selection
3. Create new issue with title: "New Riddle Requested"

**Expected Results**:
- [ ] Issue is created successfully
- [ ] Workflow triggers and acknowledges request
- [ ] Riddle Finder Agent runs but detects duplicate
- [ ] No new riddle file created
- [ ] No PR opened
- [ ] Update comment states: "ℹ️ **No New Riddle Created**"
- [ ] Issue remains open (not auto-closed)

### Scenario 3: Trigger with "riddle" keyword in title
**Objective**: Verify case-insensitive keyword detection

**Steps**:
1. Create issue with title: "Please add a new riddle about technology"
2. Don't add any labels

**Expected Results**:
- [ ] Workflow triggers due to "riddle" keyword in title
- [ ] Rest of flow proceeds normally

### Scenario 4: Trigger with "poem" keyword
**Objective**: Verify "poem" keyword also triggers workflow

**Steps**:
1. Create issue with title: "New poem requested"
2. Don't add any labels

**Expected Results**:
- [ ] Workflow triggers due to "poem" keyword
- [ ] Rest of flow proceeds normally

### Scenario 5: Trigger with label only
**Objective**: Verify label-based triggering

**Steps**:
1. Create issue with title: "Enhancement request"
2. Add label: "enhancement"

**Expected Results**:
- [ ] Workflow triggers due to label match
- [ ] Rest of flow proceeds normally

### Scenario 6: Non-matching issue
**Objective**: Verify workflow doesn't trigger for unrelated issues

**Steps**:
1. Create issue with title: "Bug report"
2. Add label: "bug"

**Expected Results**:
- [ ] Workflow does NOT trigger
- [ ] No comments added to issue
- [ ] No riddle creation attempted

### Scenario 7: Workflow Failure Handling
**Objective**: Verify error handling when riddle creation fails

**Prerequisites**: Simulate failure by temporarily breaking riddle-finder-agent.yml

**Steps**:
1. Create issue with valid trigger
2. Let workflow attempt to run

**Expected Results**:
- [ ] Acknowledge comment is still added
- [ ] `call-riddle-finder` job fails
- [ ] `update-issue` job still runs (due to `if: always()`)
- [ ] Error message comment is added: "⚠️ **Riddle Creation Failed**"
- [ ] Comment includes link to Actions tab
- [ ] Issue remains open

## Workflow Context Verification

### Context Availability Check
Verify that context variables are available in each job:

**Job: acknowledge-request**
- [x] `context.repo.owner` - Available
- [x] `context.repo.repo` - Available
- [x] `context.issue.number` - Available

**Job: call-riddle-finder**
- [x] Called workflow has own context
- [x] Inputs passed: source_type, difficulty
- [x] Outputs received: riddle_created, riddle_id, riddle_title, pr_number

**Job: update-issue**
- [x] `context.repo.owner` - Available
- [x] `context.repo.repo` - Available  
- [x] `context.issue.number` - Available
- [x] `needs.call-riddle-finder.outputs.*` - Available

## Performance Testing

### Timing Benchmarks
Measure execution time for each stage:

**Target Times**:
- Issue creation to first comment: < 30 seconds
- Riddle Finder Agent execution: 30-60 seconds
- PR creation: 15-30 seconds
- Auto-merge attempt: 5-15 seconds
- Final comment: < 15 seconds
- **Total**: 2-3 minutes

**Actual Times** (to be measured):
- Issue creation to first comment: ___ seconds
- Riddle Finder Agent execution: ___ seconds
- PR creation: ___ seconds
- Auto-merge attempt: ___ seconds
- Final comment: ___ seconds
- **Total**: ___ minutes

## Regression Testing

### Verify No Breaking Changes
Ensure existing functionality still works:

- [ ] Manual workflow_dispatch of riddle-finder-agent.yml still works
- [ ] Scheduled cron trigger (2 AM UTC) still works
- [ ] Existing riddles still load correctly
- [ ] Repository mapper agent integration unaffected

## Issue Template Testing

### Verify Issue Template
- [x] No invalid assignees (removed "Copilot")
- [x] Template has helpful description
- [x] Labels are correct: documentation, enhancement
- [x] Template renders properly in GitHub UI

## Post-Deployment Verification

After merging to main branch:

1. [ ] Create real test issue using the template
2. [ ] Monitor Actions tab for workflow execution
3. [ ] Verify comments are added to issue
4. [ ] Verify PR is created
5. [ ] Verify auto-merge completes (if enabled in repo settings)
6. [ ] Verify issue auto-closes
7. [ ] Verify new riddle appears in game

## Rollback Plan

If issues occur after deployment:

1. Revert PR merge
2. Restore previous version of workflows
3. Document what went wrong
4. Fix in new PR with additional tests

## Known Limitations

1. **Auto-merge requires repo settings**
   - Repository must allow auto-merge
   - Branch protection rules must be compatible
   - If auto-merge is disabled, PR will remain open for manual merge

2. **Random riddle selection**
   - May select duplicate riddles occasionally
   - This is expected behavior (handled gracefully)

3. **Rate limiting**
   - Creating many issues rapidly may hit GitHub API rate limits
   - Workflow includes delays to mitigate this

## Success Criteria

The fix is considered successful if:

✅ All test scenarios pass
✅ No security vulnerabilities introduced
✅ Execution time within target (2-5 minutes)
✅ User feedback is clear and accurate
✅ No breaking changes to existing functionality
✅ Issue is auto-closed on successful riddle creation

## Test Results

### Summary
- **Total Scenarios**: 7
- **Passed**: ⏳ Pending actual test run
- **Failed**: ⏳ Pending actual test run
- **Blocked**: 0
- **Not Tested**: ⏳ Pending actual test run

### Status
- [x] Test plan created
- [x] Pre-test verification completed
- [ ] Test execution in progress
- [ ] Results documented
- [ ] Approved for deployment

---

**Test Plan Version**: 1.0
**Created**: 2025-12-05
**Last Updated**: 2025-12-05
**Status**: ✅ Ready for Testing
