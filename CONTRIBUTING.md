# Contributing to KPB Travels

Thank you for your interest in contributing to KPB Travels! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome different perspectives and ideas
- Focus on constructive feedback
- Report violations to: conduct@kpbtravels.com

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/enterprise-devops-platform.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Write clear commit messages
   - Add tests for new functionality

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend manual testing
   cd frontend && npm start
   ```

5. **Commit and push**
   ```bash
   git commit -m "feat: add new feature description"
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide clear description of changes
   - Link related issues
   - Include screenshots if UI changes

## Development Guidelines

### Code Style

**JavaScript/Node.js:**
- Use 2-space indentation
- Use camelCase for variables/functions
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants
- Add JSDoc comments for complex functions

Example:
```javascript
// Good
const getUserProfile = async (userId) => {
  /**
   * Fetches user profile from database
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  return await User.findById(userId);
};

// Bad
const get_user_profile=async(id)=>{return await User.findById(id);}
```

### Git Commit Messages

Follow conventional commits:
```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(booking): add cancellation reason field
fix(auth): fix JWT token validation
docs(api): update endpoint documentation
```

### Branch Naming

```
feature/feature-name
bugfix/bug-description
docs/documentation-topic
hotfix/critical-issue
```

## Testing

- Write unit tests for new functions
- Maintain >80% code coverage
- Run tests before submitting PR
- Update tests when modifying functionality

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- userController.test.js
```

## Documentation

- Update README.md for user-facing changes
- Update API_DOCUMENTATION.md for API changes
- Add code comments for complex logic
- Document environment variables
- Include examples in documentation

## Pull Request Process

1. **Before submitting:**
   - Run linter: `npm run lint`
   - Run tests: `npm test`
   - Update documentation
   - Ensure clean commit history

2. **PR Description should include:**
   - Clear title: "Fix: description" or "Feature: description"
   - Detailed description of changes
   - Related issue numbers (Closes #123)
   - Screenshots for UI changes
   - Testing instructions
   - Checklist of completed items

3. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Related Issues
   Closes #123
   
   ## Changes Made
   - Change 1
   - Change 2
   - Change 3
   
   ## Testing
   Steps to test the changes
   
   ## Screenshots
   (if applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

## Review Process

- Minimum 2 approvals required
- Address review comments
- No force-push after review started
- Squash commits before merging

## Feature Request Process

1. Check if feature already requested
2. Open issue with title: "Feature: description"
3. Provide use case and benefits
4. Include examples if applicable

## Bug Report Process

1. Check if bug already reported
2. Open issue with title: "Bug: description"
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots/logs

## Development Setup

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Watch mode (auto-reload on changes)
npm run dev

# Run specific test
npm test -- users.test.js
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Development server with hot reload
npm start

# Build for production
npm run build
```

### Database Development
```bash
# Seed development data
npm run seed

# Reset database
npm run db:reset
```

## Project Structure

- **backend/** - Node.js/Express server
- **frontend/** - HTML/CSS/JavaScript web app
- **deployment/** - Docker and K8s configs
- **database/** - Database scripts
- **.github/** - GitHub Actions workflows

## Performance Considerations

- Keep API response time < 200ms
- Optimize database queries with indexes
- Minimize bundle size for frontend
- Use pagination for large datasets
- Cache frequently accessed data

## Security Guidelines

- Never commit sensitive data (.env files)
- Use environment variables for secrets
- Validate all user inputs
- Use parameterized queries
- Keep dependencies updated
- Follow OWASP top 10 guidelines

## Version Management

Uses semantic versioning: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

## Deployment Process

1. Changes merged to main branch
2. Tests run automatically
3. Docker images built and pushed
4. Deploy to staging environment
5. Manual testing
6. Deploy to production
7. Monitor for issues

## Getting Help

- **Slack**: #kpbtravels-dev
- **Email**: dev@kpbtravels.com
- **Issues**: Use GitHub issues
- **Documentation**: See docs/ folder

## Additional Resources

- [Architecture Documentation](ARCHITECTURE.md)
- [Installation Guide](INSTALLATION.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out:
- Open a GitHub discussion
- Email: contributors@kpbtravels.com
- Join our Slack community

---

**Thank you for contributing to KPB Travels! 🚀**
