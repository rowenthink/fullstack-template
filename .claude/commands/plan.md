---
name: plan
description: Create detailed implementation plan using enhanced planning mode
arguments: Feature or task description
---

# Enhanced Planning Mode

**Planning**: $ARGUMENTS

⚠️ **PLANNING MODE ACTIVE** ⚠️

I am in planning-only mode. I will NOT write any code or modify any files during this phase.

---

## Phase 1: Analysis & Understanding

### 1.1 Requirement Clarification

**Feature Request**: $ARGUMENTS

**Clarifying Questions**:
[List any unclear aspects that need human input]

1. [Question 1]
2. [Question 2]
...

**Assumptions** (if questions not answered):
- [Assumption 1]
- [Assumption 2]

---

### 1.2 Current State Analysis

**Reading relevant files...**

Files analyzed:
- [ ] Existing related features
- [ ] Current architecture patterns
- [ ] API structure
- [ ] Database schema
- [ ] Test patterns

**Current State Summary**:
[Description of current implementation state]

---

### 1.3 Dependency Analysis

**Dependencies Identified**:
- **Internal**: [List internal system dependencies]
- **External**: [List external libraries/APIs needed]
- **Data**: [Database changes, migrations needed]

**Integration Points**:
- [Existing system touchpoints]

**Potential Conflicts**:
- [Areas that might conflict with existing code]

---

## Phase 2: Architecture & Design

### 2.1 Architectural Impact

**Pattern**: [Clean Architecture / Component-Service / etc.]

**Layers Affected**:
- [ ] Backend Endpoints
- [ ] Backend Services
- [ ] Backend Repositories
- [ ] Frontend Components
- [ ] Frontend Hooks
- [ ] Frontend API Layer
- [ ] Database Schema

**Architecture Diagram**:

```mermaid
[Generate appropriate Mermaid diagram showing the architecture]

Example:
graph TB
    A[User] --> B[Frontend Component]
    B --> C[React Hook with TanStack Query]
    C --> D[API Client]
    D --> E[Backend Endpoint]
    E --> F[Validator]
    F --> G[Service]
    G --> H[Repository]
    H --> I[Database]
```

---

### 2.2 Data Model Changes

**Database Changes Required**:

```sql
[Show any schema changes needed]

Example:
-- New table
CREATE TABLE user_preferences (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    theme VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Migration strategy
ALTER TABLE users ADD COLUMN last_login DATETIME;
```

**Migration Strategy**:
- [ ] Backward compatible?
- [ ] Data migration needed?
- [ ] Rollback plan?

---

### 2.3 API Design

**New Endpoints**:

```
POST /api/[resource]
GET /api/[resource]/{id}
PUT /api/[resource]/{id}
DELETE /api/[resource]/{id}
```

**Request/Response DTOs**:

```csharp
// Request DTO
public class CreateUserPreferenceDto
{
    public string Theme { get; set; }
    public bool EmailNotifications { get; set; }
}

// Response DTO
public class UserPreferenceDto
{
    public int Id { get; set; }
    public string Theme { get; set; }
    public bool EmailNotifications { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

---

## Phase 3: Implementation Plan

### 3.1 Step-by-Step Implementation

Each step is designed to be:
- ✅ Atomic (completable in <2 hours)
- ✅ Testable independently
- ✅ Follows TDD approach

---

#### **Step 1**: Database Layer

**Task**: Create database models and migration

**TDD Approach**:
1. Write integration test for repository
2. Run test (should fail - migration doesn't exist)
3. Create Entity model
4. Create migration
5. Update DbContext
6. Run test (should pass)

**Files to Create/Modify**:
- `backend/src/Api/Models/UserPreference.cs`
- `backend/src/Api/Data/AppDbContext.cs`
- `backend/src/Api/Migrations/[timestamp]_AddUserPreferences.cs`

**Tests**:
- `backend/tests/IntegrationTests/UserPreferenceRepositoryTests.cs`

**Acceptance Criteria**:
- [ ] Migration creates table successfully
- [ ] DbContext includes new DbSet
- [ ] Integration test verifies CRUD operations

**Estimated Time**: 1 hour

---

#### **Step 2**: Repository Layer

**Task**: Create repository interface and implementation

**TDD Approach**:
1. Write unit tests for repository interface
2. Create interface definition
3. Implement repository
4. Run tests (should pass)

**Files to Create/Modify**:
- `backend/src/Api/Repositories/Interfaces/IUserPreferenceRepository.cs`
- `backend/src/Api/Repositories/UserPreferenceRepository.cs`

**Tests**:
- `backend/tests/UnitTests/Repositories/UserPreferenceRepositoryTests.cs`

**Acceptance Criteria**:
- [ ] All CRUD operations implemented
- [ ] Async/await properly used
- [ ] All tests passing

**Estimated Time**: 1.5 hours

---

#### **Step 3**: DTOs and Validation

**Task**: Create DTOs and FluentValidation validators

**TDD Approach**:
1. Write tests for validators
2. Create DTO classes
3. Implement validators
4. Run tests (should pass)

**Files to Create/Modify**:
- `backend/src/Api/DTOs/Requests/CreateUserPreferenceDto.cs`
- `backend/src/Api/DTOs/Responses/UserPreferenceDto.cs`
- `backend/src/Api/Validators/CreateUserPreferenceDtoValidator.cs`

**Tests**:
- `backend/tests/UnitTests/Validators/CreateUserPreferenceDtoValidatorTests.cs`

**Acceptance Criteria**:
- [ ] All required field validations
- [ ] Edge case validations
- [ ] Clear error messages

**Estimated Time**: 1 hour

---

#### **Step 4**: Service Layer

**Task**: Implement business logic in service

**TDD Approach**:
1. Write unit tests for service methods
2. Create service interface
3. Implement service
4. Run tests (should pass)

**Files to Create/Modify**:
- `backend/src/Api/Services/Interfaces/IUserPreferenceService.cs`
- `backend/src/Api/Services/UserPreferenceService.cs`

**Tests**:
- `backend/tests/UnitTests/Services/UserPreferenceServiceTests.cs`

**Acceptance Criteria**:
- [ ] Business logic implemented
- [ ] Error handling present
- [ ] Dependency injection configured
- [ ] All tests passing (>80% coverage)

**Estimated Time**: 2 hours

---

#### **Step 5**: API Endpoints

**Task**: Create minimal API endpoints

**TDD Approach**:
1. Write integration tests for endpoints
2. Define endpoints in Program.cs
3. Wire up dependencies
4. Run tests (should pass)

**Files to Create/Modify**:
- `backend/src/Api/Endpoints/UserPreferenceEndpoints.cs`
- `backend/src/Api/Program.cs` (register endpoints)

**Tests**:
- `backend/tests/IntegrationTests/UserPreferenceEndpointsTests.cs`

**Acceptance Criteria**:
- [ ] All CRUD endpoints functional
- [ ] Proper HTTP status codes
- [ ] Validation errors returned correctly
- [ ] All tests passing

**Estimated Time**: 2 hours

---

#### **Step 6**: Frontend API Client

**Task**: Create TypeScript API client functions

**TDD Approach**:
1. Write tests for API client functions (mocked)
2. Implement API client
3. Run tests (should pass)

**Files to Create/Modify**:
- `frontend/src/lib/api/userPreferences.ts`
- `frontend/src/types/userPreference.ts`

**Tests**:
- `frontend/__tests__/unit/api/userPreferences.test.ts`

**Acceptance Criteria**:
- [ ] All API methods implemented
- [ ] Proper TypeScript types
- [ ] Error handling
- [ ] Tests passing

**Estimated Time**: 1 hour

---

#### **Step 7**: Frontend Hooks

**Task**: Create React hooks with TanStack Query

**TDD Approach**:
1. Write tests for hooks
2. Implement hooks
3. Run tests (should pass)

**Files to Create/Modify**:
- `frontend/src/hooks/useUserPreferences.ts`

**Tests**:
- `frontend/__tests__/unit/hooks/useUserPreferences.test.ts`

**Acceptance Criteria**:
- [ ] Query hooks for GET operations
- [ ] Mutation hooks for POST/PUT/DELETE
- [ ] Optimistic updates configured
- [ ] Cache invalidation setup
- [ ] Tests passing

**Estimated Time**: 1.5 hours

---

#### **Step 8**: Frontend Components

**Task**: Create UI components

**TDD Approach**:
1. Write component tests (user behavior)
2. Implement components
3. Run tests (should pass)

**Files to Create/Modify**:
- `frontend/src/components/features/preferences/UserPreferenceForm.tsx`
- `frontend/src/components/features/preferences/UserPreferenceList.tsx`

**Tests**:
- `frontend/__tests__/integration/UserPreferenceForm.test.tsx`

**Acceptance Criteria**:
- [ ] Form validation works
- [ ] Success/error states displayed
- [ ] Loading states handled
- [ ] Accessible (ARIA labels)
- [ ] Tests passing

**Estimated Time**: 2 hours

---

#### **Step 9**: E2E Testing

**Task**: Create end-to-end tests for critical flows

**TDD Approach**:
1. Write E2E test scenarios (Playwright)
2. Verify all flows work end-to-end
3. Fix any integration issues

**Files to Create/Modify**:
- `frontend/__tests__/e2e/userPreferences.spec.ts`

**Tests**:
- Complete user journeys tested

**Acceptance Criteria**:
- [ ] User can create preference
- [ ] User can view preferences
- [ ] User can update preference
- [ ] User can delete preference
- [ ] Error cases handled

**Estimated Time**: 1.5 hours

---

#### **Step 10**: Documentation & Cleanup

**Task**: Update documentation and review code

**Actions**:
1. Run `/review` command
2. Update API documentation
3. Update README if needed
4. Create ADR if architectural decision made
5. Final test run

**Files to Create/Modify**:
- `docs/adr/000X-user-preferences.md` (if applicable)
- `README.md` (if applicable)

**Acceptance Criteria**:
- [ ] All tests passing
- [ ] Coverage >80%
- [ ] No linter errors
- [ ] Documentation updated

**Estimated Time**: 1 hour

---

### 3.2 Total Effort Estimate

| Phase | Time | Complexity |
|-------|------|------------|
| Database & Repository | 2.5h | Medium |
| DTOs & Validation | 1h | Low |
| Service Layer | 2h | Medium |
| API Endpoints | 2h | Medium |
| Frontend API | 1h | Low |
| Frontend Hooks | 1.5h | Medium |
| Frontend Components | 2h | Medium |
| E2E Testing | 1.5h | Medium |
| Documentation | 1h | Low |
| **Total** | **14.5h** | **Medium** |

**Recommended Approach**: Split into 2-3 development sessions

---

## Phase 4: Risk Analysis

### 4.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Strategy] |

Example:
| Breaking existing user auth | High | Low | Comprehensive tests, feature flag |
| Database migration fails | High | Medium | Test migration on copy, rollback script |

---

### 4.2 Testing Strategy

**Test Pyramid**:
```
       /\
      /E2E\      <- 10% (Critical user journeys)
     /------\
    /  INT   \   <- 30% (Component integration)
   /----------\
  /    UNIT    \ <- 60% (Business logic, utilities)
 /--------------\
```

**Coverage Goals**:
- Unit: >80%
- Integration: >70%
- E2E: Critical paths only

---

## Phase 5: Definition of Done

### Feature Complete When:

- [ ] All acceptance criteria met for each step
- [ ] All tests passing (Unit + Integration + E2E)
- [ ] Code coverage >80%
- [ ] No linter/compiler errors
- [ ] `/review` passes with score >8/10
- [ ] Documentation updated
- [ ] Code reviewed by human
- [ ] Tested in dev environment
- [ ] Migration tested and rollback verified

---

## Approval Checkpoint

**This plan is complete and ready for review.**

Before proceeding to implementation:

1. **Review this plan** - Does it make sense?
2. **Challenge assumptions** - Is anything missing?
3. **Adjust scope** - Too large? Too small?
4. **Ask questions** - Anything unclear?

**Once approved, I will execute this plan step-by-step using strict TDD.**

---

**Commands for next steps**:
- `Looks good, proceed with Step 1` - Start implementation
- `Modify [section]` - Adjust plan before starting
- `Break into smaller pieces` - Reduce scope
- `Add more detail to [step]` - Clarify specific step

---

**PLANNING MODE ENDS** when you approve and I begin implementation.

Would you like to proceed, or should I adjust the plan?