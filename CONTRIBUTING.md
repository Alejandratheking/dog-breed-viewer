# Contributing to Dog Breed Viewer

Thank you for your interest in contributing to the Dog Breed Viewer! This document provides comprehensive guidelines for contributing to this enterprise-grade React application.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Security Considerations](#security-considerations)
- [Performance Guidelines](#performance-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inspiring community for all.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git latest version
- VS Code (recommended) with suggested extensions

### Initial Setup
```bash
# Fork and clone the repository
git clone https://github.com/your-username/dog-breed-viewer.git
cd dog-breed-viewer

# Install dependencies
npm install

# Install pre-commit hooks
npm run prepare

# Start development environment
npm run dev
```

### Environment Configuration
Create environment files as needed:
```bash
# backend/.env (optional)
PORT=3001
NODE_ENV=development
DATABASE_PATH=./db/favourites.db
```

## Contribution Workflow

### 1. Issue Creation
- Check existing issues before creating new ones
- Use provided issue templates
- Provide detailed reproduction steps for bugs
- Include screenshots/videos when applicable

### 2. Branch Strategy
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description

# Or for documentation
git checkout -b docs/documentation-update
```

### 3. Development Process
- Make small, focused commits
- Test your changes locally
- Ensure all tests pass
- Update documentation as needed

### 4. Commit Guidelines
We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description
feat(frontend): add breed search functionality
fix(api): resolve image loading timeout issue
docs(readme): update installation instructions
style(components): improve button hover states
refactor(hooks): optimize API data fetching
test(components): add BreedList component tests
chore(deps): update dependencies to latest versions
```

### 5. Pre-commit Hooks
Our pre-commit hooks automatically run:
- ESLint for code quality
- Prettier for code formatting
- Type checking with TypeScript
- Test suite execution

## Code Standards

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` types - use proper typing
- Export types from dedicated `types/` directory

```typescript
// Good
interface BreedData {
  name: string;
  subBreeds: string[];
  imageCount: number;
}

// Bad
const breedData: any = { ... };
```

### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Optimize with React.memo when appropriate
- Follow component composition patterns

```typescript
// Good
const BreedCard = memo(({ breed, onSelect }: BreedCardProps) => {
  return (
    <button onClick={() => onSelect(breed)}>
      {breed.name}
    </button>
  );
});

// Bad
function BreedCard(props) {
  return <button onClick={() => props.onSelect(props.breed)}>
    {props.breed.name}
  </button>;
}
```

### State Management
- Use Zustand for client-side state
- Use TanStack Query for server state
- Keep state normalized and minimal
- Implement proper cache invalidation

### CSS/Styling Guidelines
- Use Tailwind CSS utility classes
- Implement responsive design mobile-first
- Maintain consistent spacing and typography
- Follow accessibility color contrast guidelines

```tsx
// Good
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
  Click me
</button>

// Bad
<button style={{padding: '8px 16px', backgroundColor: 'blue'}}>
  Click me
</button>
```

## Testing Requirements

### Coverage Requirements
- Minimum 80% test coverage
- Critical paths must have 100% coverage
- All new features require tests
- Bug fixes must include regression tests

### Testing Guidelines
```typescript
// Component tests
describe('BreedList', () => {
  it('should render all breeds correctly', () => {
    const breeds = ['labrador', 'poodle'];
    render(<BreedList breeds={breeds} />);

    expect(screen.getByText('labrador')).toBeInTheDocument();
    expect(screen.getByText('poodle')).toBeInTheDocument();
  });

  it('should call onSelect when breed is clicked', () => {
    const onSelect = vi.fn();
    const breeds = ['labrador'];

    render(<BreedList breeds={breeds} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('labrador'));

    expect(onSelect).toHaveBeenCalledWith('labrador');
  });
});

// Hook tests
describe('useBreeds', () => {
  it('should fetch and return breed data', async () => {
    const { result } = renderHook(() => useBreeds());

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

### Test Types Required
- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React component behavior
- **Integration Tests**: API interactions
- **Accessibility Tests**: Screen reader compatibility
- **Visual Regression Tests**: UI consistency

## Documentation Guidelines

### Code Documentation
- Use JSDoc comments for complex functions
- Document API interfaces thoroughly
- Include usage examples in comments
- Keep documentation up-to-date with code changes

```typescript
/**
 * Fetches random images for a specific dog breed
 * @param breed - The breed name (e.g., 'labrador', 'poodle/toy')
 * @param count - Number of images to fetch (default: 3, max: 50)
 * @returns Promise resolving to array of DogImage objects
 * @throws DogApiError if breed not found or API unavailable
 *
 * @example
 * ```typescript
 * const images = await fetchBreedImages('labrador', 5);
 * console.log(images.length); // 5
 * ```
 */
export async function fetchBreedImages(
  breed: string,
  count: number = 3
): Promise<DogImage[]>
```

### README Updates
- Update feature lists when adding functionality
- Include screenshots for UI changes
- Update API documentation for backend changes
- Maintain accurate installation instructions

## Security Considerations

### Security Checklist
- [ ] No sensitive data in code or logs
- [ ] Input validation for all user inputs
- [ ] HTTPS-only in production
- [ ] Content Security Policy configured
- [ ] Dependencies regularly updated
- [ ] No eval() or dangerouslySetInnerHTML usage

### Security Testing
```bash
# Run security audit
npm audit

# Check for vulnerable dependencies
npm audit --audit-level high

# Scan for security issues
npm run security:scan
```

## Performance Guidelines

### Performance Requirements
- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Bundle size increase < 10% per feature
- No memory leaks in development tools

### Optimization Techniques
- Use React.memo for expensive components
- Implement code splitting for routes
- Optimize images with proper formats
- Use lazy loading for non-critical content

```typescript
// Good - Memoized component
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() =>
    data.map(item => expensiveCalculation(item)),
    [data]
  );

  return <div>{processedData}</div>;
});

// Good - Lazy loading
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

## Pull Request Process

### Before Submitting
1. **Run full test suite**: `npm test`
2. **Check build**: `npm run build`
3. **Verify types**: `npm run type-check`
4. **Test locally**: `npm run start`
5. **Update documentation** as needed

### Pull Request Template
```markdown
## Description
Brief description of changes and motivation

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (change affecting existing functionality)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Updated existing tests if needed

## Screenshots (if applicable)
Include before/after screenshots for UI changes

## Checklist
- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors in browser
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Security review** for sensitive changes
5. **Performance impact** assessment

### Merge Requirements
- All CI checks passing ✅
- At least 1 approving review ✅
- No merge conflicts ✅
- Documentation updated ✅
- Test coverage maintained ✅

## Questions and Support

### Getting Help
- **GitHub Issues**: Technical questions and bug reports
- **GitHub Discussions**: General questions and feature ideas
- **Email**: security-related concerns to security@example.com

### Response Times
- **Bug reports**: 24-48 hours
- **Feature requests**: 1-2 weeks
- **Security issues**: 2-4 hours
- **General questions**: 2-3 days

### Maintainers
- **@senior-dev** - Lead Developer & Architecture
- **@security-lead** - Security & DevOps
- **@ui-lead** - Frontend & Design

---

Thank you for contributing to Dog Breed Viewer! Your contributions help make this project better for everyone. 🐕❤️