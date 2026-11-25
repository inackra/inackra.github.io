# Google Sheets enquiry delivery

The UI includes name, email, message and project/role fields. Until the endpoint is connected it opens an email draft and never claims to have saved an enquiry.

Owner setup:

1. Create a private Google spreadsheet. Open Extensions → Apps Script and paste `integrations/google-sheets/Code.gs`.
2. In Project Settings → Script properties, set `SPREADSHEET_ID` to the spreadsheet ID.
3. Run `setup` once as the owner to create the Enquiries tab and headers. Review the Google permission request yourself.
4. Deploy → New deployment → Web app. Execute as yourself and permit public access for visitor submissions. Keep the spreadsheet private.
5. Copy the resulting `/exec` deployment URL. Add it as repository variable `VITE_ENQUIRY_ENDPOINT` in GitHub Settings → Secrets and variables → Actions → Variables. It is a public endpoint, not a secret or an OAuth token.
6. Rerun Deploy Pages. Submit a test message on https://inackra.work, verify the row and the client receipt. Delete the test row normally afterward if desired.

The frontend sends a normal POST to an isolated iframe and requires a matching unique request ID from a Google script origin before displaying success. It times out honestly if it receives no acknowledgement. The handler only appends rows, validates lengths, escapes spreadsheet formula inputs, checks a honeypot, deduplicates request IDs and limits repeated submissions from one email. These simple checks do not replace dedicated abuse protection if traffic increases. The handler’s acknowledgement targets the production origin only.

Sending enquiries directly to Google Sheets requires this one-time account authorization. No Google credentials should be pasted into chat, stored in this repository or exposed to visitors.

Constructor form contact: one field takes an email or a Telegram username (`@name`, `t.me/name` or a bare name). The sheet script only accepts an email, so a Telegram contact is sent as `<name>@t.me` in the Email column and the real handle goes into the message as `Telegram: @name (https://t.me/name)`. Reply to those leads in Telegram, not by email.
