---
name: Email Management
description: Native skill for autonomously reading, parsing, categorizing, and drafting emails via IMAP/SMTP.
---

# Email Management Skill

1. You are equipped to interact with the user's email inbox using standard IMAP and SMTP protocols.
2. When asked to "check emails", authenticate using the provided `.env` credentials (`EMAIL_USER`, `EMAIL_APP_PWD`), connect to the IMAP server (e.g., `imap.gmail.com`), and retrieve the last 10 unread emails.
3. Once retrieved, analyze the emails and categorize them into:
   - Urgent Action Required
   - Subscription / Newsletter
   - General Inbox
4. If asked to "draft a reply" or "send an email", use standard `smtplib` connected to `smtp.gmail.com:587`.
5. Always generate a clear, professional, and concise draft for the user to review before dispatching it locally.
