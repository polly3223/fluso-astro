import { Link } from "react-router-dom";
import { cn } from "@/utils/styles";
import { CARD, SUBTITLE, TITLE } from "@/components/cardChrome";

const mono = "font-(family-name:--font-mono)";

const sectionH = cn(
  mono,
  "text-[11px] font-medium uppercase tracking-[0.18em] text-(--text-muted)",
  "sticky top-[calc(var(--nav-h)_+_24px)] self-start pt-1",
  "max-md:static max-md:pt-0",
);

const sectionBody = cn(
  "text-[15.5px] leading-[1.65] text-(--text-primary) max-md:text-[14.5px]",
  "[&>h2]:mb-3 [&>h2]:text-[23px] [&>h2]:font-medium [&>h2]:tracking-[-0.015em]",
  "[&>h3]:mt-5 [&>h3]:mb-2 [&>h3]:text-[16.5px] [&>h3]:font-medium [&>h3]:tracking-[-0.005em] [&>h3]:text-(--text-primary)",
  "[&>p]:mb-3.5 [&>p]:text-(--text-primary) [&>p]:opacity-86 [&>p:last-child]:mb-0",
  "[&>ol]:mb-3.5 [&>ol]:pl-4.5 [&>ol]:text-(--text-primary) [&>ol]:opacity-86",
  "[&>ul]:mb-3.5 [&>ul]:pl-4.5 [&>ul]:text-(--text-primary) [&>ul]:opacity-86",
  "[&_li]:mb-1.5",
  "[&_a]:border-b [&_a]:pb-px [&_a]:text-(--text-primary)",
  "[&_a]:transition-opacity [&_a]:duration-180 [&_a]:ease-[ease] [&_a:hover]:opacity-70",
);

const callout = cn(
  "mb-4 rounded-r-md border-l-2 border-l-[#c4633c] bg-[rgba(196,99,60,0.055)] px-4.5 py-3.5",
  "text-[14.5px] leading-[1.6] text-(--text-primary) opacity-92",
  "[&>p]:mb-2.5 [&>p:last-child]:mb-0",
  "[&_strong]:font-medium [&_strong]:text-(--text-primary)",
);

const tableWrap = cn(
  "my-3.5 overflow-x-auto rounded-lg border border-(--border-soft)",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-[13.5px] [&_table]:leading-normal max-md:[&_table]:text-[12.5px]",
  "[&_thead_th]:border-b [&_thead_th]:border-(--border-soft) [&_thead_th]:bg-[rgba(12,12,12,0.025)] [&_thead_th]:px-3.5 [&_thead_th]:py-3 [&_thead_th]:text-left [&_thead_th]:align-top [&_thead_th]:font-(family-name:--font-mono) [&_thead_th]:text-[10.5px] [&_thead_th]:font-medium [&_thead_th]:uppercase [&_thead_th]:tracking-[0.12em] [&_thead_th]:text-(--text-muted)",
  "[&_tbody_td]:border-b [&_tbody_td]:border-(--border-soft) [&_tbody_td]:px-3.5 [&_tbody_td]:py-3 [&_tbody_td]:align-top [&_tbody_td]:text-(--text-primary) [&_tbody_td]:opacity-88",
  "[&_tbody_td:first-child]:font-medium [&_tbody_td:first-child]:opacity-100",
  "[&_tbody_tr:last-child_td]:border-b-0",
  "max-md:[&_thead_th]:px-[11px] max-md:[&_thead_th]:py-2.5 max-md:[&_tbody_td]:px-[11px] max-md:[&_tbody_td]:py-2.5",
);

const divider = "col-span-full my-[clamp(24px,3vw,40px)] border-b border-(--border-soft)";

const legalMeta = cn(
  mono,
  "mt-4.5 inline-flex items-center gap-2.5",
  "text-[11px] uppercase tracking-[0.12em] text-(--text-muted)",
);

const legalBody = cn(
  "mt-[clamp(48px,6vw,80px)] grid gap-[clamp(24px,3vw,56px)]",
  "grid-cols-[minmax(180px,0.7fr)_minmax(0,2fr)]",
  "border-t border-(--border-soft) pt-[clamp(40px,4vw,60px)]",
  "max-md:grid-cols-1 max-md:gap-3.5",
);

export default function Privacy() {
  return (
    <div className="relative z-2 isolate flex flex-col gap-4 overflow-x-clip p-4">
      <section className={cn(CARD, "scroll-mt-[calc(var(--nav-h)+18px)]")}>
        <main
          data-nav-light
          className={cn(
            "theme-light relative flex flex-col bg-(--card-bg) text-(--text-primary)",
            "px-[clamp(28px,4.4vw+8px,80px)] pb-[clamp(48px,6vh,80px)] pt-[calc(var(--nav-h)+clamp(52px,6.5vh,88px))]",
            "max-md:px-[clamp(20px,5vw,28px)]",
          )}
        >
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Privacy Policy</span>*/}
          <h1 className={TITLE}>
            How Fluso
            <br />
            handles your data.
          </h1>
          <p className={cn(SUBTITLE, "max-w-[64ch]")}>
            Fluso reads content from the workplace tools you connect — email,
            calendar, Slack, and others — to power AI assistance. This content
            is processed transiently by the AI during each session and is not
            stored by PREM after processing. Your account data and usage
            information are stored securely in the EU. This policy explains
            exactly what we collect, what we do not retain, and your rights.
          </p>
          <div className={legalMeta}>
            PREM SA <span className="opacity-40">·</span> Version 1.1{" "}
            <span className="opacity-40">·</span> Effective 13 May 2026{" "}
            <span className="opacity-40">·</span> Last updated 13 August 2026
          </div>

          <div className={legalBody}>
            <div className="contents">
              <div className={sectionH}>01 / Who we are</div>
              <div className={sectionBody}>
                <h2>PREM SA</h2>
                <p>
                  <strong>PREM SA</strong> ("PREM", "we", "us", "our") is a
                  company incorporated under Swiss law at Crocicchio Cortogna
                  6, 6900 Lugano, Switzerland (CHE-371.240.335). We operate
                  Fluso, an AI-powered workplace productivity service.
                </p>
                <p>
                  <strong>EU Representative (GDPR Art. 27):</strong> PREM AI
                  S.r.l., Via Giuseppe Verdi 12, 70017 Putignano, Bari, Italy —
                  designated as PREM SA's EU representative for the purposes of
                  GDPR Art. 27. EU/EEA-based Users and Organizations may contact
                  PREM AI S.r.l. on all matters relating to GDPR compliance, in
                  addition to contacting PREM SA directly. PREM AI S.r.l. does
                  not independently process Integration Content or Account Data
                  as part of the Fluso service.
                </p>
                <p>
                  Data protection contact:{" "}
                  <a href="mailto:privacy@premai.io">privacy@premai.io</a>.
                  Security disclosures:{" "}
                  <a href="mailto:security@premai.io">security@premai.io</a>.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>02 / Scope</div>
              <div className={sectionBody}>
                <h2>What this policy covers</h2>
                <p>
                  This Privacy Policy applies to all personal data we collect
                  when you register for, connect integrations to, or use the
                  Fluso service (the "Service"). It covers two distinct
                  categories of data:
                </p>
                <p>
                  This policy covers both Fluso Desktop and Fluso Mobile.
                  Billing-related provisions apply exclusively to Fluso Desktop.
                  Fluso Mobile is a free companion app: account creation is free,
                  it contains no purchases or payment links, and its features are
                  not unlocked through an external subscription.
                </p>
                <ol>
                  <li>
                    <strong>Account Data:</strong> information you provide at
                    registration and operational data about your use of the
                    Service. Stored in PREM's EU infrastructure. Described in
                    full below.
                  </li>
                  <li>
                    <strong>Integration Content:</strong> the content of emails,
                    calendar entries, messages, and other data read from the
                    workplace tools you connect to Fluso. Processed transiently
                    by the AI during each session and not stored by PREM after
                    processing.
                  </li>
                </ol>
                <p>
                  Where you are an employee using Fluso under an enterprise
                  account, your employer is the Data Controller and PREM
                  processes your data as Data Processor on your employer's
                  behalf. That relationship is governed by the{" "}
                  <strong>Fluso Data Processing Agreement (DPA)</strong> executed
                  between PREM and your employer.
                </p>
                <p>
                  Where you are an individual User, you are the Data
                  Subject and PREM is the Data Controller for Account Data, and
                  Data Processor for Integration Content processed on your
                  behalf.
                </p>
                <div className={callout}>
                  <p>
                    <strong>
                      Special-category data (GDPR Art. 9 / FADP Art. 5(c)):
                    </strong>{" "}
                    Fluso is not designed for processing health data, patient
                    records, biometric data, legal privilege, or other
                    special-category personal data. However, workplace
                    communications often contain such data incidentally — a GP's
                    calendar will include patient appointments; a lawyer's email
                    will include privileged communications. PREM processes this
                    content transiently, but PREM acting as Processor does not
                    supply the legal basis for Art. 9 processing. Organizations
                    in healthcare, legal, financial, and other regulated sectors
                    must execute a DPA with PREM and confirm their Art. 9 legal
                    basis before deploying Fluso to employees who may connect
                    accounts containing such data.
                  </p>
                </div>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>03 / Applicable law</div>
              <div className={sectionBody}>
                <h2>Laws this policy complies with</h2>
                <ol>
                  <li>
                    <strong>Swiss FADP (nDSG):</strong> we are established in
                    Switzerland.
                  </li>
                  <li>
                    <strong>EU GDPR:</strong> our infrastructure is in the EU and
                    we process personal data of EU/EEA residents.
                  </li>
                  <li>
                    <strong>GDPR Art. 6 / Art. 9:</strong> Fluso processes
                    workplace communications that may incidentally contain
                    special-category data. Our processing is not directed at
                    special-category data, but we recognize the heightened
                    obligations where such data appears in connected content.
                  </li>
                </ol>
                <p>
                  Where multiple laws apply, we apply the stricter standard.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>04 / What we collect</div>
              <div className={sectionBody}>
                <h2>Two categories of data</h2>

                <h3>4.1 — Account Data: what PREM stores</h3>
                <p>
                  The following data is stored in PREM's EU infrastructure for
                  the duration of your account.
                </p>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Data element</th>
                        <th>What it is</th>
                        <th>Stored?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Email address</td>
                        <td>Your registration and login email</td>
                        <td>Yes — EU infrastructure</td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td>Your name as provided at registration</td>
                        <td>Yes — EU infrastructure</td>
                      </tr>
                      <tr>
                        <td>Password</td>
                        <td>Your login credential</td>
                        <td>Yes — cryptographic hash only</td>
                      </tr>
                      <tr>
                        <td>Connected integrations</td>
                        <td>
                          Which services you have connected to Fluso (e.g.
                          Gmail, Slack)
                        </td>
                        <td>Yes — connection metadata only, not content</td>
                      </tr>
                      <tr>
                        <td>Usage data</td>
                        <td>
                          Feature usage patterns, session timestamps, error logs
                        </td>
                        <td>Yes — EU infrastructure</td>
                      </tr>
                      <tr>
                        <td>Fluso Desktop billing data</td>
                        <td>
                          Stripe invoice IDs and amounts paid. PREM does not hold
                          card data.
                        </td>
                        <td>Yes — EU infrastructure</td>
                      </tr>
                      <tr>
                        <td>Security identifiers</td>
                        <td>
                          IP address and session identifiers used for security
                          and fraud prevention
                        </td>
                        <td>Yes — EU infrastructure</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3>
                  4.2 — Integration Content: what Fluso reads but does not store
                </h3>
                <div className={callout}>
                  <p>
                    <strong>Transient processing — not stored:</strong> Fluso
                    reads full content from your connected integrations to power
                    AI assistance. This content is processed by the AI during
                    each session and is discarded after processing. "Transient"
                    means Integration Content is held in memory only for the
                    duration of the active AI inference operation — the period
                    between Fluso receiving a request and returning the AI
                    response. PREM does not retain a copy of your emails,
                    calendar entries, Slack messages, or other integration
                    content after the session ends.
                  </p>
                </div>
                <p>
                  The following content is read from each connected integration
                  and processed transiently:
                </p>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Integration</th>
                        <th>Content read</th>
                        <th>Stored by PREM?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Gmail</td>
                        <td>
                          Full email content (subject, body, attachments
                          metadata, sender, recipients, timestamps)
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                      <tr>
                        <td>Microsoft Outlook</td>
                        <td>
                          Full email content (subject, body, attachments
                          metadata, sender, recipients, timestamps)
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                      <tr>
                        <td>Google Calendar</td>
                        <td>
                          All calendar entries (title, description, attendees,
                          times, locations)
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                      <tr>
                        <td>Microsoft Outlook Calendar</td>
                        <td>
                          All calendar entries (title, description, attendees,
                          times, locations)
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                      <tr>
                        <td>Slack</td>
                        <td>
                          All messages from connected workspaces including
                          public channels, private channels, and direct messages
                          (message content, sender, channel, timestamps). Fluso
                          does not filter by channel type.
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                      <tr>
                        <td>Asana</td>
                        <td>
                          Task and project data (task names, descriptions,
                          assignments, due dates, comments)
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                      <tr>
                        <td>Linear</td>
                        <td>
                          Issues and project data (issue titles, descriptions,
                          assignments, status, comments)
                        </td>
                        <td>No — transient processing only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>Scope of reading:</strong> Fluso reads full content
                  from all connected integrations. Within an integration, you
                  cannot currently restrict Fluso to specific folders, channels,
                  or projects — the full scope of the connected service is
                  accessible to the AI. You control which integrations are
                  connected; disconnecting an integration immediately removes
                  Fluso's access to that service.
                </p>

                <h3>4.3 — Skills: user-installed third-party extensions</h3>
                <p>
                  Fluso supports user-installed "Skills" — custom logic and
                  integrations provided by you or third parties that extend
                  Fluso's capabilities.{" "}
                  <strong>
                    PREM is not responsible for the data practices of Skills you
                    install.
                  </strong>{" "}
                  When you install a Skill:
                </p>
                <ol>
                  <li>
                    The Skill may read integration content processed by Fluso and
                    may have its own data storage or transmission practices.
                  </li>
                  <li>
                    You are responsible for reviewing and accepting the terms and
                    privacy practices of any Skill before installation.
                  </li>
                  <li>PREM does not audit or endorse third-party Skills.</li>
                </ol>
                <p>
                  Where a Skill is developed by PREM, it is covered by this
                  Privacy Policy. Third-party Skills are subject to their own
                  privacy policies.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>05 / How we use data</div>
              <div className={sectionBody}>
                <h2>Processing activities and legal bases</h2>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Processing activity</th>
                        <th>Data used</th>
                        <th>Legal basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Provide the AI assistance service</td>
                        <td>Integration Content (transient), Account Data</td>
                        <td>Performance of contract</td>
                      </tr>
                      <tr>
                        <td>Account management and authentication</td>
                        <td>Account Data, security identifiers</td>
                        <td>Performance of contract</td>
                      </tr>
                      <tr>
                        <td>Fluso Desktop billing</td>
                        <td>Fluso Desktop billing data, usage data</td>
                        <td>Performance of contract</td>
                      </tr>
                      <tr>
                        <td>Security — fraud prevention, abuse detection</td>
                        <td>Security identifiers, usage data, technical logs</td>
                        <td>Performance of contract / Legitimate interest</td>
                      </tr>
                      <tr>
                        <td>Legal compliance</td>
                        <td>Minimum data required by applicable law</td>
                        <td>Legal obligation</td>
                      </tr>
                      <tr>
                        <td>
                          Service improvement — aggregated, anonymized only
                        </td>
                        <td>
                          Usage data — anonymized before analysis. Integration
                          Content never used.
                        </td>
                        <td>Legitimate interest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  We <strong>do not</strong>: use Integration Content to train
                  AI models; use Integration Content for analytics, model
                  improvement, or any secondary purpose — this prohibition
                  extends to anonymized or aggregated patterns derived from
                  Integration Content sessions; store Integration Content after
                  processing; sell your personal data; share your personal
                  information for cross-context behavioral advertising; or serve
                  advertising.
                </p>
                <p>
                  <strong>Session memory:</strong> Fluso does not retain memory
                  of Integration Content between sessions. Each session starts
                  fresh. PREM does not use content from previous sessions to
                  inform AI responses in future sessions.
                </p>
                <div className={callout}>
                  <p>
                    <strong>Healthcare and sensitive workplaces:</strong> If you
                    work in healthcare, legal, financial, or other regulated
                    professions, your connected emails and messages may contain
                    client-confidential or patient-identifiable information. You
                    are responsible for ensuring your use of Fluso is consistent
                    with your professional obligations and applicable law. If
                    your employer is in a regulated sector, please ensure your
                    employer has executed a DPA with PREM before connecting Fluso
                    to work accounts.
                  </p>
                </div>
              </div>
            </div>

            <div className={divider} />

            <div className="contents" id="google-workspace-limited-use">
              <div className={sectionH}>05A / Google Workspace</div>
              <div className={sectionBody}>
                <h2>Google Workspace data — Limited Use</h2>
                <div className={callout}>
                  <p>
                    <strong>Limited Use attestation.</strong> The use and
                    transfer of raw or derived user data received from Google
                    Workspace APIs will adhere to the{" "}
                    <a
                      href="https://developers.google.com/terms/api-services-user-data-policy"
                      target="_blank"
                      rel="noopener"
                    >
                      Google API Services User Data Policy
                    </a>
                    , including the Limited Use requirements.
                  </p>
                </div>
                <p>
                  This commitment governs everything PREM does with data received
                  from Google Workspace integrations — Gmail, Google Calendar,
                  and Google Drive — and applies in addition to the rest of this
                  Privacy Policy. In practice:
                </p>
                <ul>
                  <li>
                    <strong>No model training on Google Workspace data.</strong>{" "}
                    Data received from Google Workspace APIs is never used to
                    develop, improve, or train generalized or non-personalized
                    AI/ML models, whether by PREM or by any sub-processor that
                    participates in providing the integration — including the AI
                    inference providers listed in Section 7. Sub-processors that
                    do not contractually accept this restriction are not used to
                    process Google Workspace data.
                  </li>
                  <li>
                    <strong>Only for user-facing features.</strong> Google
                    Workspace data is used solely to provide or improve
                    user-facing features that are visible to the requesting user
                    in their own session. It is not transferred to others except
                    (i) as necessary to provide those features, (ii) to comply
                    with applicable law, or (iii) as part of a merger,
                    acquisition, or sale of assets with user notice and explicit
                    affirmative consent.
                  </li>
                  <li>
                    <strong>No advertising.</strong> Google Workspace data is
                    never used for serving advertisements, including retargeted,
                    personalized, or interest-based advertising.
                  </li>
                  <li>
                    <strong>No human reading.</strong> Humans do not read Google
                    Workspace data unless (a) the user has given affirmative
                    consent for the specific content, (b) it is necessary for
                    security purposes such as investigating abuse, (c) it is
                    required by law, or (d) the data has been aggregated and
                    anonymized for internal operations.
                  </li>
                  <li>
                    <strong>Transient processing applies.</strong> As described
                    in Section 4.2, Google Workspace content is processed
                    transiently by the AI for the requesting user's session and
                    discarded after inference completes. PREM does not retain a
                    copy of Google Workspace content in persistent storage.
                  </li>
                </ul>
                <p>
                  These restrictions apply to every PREM sub-processor that
                  participates in providing Google Workspace integrations. Users
                  may revoke Fluso's access to any Google service at any time
                  from{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener"
                  >
                    myaccount.google.com/permissions
                  </a>{" "}
                  or from within Fluso's settings; revocation immediately stops
                  Fluso from reading new data from that service.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>06 / Permissions &amp; control</div>
              <div className={sectionBody}>
                <h2>Integration permissions and your control</h2>
                <p>
                  Fluso accesses your connected services using OAuth or
                  equivalent authorization mechanisms. This means:
                </p>
                <ol>
                  <li>
                    You authorize Fluso's access via your service provider's own
                    authentication flow (Google, Microsoft, Slack, etc.). PREM
                    does not receive your passwords for those services.
                  </li>
                  <li>
                    You can revoke Fluso's access to any integration at any time,
                    either from within Fluso's settings or from the connected
                    service's own authorization settings.
                  </li>
                  <li>
                    Revoking access immediately stops Fluso from reading new data
                    from that integration. It does not affect Account Data stored
                    by PREM.
                  </li>
                  <li>
                    Disconnecting Fluso entirely and closing your account results
                    in deletion of Account Data per the retention schedule in
                    Section 9.
                  </li>
                </ol>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>07 / Sub-processors</div>
              <div className={sectionBody}>
                <h2>Sub-processors and data sharing</h2>
                <p>
                  We do not share Integration Content with any third party. In
                  providing the Service, we work with the following
                  sub-processors:
                </p>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Sub-processor / Representative</th>
                        <th>Role</th>
                        <th>Data shared</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Stripe</td>
                        <td>Fluso Desktop payment processing and billing</td>
                        <td>Billing data only. No Integration Content.</td>
                        <td>US / EU</td>
                      </tr>
                      <tr>
                        <td>
                          Prem SA · Amazon Web Services · OpenRouter · Fireworks
                        </td>
                        <td>
                          AI inference for processing Integration Content
                          transiently
                        </td>
                        <td>
                          Integration Content during processing — transient,
                          discarded after inference
                        </td>
                        <td>US / EU</td>
                      </tr>
                      <tr>
                        <td>Amazon Web Services</td>
                        <td>Hosting of Account Data</td>
                        <td>Account Data only. No Integration Content.</td>
                        <td>EU</td>
                      </tr>
                      <tr>
                        <td>Vercel · Amazon Web Services · Clerk</td>
                        <td>Hosting and compute</td>
                        <td>Account Data — encrypted at rest</td>
                        <td>EU</td>
                      </tr>
                      <tr>
                        <td>PREM AI S.r.l.</td>
                        <td>
                          GDPR Art. 27 EU Representative only — no data
                          processing role in Fluso
                        </td>
                        <td>
                          No data shared for processing purposes. Contact point
                          only.
                        </td>
                        <td>Italy (EU)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  A current sub-processor list is available at{" "}
                  <a href="mailto:privacy@premai.io">privacy@premai.io</a>. We
                  will provide at least 30 days' notice of any material change to
                  sub-processors.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>07A / Gov't access</div>
              <div className={sectionBody}>
                <h2>Government and law enforcement access</h2>
                <div className={callout}>
                  <p>
                    <strong>We cannot produce what we do not hold:</strong>{" "}
                    Integration Content is not stored by PREM. If PREM receives a
                    lawful order requiring production of Integration Content, PREM
                    will inform the requesting authority that such data is not
                    held by PREM in any accessible or recoverable form. This is a
                    technical fact, not a legal position.
                  </p>
                </div>
                <p>
                  Where PREM receives any government or law enforcement request
                  relating to Account Data:
                </p>
                <ol>
                  <li>
                    PREM will assess the legal validity of the request before
                    complying.
                  </li>
                  <li>
                    PREM will notify the affected User or Organization before
                    producing any Account Data in response to such a request,
                    unless prohibited from doing so by law or court order.
                  </li>
                  <li>
                    Where notification is prohibited, Prem AI will seek to challenge
                    the prohibition and disclose only the minimum data required
                    to comply.
                  </li>
                  <li>
                    Prem AI will not voluntarily produce Account Data to any
                    government authority without a binding legal order.
                  </li>
                </ol>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>08 / Transfers</div>
              <div className={sectionBody}>
                <h2>International data transfers</h2>
                <p>
                  <strong>EU infrastructure by default:</strong> Account Data is
                  stored in PREM's EU infrastructure. PREM SA is in Switzerland,
                  which has an EU adequacy decision — transfers from Switzerland
                  to EU infrastructure are compliant without additional transfer
                  mechanisms.
                </p>
                <p>
                  <strong>Integration Content:</strong> processed transiently
                  during AI inference and discarded. It may transit EU
                  infrastructure during processing but is not transferred
                  internationally in persistent form.
                </p>
                <p>
                  <strong>CH→US (where applicable):</strong> where US-based
                  infrastructure sub-processors are involved in Account Data
                  processing, transfers from PREM SA to US entities are governed
                  by Standard Contractual Clauses. Integration Content is not
                  transferred to the US in persistent form.
                </p>
                <p>
                  <strong>Third-party integrations:</strong> when you connect
                  Fluso to Gmail, Slack, or other services, those services
                  process your data under their own privacy policies and transfer
                  mechanisms. PREM does not control those flows.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>09 / Retention</div>
              <div className={sectionBody}>
                <h2>Data retention</h2>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Data type</th>
                        <th>Retention period</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          Integration Content (email, calendar, Slack, etc.)
                        </td>
                        <td>Zero — not retained</td>
                        <td>
                          Processed transiently by AI during session; discarded
                          after inference completes.
                        </td>
                      </tr>
                      <tr>
                        <td>OAuth access tokens</td>
                        <td>
                          Revoked and deleted immediately upon account closure or
                          integration disconnection
                        </td>
                        <td>Not retained for any period after disconnection.</td>
                      </tr>
                      <tr>
                        <td>
                          Account Data (email, name, integration connections)
                        </td>
                        <td>Account lifetime + 90 days</td>
                        <td>
                          30-day window after account closure to export account
                          data.
                        </td>
                      </tr>
                      <tr>
                        <td>Hashed password</td>
                        <td>Account lifetime + 90 days</td>
                        <td>Hash only — original password never recoverable.</td>
                      </tr>
                      <tr>
                        <td>Fluso Desktop billing records</td>
                        <td>10 years</td>
                        <td>Swiss OR Art. 958f / applicable tax law.</td>
                      </tr>
                      <tr>
                        <td>Usage data</td>
                        <td>12 months, then anonymized</td>
                        <td>See anonymization note below.</td>
                      </tr>
                      <tr>
                        <td>Technical logs</td>
                        <td>90 days</td>
                        <td>—</td>
                      </tr>
                      <tr>
                        <td>Support correspondence</td>
                        <td>3 years from last communication</td>
                        <td>—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  <strong>Anonymization:</strong> usage data retained beyond 12
                  months is anonymized by removal of all direct and indirect
                  identifiers (account ID, organisation ID, IP address,
                  integration type references) rendering re-identification
                  impossible. Anonymized data does not constitute personal data
                  under FADP or GDPR and is retained for service improvement
                  only.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>10 / Your rights</div>
              <div className={sectionBody}>
                <h2>Your rights under FADP and GDPR</h2>
                <h3>10.1 — Rights under FADP and GDPR</h3>
                <p>Under the Swiss FADP and GDPR, you may:</p>
                <ol>
                  <li>
                    <strong>Access:</strong> confirm whether PREM holds personal
                    data about you and receive a copy.
                  </li>
                  <li>
                    <strong>Rectification:</strong> correct inaccurate Account
                    Data.
                  </li>
                  <li>
                    <strong>Erasure:</strong> request deletion of Account Data
                    where Prem AI no longer has a legal basis to retain it.
                  </li>
                  <li>
                    <strong>Restriction:</strong> restrict processing of Account
                    Data in certain circumstances.
                  </li>
                  <li>
                    <strong>Portability:</strong> receive your Account Data in a
                    structured, machine-readable format.
                  </li>
                  <li>
                    <strong>Objection:</strong> object to processing of Account
                    Data based on legitimate interest.
                  </li>
                  <li>
                    <strong>Disconnect integrations:</strong> you may at any time
                    disconnect any integration via Fluso settings or via the
                    connected service's own authorization management.
                  </li>
                </ol>
                <p>
                  To exercise any right:{" "}
                  <a href="mailto:privacy@premai.io">privacy@premai.io</a>.
                  Response within 30 days.
                </p>
                <p>
                  To lodge a complaint: Switzerland — FDPIC:{" "}
                  <a
                    href="https://www.edoeb.admin.ch"
                    target="_blank"
                    rel="noopener"
                  >
                    www.edoeb.admin.ch
                  </a>{" "}
                  · +41 58 462 43 95. EU: your local supervisory authority (GDPR
                  Art. 77).
                </p>
                <div className={callout}>
                  <p>
                    <strong>Integration Content rights:</strong> Because
                    Integration Content is not stored by PREM, access,
                    correction, and deletion requests for the content of your
                    emails, messages, or calendar entries cannot be fulfilled by
                    PREM — the source data remains in your connected services
                    (Gmail, Slack, etc.) and should be managed there. You can
                    delete content at source at any time; Fluso will not have a
                    copy.
                  </p>
                </div>
                <h3>10.2 — Developers located in the United States</h3>
                <p>
                  Account Data protections under Section 10.1 apply regardless of
                  your location. PREM does not sell personal data and does not
                  use it for targeted advertising. To the extent any applicable
                  US state privacy law applies to PREM's processing of your
                  Account Data, you may exercise your rights at{" "}
                  <a href="mailto:privacy@premai.io">privacy@premai.io</a>.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>11 / Security</div>
              <div className={sectionBody}>
                <h2>Security</h2>
                <ul>
                  <li>
                    <strong>Encryption in transit:</strong> all connections use
                    TLS 1.2 or higher.
                  </li>
                  <li>
                    <strong>Encryption at rest:</strong> Account Data is stored
                    encrypted at rest in EU infrastructure.
                  </li>
                  <li>
                    <strong>Integration Content:</strong> processed in isolated
                    compute environments; not written to persistent storage.
                    Discarded after each inference session.
                  </li>
                  <li>
                    <strong>Password hashing:</strong> stored as cryptographic
                    hashes using OWASP-compliant algorithms. Plaintext passwords
                    are never stored or recoverable.
                  </li>
                  <li>
                    <strong>Access controls:</strong> MFA and RBAC on all PREM
                    production systems.
                  </li>
                  <li>
                    <strong>OAuth credentials:</strong> access tokens for
                    connected integrations are stored encrypted and used only for
                    API calls to the relevant service.
                  </li>
                  <li>
                    <strong>Connected-account boundary:</strong> connected
                    account actions are locked to your own account, and API keys
                    used by your tools cannot be read back through the
                    assistant shell.
                  </li>
                  <li>
                    <strong>SOC 2 Type II:</strong> PREM has SOC 2 Type II in
                    place; ISO 27001 is in progress.
                  </li>
                </ul>
                <p>
                  Security disclosures:{" "}
                  <a href="mailto:security@premai.io">security@premai.io</a>{" "}
                  (subject: "Security Disclosure").
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>12 / Breach notification</div>
              <div className={sectionBody}>
                <h2>Data breach notification</h2>
                <p>
                  If PREM becomes aware of a personal data breach affecting
                  Account Data:
                </p>
                <ol>
                  <li>
                    We notify relevant supervisory authorities within 72 hours
                    (FADP Art. 24 / GDPR Art. 33).
                  </li>
                  <li>
                    Where the breach poses high risk to your rights and freedoms,
                    we notify you without undue delay.
                  </li>
                </ol>
                <p>
                  <strong>Note on Integration Content:</strong> because
                  Integration Content is not stored by PREM, a breach of PREM's
                  infrastructure does not expose your emails, messages, or
                  calendar content — there is nothing to breach. The source data
                  remains in your connected services.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>13 / Cookies</div>
              <div className={sectionBody}>
                <h2>Cookies</h2>
                <p>
                  Fluso uses only strictly necessary cookies for authentication
                  and session management. We do not use analytics cookies,
                  advertising trackers, or third-party tracking scripts on the
                  Fluso service itself.
                </p>
                <div className={tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        <th>Cookie</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Session / Auth</td>
                        <td>Authentication and session management</td>
                        <td>Session / 30 days</td>
                      </tr>
                      <tr>
                        <td>Stripe</td>
                        <td>Fraud prevention during Fluso Desktop payment processing</td>
                        <td>1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>14 / Children</div>
              <div className={sectionBody}>
                <h2>Children</h2>
                <p>
                  Fluso is a professional workplace service and is not intended
                  for individuals under 16. We do not knowingly collect personal
                  data from children. Contact{" "}
                  <a href="mailto:privacy@premai.io">privacy@premai.io</a> if you
                  believe a child has provided data.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>15 / Changes</div>
              <div className={sectionBody}>
                <h2>Changes to this policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Material
                  changes will be communicated via email or in-service
                  notification at least 30 days before taking effect. Continued
                  use after a material change constitutes acceptance.
                </p>
              </div>
            </div>

            <div className={divider} />

            <div className="contents">
              <div className={sectionH}>16 / Contact</div>
              <div className={sectionBody}>
                <h2>Contact</h2>
                <div className={tableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>General support</td>
                        <td>
                          <a href="mailto:fluso@premai.io">fluso@premai.io</a>
                        </td>
                      </tr>
                      <tr>
                        <td>Data protection / privacy rights</td>
                        <td>
                          <a href="mailto:privacy@premai.io">
                            privacy@premai.io
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>Security disclosures</td>
                        <td>
                          <a href="mailto:security@premai.io">
                            security@premai.io
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>Postal address</td>
                        <td>
                          PREM SA, Crocicchio Cortogna 6, 6900 Lugano,
                          Switzerland
                        </td>
                      </tr>
                      <tr>
                        <td>EU Representative (GDPR Art. 27)</td>
                        <td>
                          PREM AI S.r.l., Via Giuseppe Verdi 12, 70017 Putignano,
                          Bari, Italy ·{" "}
                          <a href="mailto:privacy@premai.io">
                            privacy@premai.io
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>Swiss supervisory authority (FDPIC)</td>
                        <td>
                          <a
                            href="https://www.edoeb.admin.ch"
                            target="_blank"
                            rel="noopener"
                          >
                            www.edoeb.admin.ch
                          </a>{" "}
                          · +41 58 462 43 95
                        </td>
                      </tr>
                      <tr>
                        <td>Italian supervisory authority (Garante)</td>
                        <td>
                          <a
                            href="https://www.garanteprivacy.it"
                            target="_blank"
                            rel="noopener"
                          >
                            www.garanteprivacy.it
                          </a>{" "}
                          · +39 06 696771
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  This Privacy Policy is provided in English. In case of conflict
                  between translated versions and the English version, the
                  English version prevails.
                </p>
              </div>
            </div>

            <div className="col-span-full flex flex-wrap items-center justify-between gap-3.5 border-t border-(--border-soft) pt-[clamp(28px,3vw,40px)] text-[13px] text-(--text-muted)">
              <span>PREM SA · Version 1.1 · Last updated 13 August 2026</span>
              <Link to="/terms">Read the Terms of Service →</Link>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
