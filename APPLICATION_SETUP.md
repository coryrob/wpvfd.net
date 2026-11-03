# Membership applications

The join links open `application.html`. Applicants can download the fillable PDF,
or complete the online form, electronically sign the authorizations, and attach a
driver license copy plus supporting documents. The Azure Function sends the
completed PDF, an appendix containing full answers, and uploaded documents to
**officers@wpvfd.net**. Replying to that email addresses the applicant.

## Enable online delivery

This implementation uses SMTP2GO for email delivery and Cloudflare Turnstile for
spam prevention. No email is sent until the SMTP password and Turnstile keys are
configured. The server defaults match the supplied SMTP settings:

- Server: `mail.smtp2go.com`
- Port: `587`
- Encryption: required STARTTLS, with TLS certificate verification
- SMTP authentication username: `operations@wpvfd.net`
- Sender: `WPVFD Applications <operations@wpvfd.net>`
- Recipient: `officers@wpvfd.net`

1. Confirm that `operations@wpvfd.net` is an enabled SMTP user in SMTP2GO and that
   the sender/domain is verified. Use that SMTP user's password, which may differ
   from the mailbox password. See [SMTP2GO setup](https://www.smtp2go.com/setup/).
2. Create a [Turnstile widget](https://developers.cloudflare.com/turnstile/get-started/)
   for `wpvfd.net` and `www.wpvfd.net`. Add the Azure preview hostname too if testing
   a preview deployment.
3. In the existing **Azure Static Web App → Settings → Environment variables**
   (or Configuration), add these application settings to the intended environment:

   | Setting | Value |
   | --- | --- |
   | `SMTP_PASSWORD` | SMTP2GO password for `operations@wpvfd.net` (required) |
   | `SMTP_HOST` | Optional; defaults to `mail.smtp2go.com` |
   | `SMTP_PORT` | Optional; defaults to `587` (STARTTLS) |
   | `SMTP_USERNAME` | Optional; defaults to `operations@wpvfd.net` |
   | `APPLICATION_FROM_EMAIL` | Optional; defaults to `WPVFD Applications <operations@wpvfd.net>` |
   | `TURNSTILE_SITE_KEY` | Public widget site key |
   | `TURNSTILE_SECRET_KEY` | Private widget secret key |

   Set secrets directly in Azure. Do not put passwords or keys in HTML, JavaScript,
   Git, or chat. The screenshot does not contain the SMTP password. Resend settings
   are no longer used and can be removed from Azure if previously configured.
   The recipient is fixed on the server as `officers@wpvfd.net`.
4. Deploy through the existing GitHub Actions workflow. Its `api_location` now
   points at `api`, and `staticwebapp.config.json` selects Node.js 22.
5. Submit an approved test application using synthetic information and a test
   document. Confirm that officers receive the PDF and attachments, that reply-to
   addresses the applicant, and that every page is readable. Delete the test
   application after verification. Live email delivery has not been tested locally.

Until setup is complete, the page disables online submission and provides the
fillable download and the department phone number. A successful API response means
the mail provider accepted the email, not that the message reached the inbox.
Check provider delivery logs if a message is missing.

## Local checks

With Node.js 22 and npm installed:

```powershell
npm --prefix api ci
node --test tests/applications.test.cjs
node --check js/application.js
```

Tests mock the email and Turnstile services; they do not send email. Use the Azure
Static Web Apps CLI with `--api-location api` for a full local preview after setting
local secrets in an ignored `api/local.settings.json`. A plain static file server
can display the form and PDF but cannot send applications.

## Packet and data handling

- Original: `Documents/WPFD_Fire_Department_Application_082026.pdf`.
- Download: `Documents/WPFD_Application_Fillable.pdf`.
- Run `node scripts/build-application.cjs` after changing field definitions or the
  original packet. This regenerates the fillable download, API template, and both
  field schemas. The page 5–7 transcription in `js/application-consents.js` must
  also be updated if the source packet's consent wording changes.
- The original department-use-only page remains blank. Applicants complete pages
  3–7; the informational pages and all original authorization text are preserved.
- Typed signatures and required acknowledgment checkboxes are included in the
  submission. The department can request handwritten originals if needed.
- Standard PDF fonts normalize unsupported characters. Original Unicode answers
  are preserved in the plain-text email.
- The website does not save drafts, uploads or applications in local storage or a
  database. Data passes through Azure, Turnstile (security token), and SMTP2GO (email
  and attachments). Apply the department's access and retention practices to the
  officers mailbox and mail-provider logs.
- Uploads are limited to six PDF/PNG/JPEG files totaling 6 MB. File signatures and
  base64 are checked server-side; this is not a malware scanner. Long answers also
  appear in the PDF appendix so the original packet's small fields lose no content.
- Retrying unchanged answers and files uses the same email Message-ID for tracing.
  SMTP does not guarantee duplicate suppression: a retry after an uncertain
  delivery may send a duplicate. A changed application or reloaded page creates a
  new message reference.
