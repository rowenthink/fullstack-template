---
name: tdd
description: Execute Test-Driven Development workflow for a feature
arguments: Feature description
---

# Test-Driven Development Workflow

You are executing a TDD workflow for: **$ARGUMENTS**

## Mandatory TDD Process

### Step 1: Understand Requirements (Explore)

STOP and answer these questions:
1. What is the exact behavior we're testing?
2. What are the edge cases?
3. What are the success criteria?
4. Are requirements clear enough?

If ANY uncertainty exists, ask clarifying questions NOW.

**DO NOT PROCEED** until requirements are crystal clear.

---

### Step 2: Design Tests (Red Phase)

Write tests that specify the expected behavior.

**Backend Tests** (xUnit + FluentAssertions):
- Location: `backend/tests/UnitTests/` or `IntegrationTests/`
- Naming: `Should_[Expected]_When_[Condition]`
- Structure: Arrange, Act, Assert

```csharp
[Fact]
public void Should_ReturnUser_When_ValidIdProvided()
{
    // Arrange
    var userId = 1;
    var mockRepo = new Mock<IUserRepository>();
    mockRepo.Setup(r => r.GetByIdAsync(userId))
           .ReturnsAsync(new User { Id = userId, Name = "John" });
    var service = new UserService(mockRepo.Object);
    
    // Act
    var result = await service.GetUserAsync(userId);
    
    // Assert
    result.Should().NotBeNull();
    result.Id.Should().Be(userId);
}
```

**Frontend Tests** (Vitest + Testing Library):
- Location: `frontend/__tests__/unit/` or `integration/`
- Test user behavior, not implementation

```typescript
test('should display validation error for invalid email', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
});
```

**CRITICAL**: DO NOT implement ANY production code yet.

---

### Step 3: Run Tests - Confirm Failure (Red)

Run the test suite and VERIFY tests fail for the RIGHT reasons.

```bash
# Backend
cd backend && dotnet test --filter "FullyQualifiedName~[TestClassName]"

# Frontend
cd frontend && bun test [test-file-name]
```

**Expected Output**: Tests should FAIL because functionality doesn't exist yet.

If tests PASS at this stage, something is WRONG:
- Test might be testing existing code
- Test might not be asserting correctly
- Test might have a bug

**STOP and fix the test** before proceeding.

---

### Step 4: Minimal Implementation (Green Phase)

Write the SIMPLEST code that makes tests pass.

**Rules**:
1. No over-engineering
2. No "future-proofing"
3. No extra features
4. Just make the tests pass

**Backend Example**:
```csharp
// Simple, focused implementation
public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    
    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<UserDto> GetUserAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) 
            throw new NotFoundException($"User {id} not found");
            
        return new UserDto 
        { 
            Id = user.Id, 
            Name = user.Name 
        };
    }
}
```

**Frontend Example**:
```typescript
// Simple, focused component
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    
    // Login logic...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <span>{error}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Step 5: Run Tests - Confirm Success (Green)

Run ALL tests (not just new ones).

```bash
# Backend - all tests
cd backend && dotnet test --verbosity normal

# Frontend - all tests
cd frontend && bun test --coverage
```

**Required**: 100% tests passing ✓

If ANY test fails:
1. Analyze the failure
2. Fix the implementation (NOT the test)
3. Re-run tests
4. Repeat until green

---

### Step 6: Refactor (Refactor Phase)

Now improve code quality WHILE keeping tests green.

**Run /review** to identify improvement opportunities.

Potential improvements:
- Extract duplicated logic
- Improve naming
- Add documentation
- Optimize performance
- Enhance error messages

**Rules**:
1. Run tests after EACH refactoring change
2. If tests fail, revert immediately
3. Make small, incremental improvements
4. Keep tests passing throughout

---

### Step 7: Verify Coverage

Check test coverage meets standards.

```bash
# Backend
cd backend && dotnet test /p:CollectCoverage=true

# Frontend
cd frontend && bun test --coverage
```

**Required**: 
- Overall coverage: >80%
- New code coverage: 100%

If coverage is insufficient, add more tests and return to Step 2.

---

### Step 8: Commit

Commit the complete, tested feature.

```bash
git add .
git commit -m "feat: [feature description]

- Implemented [feature] with TDD
- All tests passing
- Coverage: [X]%"
```

**Commit Checklist**:
- ✅ All tests passing
- ✅ Coverage >80%
- ✅ No linter errors
- ✅ No compiler warnings
- ✅ Code reviewed (by /review command)

---

## TDD Anti-Patterns to Avoid

### ❌ DON'T: Write implementation first
```
Wrong: Code → "I should probably test this" → Tests
```

### ❌ DON'T: Write tests that always pass
```csharp
[Fact]
public void Should_Work() 
{
    Assert.True(true); // Useless test
}
```

### ❌ DON'T: Change tests to make them pass
```
Wrong: Test fails → Change test assertion → Test passes
Right: Test fails → Fix implementation → Test passes
```

### ❌ DON'T: Skip the refactor phase
```
Wrong: Red → Green → Commit (leaving messy code)
Right: Red → Green → Refactor → Commit
```

### ❌ DON'T: Test implementation details
```typescript
// Bad: Testing internal state
expect(component.state.isLoading).toBe(false);

// Good: Testing user-observable behavior
expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
```

---

## Success Criteria

This TDD workflow is complete when:

1. ✅ Feature requirements clearly understood
2. ✅ Tests written before implementation
3. ✅ Tests initially failed (Red)
4. ✅ Minimal implementation created (Green)
5. ✅ All tests passing (100%)
6. ✅ Code refactored for quality
7. ✅ Coverage >80%
8. ✅ No linter/compiler errors
9. ✅ Changes committed
10. ✅ Documentation updated if needed

---

**Remember**: TDD is not about testing. It's about **designing** through tests. Tests are the specification.

If you're unsure at ANY point, STOP and ask for clarification.