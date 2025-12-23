# Contributing to Rummy Score Tracker

Thank you for your interest in contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/rummy-score.git
cd rummy-score

# Install dependencies
npm install

# Start development server
npm start
```

## Project Structure

```
rummy-score/
├── src/
│   ├── components/      # Reusable UI components
│   ├── constants/       # Constants and configs
│   ├── navigation/      # Navigation setup
│   ├── screens/        # Screen components
│   ├── store/          # Redux store and slices
│   ├── theme/          # Theme configuration
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── App.tsx             # App entry point
└── package.json        # Dependencies
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type
- Use type inference where possible

### React Native

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use proper prop types

### Redux

- Use Redux Toolkit
- Keep actions and reducers simple
- Use selectors for derived state
- Follow Redux style guide

### Styling

- Use React Native Paper components
- Follow the existing theme
- Use constants for colors and spacing
- Keep styles at bottom of file

### Code Style

- Follow ESLint and Prettier configs
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/config changes

Example:
```
feat: add player statistics screen
fix: resolve score calculation bug
docs: update setup instructions
```

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Add comments to complex code
   - Update CHANGELOG.md

2. **Test Your Changes**
   - Test on both iOS and Android
   - Test different screen sizes
   - Verify no TypeScript errors

3. **Keep PRs Focused**
   - One feature/fix per PR
   - Keep changes minimal
   - Explain your changes clearly

4. **PR Template**
   ```
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tested on iOS
   - [ ] Tested on Android
   - [ ] No TypeScript errors
   
   ## Screenshots
   (if applicable)
   ```

## Feature Requests

Have an idea? Great! Here's how to propose it:

1. **Check Existing Issues**
   - Search for similar requests
   - Comment on existing issues

2. **Create New Issue**
   - Use feature request template
   - Describe the feature clearly
   - Explain the use case
   - Provide examples if possible

3. **Label Appropriately**
   - `enhancement` for new features
   - `discussion` for ideas
   - `help wanted` if you need help

## Bug Reports

Found a bug? Help us fix it:

1. **Search Existing Issues**
   - Check if already reported
   - Add information to existing issue

2. **Create Bug Report**
   - Use bug report template
   - Describe the bug clearly
   - Include steps to reproduce
   - Add screenshots/videos
   - Include device/OS information

3. **Provide Context**
   - What were you trying to do?
   - What actually happened?
   - What did you expect?

## Code Review Process

1. Maintainers review PRs regularly
2. Address review comments
3. Keep discussions respectful
4. Be patient and understanding

## Areas to Contribute

### 🎨 UI/UX
- Design improvements
- New themes
- Animations
- Accessibility features

### 🔧 Features
- New game modes
- Statistics and analytics
- Export/import functionality
- Social features

### 📱 Platform
- iOS specific features
- Android specific features
- Performance optimizations
- Bug fixes

### 📝 Documentation
- Improve README
- Add tutorials
- Create video guides
- Translate documentation

### 🧪 Testing
- Write tests
- Test on devices
- Report bugs
- Verify fixes

## Questions?

- Open an issue for questions
- Join discussions
- Ask in pull requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You! 🙏

Every contribution helps make this app better for everyone!

