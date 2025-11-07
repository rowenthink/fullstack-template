# Fullstack Template - AI-Powered Development Platform

## Project Identity

**Tech Stack**: ASP.NET Core 9 + React 19 + TypeScript + SQLite/PostgreSQL
**Philosophy**: Test-Driven Development, Context-First Planning, Continuous Quality
**AI Assistant**: You are a senior full-stack developer pair programming with the team

## Core Development Principles

### 1. Test-Driven Development (MANDATORY)

Tests are written BEFORE implementation code, always. No exceptions.

**Why TDD with AI?**
- AI tends to hallucinate solutions without concrete verification
- Tests provide immediate feedback loop
- Prevents scope creep and over-engineering
- Forces clear requirement understanding

**TDD Cycle:**
```
Red → Green → Refactor → Commit
 ↑                         |
 |_________________________|
```

1. **Red**: Write failing test
2. **Green**: Minimal code to pass
3. **Refactor**: Improve quality while keeping tests green
4. **Commit**: Save atomic changes

### 2. Three-Phase Workflow (CRITICAL)

ALWAYS follow: Explore → Plan → Execute

#### Phase 1: Explore
```
BEFORE writing ANY code:
- Read relevant files to understand current architecture
- Identify dependencies and integration points
- Ask clarifying questions if requirements are vague
- Confirm understanding with human
```

#### Phase 2: Plan
```
Use Plan Mode (Shift+Tab twice) to:
- Create detailed step-by-step implementation plan
- Identify testing strategy for each step
- Estimate complexity and risks
- Save plan to docs/specs/[feature-name]-plan.md
- WAIT for human approval before coding
```

#### Phase 3: Execute
```
For each step in approved plan:
1. Write tests first (TDD)
2. Implement minimal code
3. Run tests continuously
4. Refactor when green
5. Commit atomic changes
```

### 3. Context Management (ESSENTIAL)

Context degradation is the #1 cause of AI coding failures.

**Prevention Strategies:**

1. **Break Tasks into Atoms** (< 2 hours each)
   - Small, focused changes
   - Single responsibility per task
   - Clear success criteria

2. **Save Important Decisions** (use # command)
   - Update CLAUDE.md with lessons learned
   - Document architectural decisions in docs/adr/
   - Preserve critical constraints

3. **Reset Context Proactively** (every 5-10 iterations)
   ```
   1. Summarize progress
   2. Save state to files
   3. /clear to reset
   4. Resume with fresh context
   ```

4. **Use Subagents for Isolation**
   - @test-runner for test execution
   - @reviewer for code quality
   - @architect for design decisions

## Architecture Overview

### Backend: Clean Architecture Pattern

```
HTTP Request
    ↓
Endpoints (Minimal APIs)
    ↓
Validators (FluentValidation)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Database (SQLite/PostgreSQL)
```

**Layer Responsibilities:**

- **Endpoints**: HTTP handling, routing, DTO mapping
- **Validators**: Input validation rules
- **Services**: Business logic, orchestration
- **Repositories**: Data access abstraction
- **Models**: Domain entities

### Frontend: Component-Service Pattern

```
User Interaction
    ↓
Components (Presentation)
    ↓
Hooks (TanStack Query)
    ↓
API Layer (axios)
    ↓
Backend
```

**Layer Responsibilities:**

- **Components**: UI rendering, user interaction
- **Hooks**: Data fetching, caching, state management
- **API Layer**: HTTP communication, error handling
- **Types**: TypeScript interfaces

## Testing Standards

### Backend Testing (xUnit + FluentAssertions + Moq)

**Location**: `backend/tests/`

**Naming Convention**: `Should_When_`
```csharp
[Fact]
public void Should_ReturnUser_When_ValidIdProvided()
{
    // Arrange
    var userId = 123;
    var mockRepo = new Mock<IUserRepository>();
    mockRepo.Setup(r => r.GetById(userId))
           .Returns(new User { Id = userId, Name = "John" });
    
    var service = new UserService(mockRepo.Object);
    
    // Act
    var result = service.GetUser(userId);
    
    // Assert
    result.Should().NotBeNull();
    result.Id.Should().Be(userId);
}
```

**Coverage Target**: 80% minimum

**Test Categories**:
- Unit Tests: Isolated component testing
- Integration Tests: Database, API testing
- NO mocking in integration tests

### Frontend Testing (Vitest + Testing Library + Playwright)

**Location**: `frontend/__tests__/`

**Philosophy**: Test user behavior, not implementation

```typescript
// Good: Testing behavior
test('should display error message when login fails', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'wrong@email.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});

// Bad: Testing implementation
test('should call setError when API returns 401', () => {
  // Don't test internal state/functions
});
```

**Coverage Target**: 80% minimum

**Test Types**:
- Unit: Individual components
- Integration: Component groups, data flow
- E2E: Critical user journeys

## Code Standards

### TypeScript Standards

**Type Safety (CRITICAL)**:
```typescript
// NEVER use 'any'
❌ function fetchData(id: any): any { }

// Use specific types or 'unknown'
✅ function fetchData(id: number): Promise<User> { }
✅ function parseJSON(input: unknown): object { }
```

**Error Handling**:
```typescript
// Always handle errors
try {
  const data = await api.fetchUser(id);
  return data;
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    logger.error('Unexpected error', error);
  }
  throw error;
}
```

**Functional Style**:
```typescript
// Prefer immutability
const updatedUsers = users.map(u => 
  u.id === targetId ? { ...u, active: true } : u
);

// Avoid mutations
❌ users.forEach(u => { if (u.id === targetId) u.active = true; });
```

### C# Standards

**Minimal APIs Pattern**:
```csharp
app.MapPost("/api/users", async (
    CreateUserDto dto,
    IValidator<CreateUserDto> validator,
    IUserService userService) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
    {
        return Results.ValidationProblem(validationResult.ToDictionary());
    }
    
    var user = await userService.CreateUserAsync(dto);
    return Results.Created($"/api/users/{user.Id}", user);
});
```

**Return DTOs, Never Entities**:
```csharp
// ❌ NEVER expose entities directly
public async Task<User> GetUser(int id) { }

// ✅ Always use DTOs
public async Task<UserDto> GetUser(int id)
{
    var user = await _repository.GetByIdAsync(id);
    return _mapper.Map<UserDto>(user);
}
```

**FluentValidation**:
```csharp
public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
            
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches(@"[A-Z]").WithMessage("Must contain uppercase")
            .Matches(@"[a-z]").WithMessage("Must contain lowercase")
            .Matches(@"\d").WithMessage("Must contain digit");
    }
}
```

## File Organization

### Backend Structure

```
backend/src/Api/
├── Models/           # Domain entities (database models)
├── DTOs/             # Data transfer objects
│   ├── Requests/     # API request DTOs
│   └── Responses/    # API response DTOs
├── Services/         # Business logic
│   └── Interfaces/   # Service interfaces
├── Repositories/     # Data access
│   └── Interfaces/   # Repository interfaces
├── Endpoints/        # API endpoint definitions
├── Validators/       # FluentValidation validators
├── Middleware/       # Custom middleware
└── Data/             # EF Core DbContext
```

### Frontend Structure

```
frontend/src/
├── components/
│   ├── features/     # Feature-specific components
│   │   ├── auth/     # Authentication components
│   │   ├── users/    # User management components
│   │   └── ...
│   └── ui/           # shadcn/ui components (DO NOT EDIT)
├── lib/
│   ├── api/          # API client functions
│   │   ├── client.ts # Axios instance
│   │   └── users.ts  # User API calls
│   └── utils.ts      # Utility functions
├── hooks/            # Custom React hooks
│   ├── useAuth.ts    # Authentication hook
│   └── useUsers.ts   # User data hooks (TanStack Query)
├── types/            # TypeScript type definitions
│   ├── api.ts        # API response types
│   └── models.ts     # Domain model types
└── __tests__/        # Tests organized by type
```

## Common Commands Reference

### Testing
```bash
# Backend tests
cd backend && dotnet test --verbosity normal

# Frontend unit tests
cd frontend && bun test --coverage

# Frontend E2E tests
cd frontend && bun run test:e2e

# All tests
./scripts/test-all.sh
```

### Development
```bash
# Backend dev server
cd backend/src/Api && dotnet watch run

# Frontend dev server
cd frontend && bun run dev

# Database migrations
cd backend/src/Api && dotnet ef migrations add MigrationName
cd backend/src/Api && dotnet ef database update
```

### Code Quality
```bash
# Format backend code
cd backend && dotnet format

# Lint frontend code
cd frontend && bun run lint
cd frontend && bun run lint:fix

# Type check
cd frontend && bun run type-check
```

### Build
```bash
# Build backend
cd backend && dotnet build --configuration Release

# Build frontend
cd frontend && bun run build

# Build all
./scripts/build-all.sh
```

## Critical Constraints

### NEVER

1. ❌ Skip writing tests before implementation
2. ❌ Commit code with failing tests
3. ❌ Use `any` type in TypeScript
4. ❌ Hardcode configuration values
5. ❌ Expose entities directly from APIs
6. ❌ Modify shadcn/ui generated files
7. ❌ Put business logic in Endpoints or Components
8. ❌ Start coding without a plan
9. ❌ Ignore linter/compiler warnings
10. ❌ Make breaking changes without migration strategy

### ALWAYS

1. ✅ Write tests first (TDD)
2. ✅ Run tests after each change
3. ✅ Ask clarifying questions when requirements are unclear
4. ✅ Save plans to docs/specs/ before implementation
5. ✅ Use Plan Mode (Shift+Tab twice) for complex features
6. ✅ Keep commits atomic and focused
7. ✅ Update documentation when architecture changes
8. ✅ Handle errors gracefully
9. ✅ Validate all user inputs
10. ✅ Use dependency injection

## Workflow Patterns

### Pattern 1: Adding New Feature

```
1. Human: "Add user profile editing feature"

2. AI Response:
   "I'll use Plan Mode to design this feature. Let me analyze the current architecture first."
   
3. AI reads:
   - Existing user-related files
   - Current API structure
   - Authentication implementation
   
4. AI creates plan in docs/specs/user-profile-editing-plan.md

5. Human reviews and approves

6. AI executes plan:
   - Step 1: Write backend tests
   - Step 2: Implement backend endpoint
   - Step 3: Write frontend tests
   - Step 4: Implement UI components
   - Step 5: Integration testing
   
7. Each step: Test → Code → Verify → Commit
```

### Pattern 2: Fixing Bug

```
1. Human: "Login form doesn't show validation errors"

2. AI: /tdd "Fix login form validation display"

3. AI writes failing test demonstrating bug

4. AI runs test to confirm failure

5. AI fixes implementation

6. AI runs tests to verify fix

7. AI runs /review to check for side effects

8. Commit fix
```

### Pattern 3: Refactoring

```
1. Human: "Refactor user service to use repository pattern"

2. AI uses Plan Mode:
   - Analyze current implementation
   - Design repository interface
   - Plan migration strategy
   
3. AI shows plan, waits for approval

4. AI executes:
   - Write tests for repository
   - Implement repository
   - Update service to use repository
   - Ensure all tests still pass
   
5. Use @test-runner to verify no regressions
```

## AI Interaction Guidelines

### How to Talk to Me (Claude)

**Be Specific**:
```
❌ "Add authentication"
✅ "Add JWT-based authentication with login, register, and token refresh endpoints. Use BCrypt for password hashing."
```

**Provide Context**:
```
✅ "We need to add pagination to the users list. We're currently loading all users at once, which is slow with 10k+ users. Prefer cursor-based pagination over offset."
```

**Set Boundaries**:
```
✅ "Implement this feature but DON'T change the existing authentication system. Just integrate with it."
```

**Challenge My Assumptions**:
```
Human: "Does this approach make sense? Are there better alternatives?"
```

### When I Make Mistakes

If I suggest something wrong:
1. Point it out directly
2. Explain why it's incorrect
3. I'll update CLAUDE.md to prevent recurrence

Example:
```
Human: "No, don't use localStorage for JWT tokens. That's vulnerable to XSS. Use httpOnly cookies instead."

AI: "You're absolutely right. I'll update the implementation to use httpOnly cookies and add this to CLAUDE.md as a security constraint."
```

## Learning and Improvement

### Continuous Improvement

After completing features:
1. Update CLAUDE.md with lessons learned
2. Add architectural decisions to docs/adr/
3. Create Mermaid diagrams for complex flows
4. Update test patterns if better approaches discovered

### Documenting Decisions

When making significant choices:
```markdown
# ADR 0004: Use TanStack Query for Server State

## Status
Accepted

## Context
Need efficient server state management with caching, refetching, and optimistic updates.

## Decision
Use TanStack Query instead of Redux for server state.

## Consequences
- Positive: Automatic caching, background refetching, less boilerplate
- Negative: Learning curve for team, different from Redux patterns
- Mitigation: Create hooks library with examples
```

## Performance and Cost

### Context Optimization

1. **Proactive Resets**
   - Reset context every 5-10 interactions
   - Save important state to files first
   - Use subagents to isolate tasks

2. **Efficient File Reading**
   - Request specific files, not wildcards
   - Avoid re-reading unchanged files
   - Use Plan Mode to minimize trial-and-error

3. **Batch Operations**
   - Queue multiple related prompts
   - Let me work through tasks sequentially

### Model Selection

- **Simple tasks**: Claude Haiku (fast, cheap)
- **Daily development**: Claude Sonnet (balanced)
- **Architecture decisions**: Claude Opus (deep reasoning)
- **Planning**: Use Plan Mode (more efficient)

## Troubleshooting

### Common Issues

**Issue**: Tests failing after refactor
```
Solution: Run @test-runner to analyze failures
Check: Did we maintain contract compatibility?
```

**Issue**: Context feels "drift-y" or inconsistent
```
Solution: 
1. Save current progress
2. /clear to reset
3. Resume with fresh context and saved state
```

**Issue**: AI suggesting over-complicated solution
```
Prevention: Always start with Plan Mode
Challenge: "Is there a simpler way to achieve this?"
```

**Issue**: Unclear requirements leading to rework
```
Prevention: Force planning phase with clarifying questions
AI should ask: "Before I plan this, I need to understand..."
```

## Quick Reference

### Keyboard Shortcuts
- `Shift+Tab Shift+Tab`: Plan Mode
- `#`: Save to CLAUDE.md
- `/clear`: Reset context
- `@filename`: Reference file
- `@agent-name`: Call subagent

### Key Files
- `CLAUDE.md`: Project configuration (this file)
- `.claude/settings.json`: Tool permissions, hooks
- `docs/specs/`: Feature plans
- `docs/adr/`: Architecture decisions
- `docs/diagrams/`: Visual documentation

### Key Commands
- `/tdd [feature]`: TDD workflow
- `/review`: Code quality check
- `/plan [feature]`: Planning mode
- `/spec [feature]`: Generate specification

---

**Last Updated**: 2025-11-07
**Version**: 3.0
**Template Maturity**: Production-Ready

---

## Meta: About This File

This CLAUDE.md is the source of truth for how AI should interact with this codebase. It's continuously improved based on real development experience. Treat it like a senior developer's accumulated wisdom, not just configuration.

When in doubt, ask questions. When successful, document patterns. When mistakes happen, update constraints.

Happy vibing! 