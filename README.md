# git-commit

GitHub Action to commit when a file has changed during the Workflow.

# Usage

```yml
- uses: matheusalbino/git-commit@v1.0.1
  with:
    user-name: Equal
    user-email: equal@example.com
    message: This a commit from Github Actions
    github-token: ${{ secrets.GITHUB_TOKEN }}
```
