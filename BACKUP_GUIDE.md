# PostgreSQL/Supabase Manual Backup & Restore Guide

## Why Backups Matter
- Protects against data loss (accidents, bugs, attacks, hardware failure)
- Lets you restore your app to a working state
- Required for compliance in many businesses

---

## 1. How to Make a Manual Backup (pg_dump)

### Step 1: Get Your Database Connection String
- In Supabase: Go to Project → Settings → Database → Connection string
- Format: `postgres://user:password@host:port/dbname`

### Step 2: Install PostgreSQL Tools
- Download from https://www.postgresql.org/download/
- Ensure `pg_dump` is in your system PATH

### Step 3: Run the Backup Command
- Open a terminal (Command Prompt, PowerShell, or Terminal)
- Run:
  - **Linux/macOS:**
    ```sh
    pg_dump "postgres://user:password@host:port/dbname" > backup-$(date +%F).sql
    ```
  - **Windows:**
    ```sh
    pg_dump "postgres://user:password@host:port/dbname" > backup-YYYY-MM-DD.sql
    ```
- Replace the connection string and filename as needed

### Step 4: Store the Backup File Safely
- Save the `.sql` file in a secure location (cloud, external drive, etc.)

---

## 2. How to Restore a Backup (psql)

- Open a terminal
- Run:
  ```sh
  psql "postgres://user:password@host:port/dbname" < backup-YYYY-MM-DD.sql
  ```
- This will restore your database to the state of the backup

---

## 3. Best Practices
- Automate backups (daily/weekly) with scripts or Task Scheduler/cron
- Store backups offsite or in the cloud
- Regularly test restoring backups
- Monitor for backup failures
- Secure backup files (encryption, access controls)

---

## 4. Supabase Managed Backups
- Paid Supabase plans include automatic daily backups
- Check your project dashboard under Database → Backups
- You can download or restore from these backups if available

---

**Tip:** Always test your restore process before you need it in production!
