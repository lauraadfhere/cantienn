# Backend Parse Schema Patch

The schema patch is idempotent: it creates missing classes and adds or updates the fields below on existing classes.

## Current classes and fields

| Class | Application fields |
| --- | --- |
| `_User` | `fullName` (String), `role` (String) |
| `Articles` | `title`, `summary`, `url`, `category`, `publishedAt`, `status` (String) |
| `Publications` | `title`, `summary`, `url`, `category`, `publishedAt`, `status` (String) |
| `Books` | `title`, `summary`, `url`, `category`, `publishedAt`, `status` (String) |
| `Journals` | `title`, `summary`, `url`, `category`, `publishedAt`, `status` (String) |
| `CV` | `cv_json` (String) |
| `Orders` | `name`, `email`, `company`, `service`, `budget`, `message`, `mediaType`, `lang`, `status` (String); `attachments` (Array) |
| `Contacts` | `name`, `email`, `phone`, `subject`, `message`, `status`, `ip_address`, `user_agent` (String); `privacy_agreement` (Boolean) |

Parse-managed fields such as `objectId`, `createdAt`, `updatedAt`, and the built-in `_User` fields are not recreated by the patch.

## Status values

- Content (`Articles`, `Publications`, `Books`, `Journals`): `draft`, `published`, `archived`
- `Orders`: `new`, `pending`, `in_progress`, `completed`, `cancelled`
- `Contacts`: `new`, `read`, `replied`, `closed`

## Apply the patch

Configure `PARSE_SERVER_URL`, `PARSE_APP_ID`, and `PARSE_MASTER_KEY` in `backend/.env`, then run from the repository root:

```bash
npm run parse:schema
```

The command patches the remote schema and exports a snapshot under `exports/`. Back up the current schema and data before applying changes, and rotate any credential that has been exposed in source control or shared documentation.

The Parse master key is privileged and server-only. Never place it in frontend code, any `NEXT_PUBLIC_*` variable, logs, exports, or committed files.
