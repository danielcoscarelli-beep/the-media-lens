# Setup checklist for the Supabase prototype (ORD-0004, milestone P0)

**For:** M  **Written by:** Steve, 2026-11-17  **Time needed:** about 30 minutes
**Why:** before Steve can build the invite-only prototype (sign-in, saved ratings, real
headlines), a few accounts and settings must exist that only you can create. Nothing here costs
money. Nothing here changes vulgis.com: it keeps showing today's prototype.

Work through the parts in order and tick each box. Where a screen looks different from what is
described, the services have probably renamed a menu; look for the nearest match, or stop and ask
Steve. Steps marked *(unverified)* are ones Steve could not check against current official
documentation.

---

## Before you start: what is safe to share

Some of the values you will see are like a shop's street address (fine to share); others are like
its safe combination (never share). **Never paste a secret into a chat with Steve, Walter or
anyone else, and never into GitHub.** Steve never needs them.

| Value | Safe to send Steve? | Where it stays |
|---|---|---|
| Supabase **Project URL** (`https://<something>.supabase.co`) | **Yes** | Steve's code and Cloudflare settings |
| Supabase **publishable key** (starts `sb_publishable_`), or the older **anon** key | **Yes**. It is designed to be public; the database's access rules protect the data | Steve's code and Cloudflare settings |
| Supabase **secret key** (starts `sb_secret_`) or the older **service_role** key | **No, never** | Only in the Supabase dashboard. It bypasses every access rule |
| Supabase **database password** | **No, never** | Your password manager only |
| Google **Client secret** | **No, never** | Pasted once into Supabase (Part B), nowhere else |
| Google **Client ID** (ends `.apps.googleusercontent.com`) | Yes, but Steve doesn't need it | Supabase |

If you ever think a secret was exposed, tell Steve: it can be replaced ("rotated") in the
dashboard in a minute.

---

## Part A: Supabase account and project (about 5 minutes)

- [ ] **A1.** Go to **supabase.com** and choose **Start your project**. Sign up with your GitHub
  account (`mcoscarelli`) or an email address.
- [ ] **A2.** When asked for an **organization**, create one called **Vulgis** on the **Free** plan.
- [ ] **A3.** Create a **new project**:
  - **Name:** `vulgis-prototype`
  - **Database password:** use the **Generate a password** option, then **save it in your password
    manager straight away**. Do not send it to anyone. Steve does not need it.
  - **Region:** **East US (North Virginia)**. It is in the US (our market) and is the same place as
    the AWS region planned for the full build, which keeps a later move simple. Avoid the general
    "Americas" choice: Supabase says it may place the project outside the US.
  - Leave any other options at their defaults *(unverified: the create-project form may show extra
    security options; defaults are fine)*.
- [ ] **A4.** Wait for the project to finish setting up (usually a minute or two).
- [ ] **A5.** *(Optional, recommended.)* Invite Daniel to the organization (organization settings,
  **Team** tab) so he can review the prototype's setup.

Free-plan facts worth knowing: up to 2 active projects; **a free project is paused after 1 week
with no activity** (it can be restored from the dashboard); 500 MB database; 50,000 monthly active
users. A small tester group fits easily.

---

## Part B: Google sign-in (about 10 minutes)

You will create a "client" in Google Cloud that lets Supabase show the "Sign in with Google" button,
then paste two of its values into Supabase.

**B1. Copy the callback address from Supabase first**

- [ ] In your Supabase project, open **Authentication**, then **Sign In / Providers** (may be called
  **Providers**), then **Google**. Copy the **Callback URL**. It looks like
  `https://<something>.supabase.co/auth/v1/callback`. Keep this tab open.

**B2. Create the Google client**

- [ ] Go to **console.cloud.google.com** and sign in with the Google account that should own this
  (yours is fine; you can add Daniel later).
- [ ] Create a **new project** named `Vulgis prototype` (project picker at the top of the page) and
  make sure it is selected.
- [ ] Open the **Google Auth Platform** (use the search bar at the top). If it offers **Get
  started**, fill in: app name **Vulgis**, your email as the support email, audience
  **External**, your email as the contact email, then accept and create *(wizard wording
  unverified)*.
- [ ] **Branding** (optional): app name and logo shown on Google's consent screen. Skip for now.
- [ ] **Audience:** user type **External**. Leave the publishing status as **Testing**. Google's
  help says that apps asking only for basic sign-in information (name, email, profile) don't need
  each user listed as a test user. If a tester ever sees "access blocked", add their Gmail address
  under **Test users** here (up to 100).
- [ ] **Data Access:** choose to add scopes and make sure these three are selected: `openid`,
  `.../auth/userinfo.email`, `.../auth/userinfo.profile`. Save. Do not add any other scopes.
- [ ] **Clients:** **Create client**.
  - **Application type:** **Web application**. **Name:** `Vulgis Supabase`.
  - **Authorized JavaScript origins:** add `https://vulgis.com` and your Cloudflare Pages address
    (`https://<your-project>.pages.dev`, see Part F). Branch preview addresses don't need to be
    added: sign-in goes through Supabase's address, not the preview's.
  - **Authorized redirect URIs:** paste the **Callback URL** you copied in B1. Exactly that, nothing
    else.
  - Choose **Create**.
- [ ] Copy the **Client ID** and the **Client secret** now. Google may not show the secret again
  (you can always create a new one). Don't save the secret in a document or chat.

**B3. Paste into Supabase**

- [ ] Back in the Supabase **Google** provider panel: switch Google **on**, paste the **Client ID**
  and the **Client secret** into their fields, and **Save**.

Note: Google's consent screen will mention the `<something>.supabase.co` address rather than
vulgis.com. That is normal for the free setup; a custom domain is a paid Supabase add-on and can
wait for the AWS build.

---

## Part C: Sign-in by email code (about 3 minutes)

Email sign-in is switched on by default in Supabase. We will make the email contain a **6-digit
code** as well as the link, because on phones a sign-in link often opens inside the mail app's own
browser, where the sign-in doesn't stick. Typing a code always works.

- [ ] Open **Authentication**, then **Emails** (or **Email Templates**), then the **Magic Link**
  template *(menu name unverified; Supabase calls this template "Magic link or OTP" in some places)*.
- [ ] Replace the message body with:

  ```html
  <h2>Your Vulgis sign-in code</h2>
  <p>Enter this code on the sign-in page: <strong>{{ .Token }}</strong></p>
  <p>Or <a href="{{ .ConfirmationURL }}">sign in with this link</a>.</p>
  <p>The code expires in 1 hour. If you didn't ask for it, ignore this email.</p>
  ```

  Set the subject to `Your Vulgis sign-in code`, then **Save**.

**Important limit:** Supabase's built-in email service only delivers to people on your Supabase
**Team** (Part A5) and only **2 emails per hour** for the whole project. So for now, email codes
work for you and Daniel; **testers should use "Sign in with Google"**. To give testers email codes
too, Supabase needs a separate email-sending service ("custom SMTP"). Several have free plans;
Steve will propose one with its limits for your approval before anything is set up. No action
needed today.

---

## Part D: Addresses Supabase may send people back to (about 3 minutes)

After signing in, Supabase sends the visitor back to the site. It only allows addresses on a list,
which stops anyone from abusing the sign-in to send people elsewhere.

- [ ] Open **Authentication**, then **URL Configuration**.
- [ ] **Site URL:** `https://vulgis.com`
- [ ] **Redirect URLs:** add each of these lines (replace `<your-project>` with your Cloudflare
  Pages project name from Part F1):

  ```
  https://vulgis.com/**
  https://<your-project>.pages.dev/**
  https://*.<your-project>.pages.dev/**
  http://localhost:5173/**
  ```

  The first is the live site, the second the main Cloudflare address, the third every branch
  preview (such as `prototype-supabase.<your-project>.pages.dev`), and the last is for Steve's
  testing on a computer. If people also reach the site as `www.vulgis.com`, add
  `https://www.vulgis.com/**` too.
- [ ] **Save.**

---

## Part E: Lock the door until the invite list exists (1 minute)

- [ ] Open **Authentication**, then **Sign In / Providers**. Turn **off** **Allow new users to sign
  up** and **Save**.

With this off, no new account can be created at all; accounts that already exist can still sign
in. This is the safe setting until Steve's invite list is built in milestone P1. At
that point Steve will add an **invited emails** list to the database plus a check that runs before
any account is created (Supabase calls it a "Before User Created" hook): anyone whose email is not
on the list is refused, whether they use Google or an email code. Steve will then tell you when to
turn sign-ups back on.

---

## Part F: How you will invite testers (after P1; nothing to do today)

When P1 is built, inviting a tester will work like this:

1. In Supabase, open **Table Editor**, then the `invited_emails` table.
2. **Insert row**: the tester's email address (the one they use for Google), and a note such as
   "friend of Daniel". Save.
3. Send the tester the preview address. They choose **Sign in with Google** and are in.

Removing someone: delete their row (Steve will also give you a way to disable an existing
account). Please **don't send tester email addresses to Steve in chat**. They are personal data and
belong only in the database, not in our GitHub files.

Reminder from ORD-0004: **don't invite anyone outside the team until a lawyer has reviewed showing
real headlines (P3, question Q6).**

---

## Part G: Cloudflare Pages preview addresses (about 5 minutes)

vulgis.com is built by Cloudflare Pages from your fork `mcoscarelli/the-media-lens`. Any branch
other than `main` gets its own **preview address** automatically, so the prototype can be tested
without touching vulgis.com.

**G1. Find your Pages project name**

- [ ] In the Cloudflare dashboard open **Workers & Pages** and select the project that serves
  vulgis.com. Its address is `<your-project>.pages.dev`. **Send that address to Steve** (it is not
  secret).

**G2. How the preview address will look**

- A branch named `prototype/supabase` is published at
  **`https://prototype-supabase.<your-project>.pages.dev`** (Cloudflare lowercases the name and
  turns `/` into `-`). That address always shows the newest version of the branch.
- Each individual build also gets a random address like `https://3f2a1b.<your-project>.pages.dev`.
- Check that preview builds are on: **Settings**, then **Builds & deployments** (may be called
  **Build**), then the branch control for preview deployments. **All non-Production branches** (the
  default) is fine.
- Preview addresses are public by default. That's OK: the prototype itself will show only a sign-in
  page to anyone not invited. **Don't** turn on Cloudflare's "access policy" for previews; it would
  lock out testers who don't have a Cloudflare account.

**G3. Add the two prototype settings for previews only**

- [ ] In the Pages project open **Settings**, then **Variables and Secrets** (older Cloudflare pages
  call this **Environment variables**).
- [ ] Choose the **Preview** environment (not Production), and add two plain-text variables:

  | Variable name | Value |
  |---|---|
  | `VITE_SUPABASE_URL` | your Supabase Project URL (Part H) |
  | `VITE_SUPABASE_ANON_KEY` | your Supabase **publishable** key (Part H) |

  Steve's code reads the publishable key under the name `VITE_SUPABASE_ANON_KEY`. Both values are
  safe to show; they end up inside the website anyway. **Never** put the secret key here.
- [ ] Save. A setting is picked up by the **next** build, so if a preview was built before you
  added it, Steve will push a new commit (or you can choose **Retry deployment** on that build).

**G4. Getting the branch into your fork**

The branch `prototype/supabase` lives in Daniel's repository. Cloudflare only watches your fork, so
the branch must be copied there. The easiest way: in the new chat (Part I), tell Steve he may
attach `mcoscarelli/the-media-lens` to the session, and he will push the branch to your fork. He
will ask before doing so.

---

## Part H: The values to send Steve (2 minutes)

- [ ] In Supabase open **Project Settings**, then **API Keys** (the **Connect** button at the top of
  the project also shows them).
- [ ] Copy the **Project URL** and the **publishable key** (`sb_publishable_...`). If you only see
  the older **anon** key, that one is fine too, but Supabase says the old anon and service_role keys
  are being retired by the end of 2026, so prefer the publishable key.
- [ ] Send Steve, in the new chat (Part I), a message like this:

  ```
  Supabase project URL: https://xxxx.supabase.co
  Publishable key: sb_publishable_xxxx
  Cloudflare Pages address: https://xxxx.pages.dev
  Parts A-G done (or: these steps didn't work: ...)
  ```

  Nothing else. **Not** the secret key, **not** the database password, **not** the Google client
  secret.

---

## Part I: Let this Claude workspace install packages (about 3 minutes)

**The problem:** this Claude workspace currently **cannot reach the npm registry**, the online
library from which the project's building blocks (React, Vite, and the Supabase connector) are
downloaded. Steve checked on 2026-11-17: the connection is refused. Without it Steve can't build
or test anything, so any code he wrote would be unchecked.

**What to do:**

- [ ] Open a new Claude Code session at **claude.ai/code**. Under the message box there is an
  **environment selector**. Open it and edit the environment you use for this repository (pencil or
  settings icon next to it).
- [ ] Set **Network access** to **Trusted**. That allows the common package registries (npm
  included) and GitHub, and nothing else. **Full** also works but opens every website, which isn't
  needed. If you prefer **Custom**, tick **Also include default list of common package managers**.
  Save.
- [ ] If the environment is listed under **Organization** (shared by your company's Claude
  account), only an **Owner** can change it: **Admin settings**, then **Cloud environments**. On
  Team and Enterprise plans, ask your Owner if you aren't one.
- [ ] If you use Claude through the desktop app's Cowork instead, the equivalent setting is under
  **Settings**, then **Capabilities** (on Team and Enterprise plans, the admin sets it in
  **Organization settings**, then **Capabilities**): set the domain allowlist to **Package managers
  only**.
- [ ] **Continue in a NEW chat** with Steve. Anthropic's documentation says running sessions pick up
  the change within about a minute, but a new chat is the reliable way to start clean. Begin it
  with: "Steve, continue ORD-0004. Network access is now enabled." and the values from Part H.

Steve can't see these settings himself, so the exact labels on your screen may differ slightly from
the ones above.

---

## What happens next

Once Steve has the values from Part H and the workspace can install packages, he starts **P1: the
login gate** on branch `prototype/supabase`: a sign-in page for everyone not signed in, Google and
email-code sign-in, and the invite list from Part E/F. You will get a preview address to try it.

---

## Sources (checked 2026-11-17)

- Supabase, *Sign in with Google*: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase, *Redirect URLs* (Site URL, wildcards): https://supabase.com/docs/guides/auth/redirect-urls
- Supabase, *API keys* (publishable/secret keys; legacy anon/service_role keys deprecated by end of 2026): https://supabase.com/docs/guides/api/api-keys
- Supabase, *General configuration* ("Allow new users to sign up"): https://supabase.com/docs/guides/auth/general-configuration
- Supabase, *Passwordless email sign-in* (`{{ .Token }}`, 60-second and 1-hour limits): https://supabase.com/docs/guides/auth/auth-email-passwordless
- Supabase, *Custom SMTP* (built-in email: team members only, 2 per hour): https://supabase.com/docs/guides/auth/auth-smtp
- Supabase, *Before User Created hook*: https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook
- Supabase, *Available regions*: https://supabase.com/docs/guides/platform/regions
- Supabase, *Pricing* (free plan limits, pausing): https://supabase.com/pricing
- GuardLayer, *"Signups not allowed for this instance"* (existing accounts still sign in when sign-ups are off; third-party article): https://www.guardlayer.io/blog/supabase-signups-not-allowed-for-this-instance
- Google Cloud Help, *Manage App Audience* (External/Testing, 100 test users, basic scopes): https://support.google.com/cloud/answer/15549945
- Cloudflare, *Preview deployments* (branch alias format, access policy): https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Cloudflare, *Branch build controls*: https://developers.cloudflare.com/pages/platform/branch-build-controls/
- Cloudflare, *Build configuration* (environment variables location): https://developers.cloudflare.com/pages/configuration/build-configuration/
- Claude Code, *Configure cloud environments* (network access levels, environment selector): https://code.claude.com/docs/en/cloud-environments
- Claude, *Network access for shell commands* (Cowork, Settings > Capabilities): https://claude.com/docs/cowork/guide/network-access

## What Steve could not verify

- Exact labels in Supabase's create-project form, the email-template menu, and the Google Auth
  Platform "Get started" wizard (described from documentation, not seen on screen).
- Whether Cloudflare's dashboard currently says **Variables and Secrets** or **Environment
  variables** (its own documentation uses the latter), and the exact path to preview branch
  controls.
- Whether Google will show the client secret again after creation.
- That invited users can always sign in with Google while "Allow new users to sign up" is off
  (supported by a third-party article, not by Supabase's own documentation). Steve will test this
  in P1; the "Before User Created" check is the planned invite mechanism either way.
- Whether a "Before User Created" hook is available on the free plan (its documentation doesn't
  say). If it isn't, P1 falls back to keeping sign-ups off and creating testers' accounts in advance.
- The Claude settings screens: Steve can't see M's account settings, and the labels come from
  Anthropic's documentation.
