---
name: spec
description: Generate detailed technical specification using reasoning model
arguments: Feature description
---

# Technical Specification Generator

Feature: **$ARGUMENTS**

## Instructions

This command helps you generate a detailed technical specification using a reasoning model (like o1) before implementation.

### Process:

1. **Copy the prompt below** to a reasoning model (ChatGPT o1, Claude with extended thinking, etc.)
2. **Save the output** as `docs/specs/[feature-name]-spec.md`
3. **Return to Claude Code** and use `/plan` to create implementation plan

---

## Prompt for Reasoning Model

```
Generate a comprehensive technical specification for the following feature:

**Feature**: $ARGUMENTS

**Tech Stack**:
- Backend: ASP.NET Core 9, Entity Framework Core, SQLite/PostgreSQL
- Frontend: React 19, TypeScript, TanStack Query, Tailwind CSS
- Testing: xUnit, Vitest, Playwright

**Current Architecture**:
- Backend: Clean Architecture (Endpoints → Services → Repositories)
- Frontend: Component-Service Pattern
- Development: Test-Driven Development (TDD)

**Required Specification Sections**:

### 1. Feature Overview
- Clear description of what this feature does
- User stories (As a [user], I want [goal] so that [benefit])
- Success criteria

### 2. Functional Requirements
- Detailed list of all functional requirements
- User interactions and expected behaviors
- Edge cases and error scenarios

### 3. Non-Functional Requirements
- Performance requirements
- Security requirements
- Scalability considerations
- Accessibility requirements

### 4. Data Model
- Database schema changes (SQL DDL)
- Entity relationships
- Data validation rules
- Migration strategy

### 5. API Design
- Endpoint definitions (method, path, description)
- Request DTOs with validation rules
- Response DTOs
- HTTP status codes for each scenario
- Error response formats

### 6. Frontend Design
- Component hierarchy
- State management approach
- Data fetching strategy (TanStack Query usage)
- Form validation
- User feedback (loading, success, errors)

### 7. Testing Strategy
- Unit test scenarios (backend & frontend)
- Integration test scenarios
- E2E test scenarios
- Test data requirements

### 8. Security Considerations
- Authentication/authorization requirements
- Input validation requirements
- Data protection needs
- OWASP Top 10 considerations

### 9. Implementation Phases
- Break feature into logical implementation phases
- Dependencies between phases
- Risk assessment for each phase

### 10. Acceptance Criteria
- Clear, testable acceptance criteria
- Performance benchmarks
- User experience criteria

**Output Format**: Markdown document suitable for saving as spec.md

Please be thorough, specific, and consider edge cases.
```

---

## After Getting Specification

1. **Save the spec** to `docs/specs/[feature-name]-spec.md`

2. **Generate implementation plan**:
   ```
   /plan Read @docs/specs/[feature-name]-spec.md and create detailed implementation plan
   ```

3. **Begin TDD workflow**:
   ```
   /tdd [Start with first phase from plan]
   ```

---

## Example Usage

```bash
# Generate spec for authentication feature
/spec User authentication with JWT tokens and refresh

# [Copy prompt to reasoning model, get output]
# [Save output to docs/specs/authentication-spec.md]

# Generate implementation plan
/plan Read @docs/specs/authentication-spec.md and create plan

# Execute plan
[Review plan, then start implementation]
```

---

## Benefits of This Approach

1. ✅ **Comprehensive thinking** before coding
2. ✅ **Catches edge cases** early
3. ✅ **Clear requirements** prevent scope creep
4. ✅ **Better estimates** from detailed breakdown
5. ✅ **Documentation** generated automatically
6. ✅ **Alignment** between team members

---

This specification-first approach significantly reduces wasted effort and rework.