
# Full stack Technical Challenge

## Welcome!

Thank you for taking the time to complete this technical challenge. We're excited to get to know you through your code, your thinking, and how you approach full stack application design.

This exercise is not just about building features — it's about understanding your engineering mindset, design skills, and how you communicate your decisions across both frontend and backend development.

We know your time is valuable, and we truly appreciate your interest in joining our Data & AI Engineering team. Let's dive in!

---

# Full Stack Technical Challenge
## Modern Javascript framework + Python

### Title
Design and Build a Full Stack Application for Clinical Trial Data Dashboard

---

## Context

You've joined a consultancy working with life sciences companies. One client is conducting a clinical trial and needs a full stack application to help researchers visualize and manage key trial metrics and participant data.

Your task is to design and implement the first version of this application — with future needs in mind (e.g., integration with AI agents, advanced analytics, or regulatory reporting systems).

You'll define what to prioritize, what technologies to use (within the React and Python ecosystems), and how to structure both your frontend and backend code.

---

## Time Limit: 4 hours

We do not expect a fully polished product — this challenge is designed to evaluate your technical judgment, architecture thinking, and communication of trade-offs.

Important: If you don't complete the full implementation within 4 hours, please include planning documentation (architecture diagrams, ADRs, implementation roadmap, or technical design notes) that we can discuss during the technical interview.

This helps us understand your thought process and approach to complex problems.

---

## Objective

Design and implement a full stack application that can:

- Build a Modern Javascript framework-based dashboard for visualizing trial data
- Expose a Python API for managing trial participants and metrics
- Implement API-centric architecture connecting frontend and backend
- Include authentication and access control
- Follow good coding, testing, and documentation practices
- Be runnable in a containerized local environment
- Document your decisions clearly

You choose the depth and scope of implementation based on your own assessment of what's most important.

---

# Functional Requirements

Your system should support basic operations on participants, for example:

1. Create participant
2. View all participants
3. Retrieve single participant
4. Optional: Update/delete participant

Frontend dashboard should include:

1. Authentication page
2. Participants list view
3. Metrics dashboard
4. Add participant form

Participant data should include:

{
  "participant_id": "UUID",
  "subject_id": "P001",
  "study_group": "treatment",
  "enrollment_date": "YYYY-MM-DD",
  "status": "active",
  "age": 45,
  "gender": "F"
}

Possible values:

- study_group: treatment or control
- status: active, completed, withdrawn
- gender: F, M, Other

---

# Technical Requirements

You must use Python but can choose the rest of your stack.

For the frontend, we recommend you to use React but you can also choose any other modern javascript framework.

We suggest React with modern hooks, FastAPI or Flask, and PostgreSQL or SQLite — but feel free to justify alternatives.

## What we expect to see covered

### 1. API Design
RESTful routes, clear structure, input validation

### 2. React Implementation
Modern hooks, component structure, state management

### 3. Architecture & Integration
Clean separation between frontend/backend, API-centric design

### 4. Authentication & Authorization
Secure routes, protected components (your method of choice)

### 5. Error Handling & Logging
Show how you manage errors, exceptions, user feedback

### 6. Testing
Show understanding of testing across the stack

### 7. Security
Show awareness of common risks, validate inputs, secure API calls

### 8. Code Quality
Clear naming, comments, modular design, separation of concerns

### 9. Containerization
Docker setup for both frontend and backend

### 10. CI/CD Awareness
Show understanding of build processes and deployment

---

# Nice to Have

- Experience with state management (Redux, Context API, Zustand)
- Familiarity with modern frontend patterns and testing libraries
- Knowledge of Docker Compose for full-stack orchestration
- Understanding of cloud deployment concepts
- Knowledge of observability and monitoring practices

---

# What to Include in Your README

The README is critical to understanding how you approach full stack development.

It should include:

1. How to run the app (locally or with Docker)
2. How to test it (both frontend and backend)
3. Technologies used and why you chose them
4. What parts you completed and what you skipped
5. What you'd improve or add with more time
6. Any trade-offs you made
7. AI tools used (if any) and how they assisted your development
8. Optional: High-level architecture diagram or component structure overview
9. Planning documentation (if incomplete): ADRs, design decisions, implementation roadmap

---

# Evaluation Focus

We will assess your submission across the following:

### 1. Design Thinking
Do you approach problems thoughtfully and realistically?

### 2. Technical Implementation
Is what's built robust, modular, testable across the stack?

### 3. Architecture
Are the components well-separated and extensible?

### 4. Security & Reliability
Is there care around errors, auth, inputs, logging?

### 5. React Proficiency
Modern patterns, hooks, component design, state management?

### 6. API Design
Clean, RESTful, well-documented backend services?

### 7. Testing Strategy
Are there signs of structured testing knowledge?

### 8. Communication
Can you clearly explain your decisions and priorities?

---

# AI Tools & Coding Assistance

We're totally cool with you using AI tools!

Whether it's GitHub Copilot, ChatGPT, Claude, or any other coding assistant — use whatever helps you be productive.

Modern development includes these tools, and we want to see how you work with them.

## What we care about

- You understand the code: Be ready to explain every part of your solution
- Technical decisions are yours: We want to see your reasoning for model choices, architecture decisions, and trade-offs
- Transparency is key: If you used AI assistance heavily, mention it in your README
- Share your prompts: If you have interesting prompts that guided your AI assistant, feel free to include them — we love seeing effective prompt engineering!

Bottom line: Use AI to accelerate your work, but make sure you can own and explain the entire solution during our discussion.

---

# Submission Instructions

When finished, please follow these steps to submit your solution:

1. Push your code to a public GitHub repository (or private repo + invite reviewer)
2. Ensure the README.md is complete and clear
3. Include instructions in the README to:
   - Run the service via Docker
   - Run your test suite
   - Authenticate and call at least one protected route
4. If using a private repo, please grant access to the following GitHub account(s):
   - MIGx-user
5. Submit the GitHub link via email

---

# Thank You

We truly appreciate the time and effort you're putting into this.

We're looking forward to reviewing your solution and discussing it further with you during the interview.

Good luck — and have fun!