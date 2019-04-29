## Insert a short title for the PR

Elaborate in your description, write exactly what was done and the purpose to do it.

Reference the issue this PR belongs to with `closes #<issue_number>`

Describe the flows for the reviewer and how he can verify what you have developed. If you added new endpoints provide the `curl` code, per example.

## Reviewer's guide

This guide describe mandatory requirements that the PR should have in order to be accepted.

### API endpoints

- [ ] Should have clear and consistant documentation.

- [ ] Should have unit tests with external APIs mocked.

### Webapp

- [ ] All components should have `PropTypes` stablished.

- [ ] All the ESLint rules stablished in the project should be followed.

- [ ] The reviewer should be able to replicate succesfully the change in his computer.

### Scrapper

- [ ] Should have unit tests

### ML API

- [ ] Should have unit tests

### Cron Jobs

- [ ] Should have unit tests
