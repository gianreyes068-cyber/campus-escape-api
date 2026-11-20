# Development journey: [your game title] API

Student: [your name] · Section: [3-1 or 3-2] · Group: [group name]

One entry per milestone, written the week you did it. Newest at the bottom.

## M1 · Accounts, passwords and tokens
- Dates worked: Nov 20, 2026 · Time spent: 2 hours and 15 minutes
- Goal: Add secure account registration and login using password hashes and JWT bearer tokens.
- What I built: Added POST /api/v1/auth/register, POST /api/v1/auth/login, and GET /api/v1/auth/me. Added authentication validation, service, controller, and routes; connected password hashing and JWT helpers; hid password hashes from account responses; updated demo seed credentials and the Postman collection to use bearer tokens.
- Evidence: [add the PR URL if required] · c5b3107 (kit setup) · [add the M1 implementation commit hash after committing]
- Problem I hit: The Week 11 Postman collection still sent X-Demo-User, and session requests used a fixed local URL and question-set ID. After Week 12 authentication was added, requests failed or ran in the wrong order.
- How I solved it: Updated protected requests to log in and use bearer tokens, used {{baseUrl}} and the question-set ID created earlier in the collection, then moved the delete request after the session requests. The Week 12 automatic check finished with 38 passed and 0 failed.
- Decision I made and why: Public registration always assigns the PLAYER role and ignores any role sent by the client, preventing new users from granting themselves higher privileges. The cost is that role changes need a separate controlled flow.
- Changes to my design set: No ERD change was needed because the Week 11 users migration already contained password_hash. The OpenAPI contract documents the register, login, and me endpoints.
- What I would explain to a classmate: A JWT is signed, not encrypted, so its payload can be read. Passwords and secret values should never go in the token.

## M2 · The question bank

## M3 · Gameplay

## M4 · Automated tests and server preparation

## M5 · API documentation and deployment

## M6 · The SE1 portfolio and the release

## M7 · The Test Report
