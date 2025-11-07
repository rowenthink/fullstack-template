---
name: review
description: Perform comprehensive code review with quality, security, and architecture checks
arguments: Optional file/directory path to review (default: recent changes)
---

# Comprehensive Code Review

Reviewing: **$ARGUMENTS** (or recent changes if not specified)

## Review Scope

Analyzing:
1. Code Quality & Maintainability
2. Type Safety & Error Handling
3. Testing & Coverage
4. Security Vulnerabilities
5. Performance & Efficiency
6. Architecture & Patterns Compliance

---

## 1. Code Quality & Maintainability

### Readability
- [ ] Clear, descriptive naming (no abbreviations)
- [ ] Functions <50 lines
- [ ] Single responsibility principle
- [ ] Consistent code style
- [ ] Meaningful comments (why, not what)

### Code Smells
- [ ] No code duplication
- [ ] No magic numbers/strings
- [ ] No deeply nested conditionals (>3 levels)
- [ ] No long parameter lists (>4 params)
- [ ] No god classes/functions

### TypeScript Specific
```typescript
// Check for:
❌ any types
❌ Type assertions (as) without justification
❌ Ignoring errors (@ts-ignore)
❌ Implicit any
✅ Explicit return types
✅ Proper generic usage
✅ Discriminated unions for variants
```

### C# Specific
```csharp
// Check for:
❌ Public fields (use properties)
❌ Swallowed exceptions
❌ String concatenation in loops
❌ Improper disposal of IDisposable
✅ Async/await properly used
✅ LINQ instead of loops where appropriate
✅ Nullable reference types enabled
```

---

## 2. Type Safety & Error Handling

### Type Coverage
- [ ] No `any` types in TypeScript
- [ ] Proper null/undefined handling
- [ ] Exhaustive switch statements
- [ ] Proper error types defined

### Error Handling
```typescript
// Good error handling:
try {
  const data = await fetchUser(id);
  return data;
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
    logger.error('API Error', { error, userId: id });
  } else if (error instanceof NetworkError) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred');
    logger.error('Unexpected error', error);
  }
  throw error; // Re-throw for upstream handling
}
```

```csharp
// Good error handling:
public async Task<Result<UserDto>> GetUserAsync(int id)
{
    try 
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null)
            return Result<UserDto>.Failure("User not found");
            
        return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
    }
    catch (DbException ex)
    {
        _logger.LogError(ex, "Database error getting user {UserId}", id);
        return Result<UserDto>.Failure("Database error");
    }
}
```

---

## 3. Testing & Coverage

### Test Quality
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Tests have clear, descriptive names
- [ ] Tests are isolated (no shared state)
- [ ] Tests test ONE thing
- [ ] No test interdependencies

### Coverage Analysis
```bash
# Run coverage checks
cd backend && dotnet test /p:CollectCoverage=true
cd frontend && bun test --coverage
```

**Check**:
- [ ] Overall coverage >80%
- [ ] New code coverage 100%
- [ ] Critical paths covered
- [ ] Edge cases tested
- [ ] Error paths tested

### Test Smells
```typescript
// ❌ Bad: Testing implementation
test('should update state', () => {
  component.setState({ loading: true });
  expect(component.state.loading).toBe(true);
});

// ✅ Good: Testing behavior
test('should show loading spinner during fetch', () => {
  render(<UserList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

---

## 4. Security Vulnerabilities

### Input Validation
- [ ] All user inputs validated
- [ ] Server-side validation (never trust client)
- [ ] Proper sanitization
- [ ] File upload restrictions

### Authentication & Authorization
- [ ] Protected routes require auth
- [ ] JWT tokens in httpOnly cookies (not localStorage)
- [ ] Token expiration handled
- [ ] Password hashing (BCrypt/Argon2)
- [ ] Role-based access control

### Common Vulnerabilities
```typescript
// ❌ XSS Vulnerability
dangerouslySetInnerHTML={{ __html: userInput }}

// ✅ Safe
{sanitize(userInput)}
```

```csharp
// ❌ SQL Injection
var query = $"SELECT * FROM Users WHERE Email = '{email}'";

// ✅ Parameterized query
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == email);
```

**Check for**:
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] No sensitive data in logs
- [ ] No hardcoded secrets
- [ ] Proper CORS configuration
- [ ] HTTPS enforced in production

---

## 5. Performance & Efficiency

### Database Performance
- [ ] No N+1 query problems
- [ ] Appropriate indexes
- [ ] Efficient queries (no SELECT *)
- [ ] Pagination for large datasets
- [ ] Connection pooling

```csharp
// ❌ N+1 Problem
var users = await _context.Users.ToListAsync();
foreach (var user in users)
{
    user.Orders = await _context.Orders
        .Where(o => o.UserId == user.Id)
        .ToListAsync(); // N queries
}

// ✅ Eager Loading
var users = await _context.Users
    .Include(u => u.Orders)
    .ToListAsync(); // 1 query
```

### Frontend Performance
- [ ] No unnecessary re-renders
- [ ] Proper memoization (useMemo, useCallback)
- [ ] Lazy loading for routes
- [ ] Image optimization
- [ ] Bundle size optimization

```typescript
// ❌ Recreates function on every render
function UserList() {
  const handleClick = (id: number) => { /* ... */ };
  return <div>{users.map(u => <User onClick={handleClick} />)}</div>;
}

// ✅ Stable reference
function UserList() {
  const handleClick = useCallback((id: number) => { /* ... */ }, []);
  return <div>{users.map(u => <User onClick={handleClick} />)}</div>;
}
```

### Resource Management
- [ ] Proper cleanup in useEffect
- [ ] IDisposable disposed
- [ ] Event listeners removed
- [ ] Timeouts/intervals cleared

---

## 6. Architecture & Patterns Compliance

### Backend Architecture
- [ ] Endpoints are thin (orchestration only)
- [ ] Business logic in Services
- [ ] Data access in Repositories
- [ ] DTOs used (never expose Entities)
- [ ] Dependency injection properly used

```csharp
// ❌ Business logic in endpoint
app.MapPost("/api/users", async (CreateUserDto dto, AppDbContext db) =>
{
    if (string.IsNullOrEmpty(dto.Email)) // Validation logic
        return Results.BadRequest();
        
    var exists = await db.Users.AnyAsync(u => u.Email == dto.Email); // Business logic
    if (exists)
        return Results.Conflict();
        
    var user = new User { /* ... */ }; // Mapping logic
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok(user); // Exposing entity
});

// ✅ Proper separation
app.MapPost("/api/users", async (
    CreateUserDto dto,
    IValidator<CreateUserDto> validator,
    IUserService userService) =>
{
    var validationResult = await validator.ValidateAsync(dto);
    if (!validationResult.IsValid)
        return Results.ValidationProblem(validationResult.ToDictionary());
        
    var result = await userService.CreateUserAsync(dto);
    return result.IsSuccess 
        ? Results.Created($"/api/users/{result.Value.Id}", result.Value)
        : Results.Problem(result.Error);
});
```

### Frontend Architecture
- [ ] Components are presentational
- [ ] Data fetching in hooks (TanStack Query)
- [ ] Business logic extracted from components
- [ ] State management appropriate (Context vs Query)

```typescript
// ❌ Component doing too much
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [id]);
  
  // ... rendering logic
}

// ✅ Separated concerns
function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => api.getUser(id),
  });
}

function UserProfile() {
  const { data: user, isLoading } = useUser(id);
  // ... rendering logic only
}
```

### SOLID Principles
- [ ] Single Responsibility: Each class/function does ONE thing
- [ ] Open/Closed: Extend behavior without modifying existing code
- [ ] Liskov Substitution: Derived types are substitutable
- [ ] Interface Segregation: Small, focused interfaces
- [ ] Dependency Inversion: Depend on abstractions

---

## Review Output Format

### 🔴 Critical Issues (MUST FIX)
[Issues that pose security risks, cause crashes, or violate core principles]

Example:
- **Security**: JWT tokens stored in localStorage (XSS vulnerable)
  - Location: `frontend/src/lib/auth.ts:45`
  - Fix: Move to httpOnly cookies
  
- **Architecture**: Business logic in React component
  - Location: `frontend/src/components/UserProfile.tsx:78-102`
  - Fix: Extract to service/hook

---

### 🟡 Major Issues (SHOULD FIX)
[Issues that impact quality, maintainability, or performance significantly]

Example:
- **Performance**: N+1 query problem
  - Location: `backend/Services/OrderService.cs:34`
  - Fix: Use `.Include()` for eager loading
  
- **Testing**: Critical path not covered
  - Location: `backend/Services/PaymentService.cs:ProcessPayment`
  - Fix: Add integration test for payment flow

---

### 🟢 Minor Issues (NICE TO HAVE)
[Code smells, style inconsistencies, or minor improvements]

Example:
- **Naming**: Variable name `d` is unclear
  - Location: `frontend/src/utils/date.ts:12`
  - Suggestion: Rename to `formattedDate`
  
- **Code Smell**: Duplicated validation logic
  - Location: `backend/Validators/UserValidator.cs` and `ProductValidator.cs`
  - Suggestion: Extract to shared validator base

---

### ✅ Best Practices Observed
[Things done well that should be maintained]

Example:
- Excellent test coverage (94%)
- Proper error handling with user-friendly messages
- Clean separation of concerns
- Good use of TypeScript discriminated unions

---

### 📊 Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Test Coverage | 87% | >80% | ✅ |
| Type Coverage | 100% | 100% | ✅ |
| Code Duplication | 3% | <5% | ✅ |
| Cyclomatic Complexity (avg) | 4.2 | <10 | ✅ |
| Function Length (avg) | 32 lines | <50 | ✅ |

---

### 🎯 Overall Score: X/10

**Summary**: [Brief overall assessment]

**Top Priority**: [Most important issue to address]

**Recommended Next Steps**:
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]

---

## Post-Review Actions

After review is complete:

1. **Address Critical Issues Immediately**
2. **Create tickets for Major Issues**
3. **Plan refactoring for Minor Issues**
4. **Document decisions** in `docs/adr/` if architectural
5. **Update CLAUDE.md** if new patterns emerge

Would you like me to create a detailed refactoring plan for any issues found?