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
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-[13.5px] [&_table]:leading-[1.5] max-md:[&_table]:text-[12.5px]",
  "[&_tbody_td]:border-b [&_tbody_td]:border-(--border-soft) [&_tbody_td]:px-3.5 [&_tbody_td]:py-3 [&_tbody_td]:align-top [&_tbody_td]:text-(--text-primary) [&_tbody_td]:opacity-88",
  "[&_tbody_td:first-child]:w-[30%] [&_tbody_td:first-child]:font-medium [&_tbody_td:first-child]:opacity-100",
  "[&_tbody_tr:last-child_td]:border-b-0",
  "max-md:[&_tbody_td]:px-[11px] max-md:[&_tbody_td]:py-2.5",
);

const divider =
  "col-span-full my-[clamp(24px,3vw,40px)] border-b border-(--border-soft)";

const legalBody = cn(
  "mt-[clamp(48px,6vw,80px)] grid gap-[clamp(24px,3vw,56px)] border-t border-(--border-soft) pt-[clamp(40px,4vw,60px)]",
  "grid-cols-[minmax(180px,0.7fr)_minmax(0,2fr)]",
  "max-md:grid-cols-1 max-md:gap-3.5",
);

export default function Terms() {
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
          {/*<span className={cn(KICKER, "mb-[clamp(14px,2vh,22px)] block")}>Terms of Service</span>*/}
          <h1 className={TITLE}>
            The rules of
            <br />
            using Fluso.
          </h1>
          <p className={cn(SUBTITLE, "max-w-[64ch]")}>
            By creating an account or connecting any integration to Fluso, you
            agree to be bound by these Terms. If you are accepting on behalf of
            an organisation, you confirm that you have authority to bind that
            organisation. If you do not agree, do not use the Service.
          </p>
          <div
            className={cn(
              mono,
              "mt-4.5 inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.12em] text-(--text-muted)",
            )}
          >
            PREM SA <span className="opacity-40">·</span> Version 1.1{" "}
            <span className="opacity-40">·</span> Effective 13 August 2026{" "}
            <span className="opacity-40">·</span> Governing law: Swiss (Code of
            Obligations)
          </div>

          <div className={legalBody}>
            <div className="contents">
              <div className={sectionH}>Art. 1 / Definitions</div>
              <div className={sectionBody}>
                <h2>Defined terms</h2>
                <p>In these Terms:</p>
                <div className={tableWrap}>
                  <table>
                    <tbody>
                      <tr><td>"Service"</td><td>The Fluso AI workplace productivity service, comprising Fluso Desktop and Fluso Mobile, including all features, integrations, APIs, and related tools provided by PREM SA.</td></tr>
                      <tr><td>"Fluso Desktop"</td><td>The Fluso AI workplace productivity service accessed via desktop or web browser, including all features, integrations, APIs, and related tools. Fluso Desktop is the paid offering with subscription plans as set out in Article 8.</td></tr>
                      <tr><td>"Fluso Mobile"</td><td>The Fluso mobile companion application that provides access to Fluso from a mobile device. Fluso Mobile is a free companion app: account creation is free, it contains no purchases or payment links, and its features are not unlocked through an external subscription.</td></tr>
                      <tr><td>"PREM" / "we" / "us"</td><td>PREM SA, incorporated under Swiss law at Crocicchio Cortogna 6, 6900 Lugano, Switzerland (CHE-371.240.335).</td></tr>
                      <tr><td>"User" / "you"</td><td>The individual using Fluso, whether through an individual account or as an employee using Fluso under an enterprise account.</td></tr>
                      <tr><td>"Organisation" / "Employer"</td><td>The company or entity that enables Fluso access for its employees.</td></tr>
                      <tr><td>"Account"</td><td>The Fluso account created by or for a User.</td></tr>
                      <tr><td>"Integration"</td><td>A connection between Fluso and a third-party service (Gmail, Outlook, Google Calendar, Outlook Calendar, Slack, Asana, Linear, or any other service connected by the User) that enables Fluso to read Integration Content.</td></tr>
                      <tr><td>"Integration Content"</td><td>The content read by Fluso from connected Integrations, including emails, calendar entries, messages, tasks, and any other content retrieved from connected services. Integration Content is processed transiently and not stored by PREM.</td></tr>
                      <tr><td>"Skill"</td><td>A user-installed extension that adds custom logic, integrations, or capabilities to Fluso. Skills may be provided by PREM or by third parties.</td></tr>
                      <tr><td>"Account Data"</td><td>Account registration information, usage data, and other information about User's use of the Service as described in the Privacy Policy.</td></tr>
                      <tr><td>"DPA"</td><td>The Fluso Data Processing Agreement governing PREM's processing of personal data on behalf of an Organization as Data Controller.</td></tr>
                      <tr><td>"Privacy Policy"</td><td>The Fluso <a href="/privacy">Privacy Policy</a>, which describes how PREM handles Account Data, Integration Content, the EU Representative designation (PREM AI S.r.l. under GDPR Art. 27), and data retention practices.</td></tr>
                      <tr><td>"SLA"</td><td>The Service Level Agreement published at <a href="https://docs.fluso.ai/legal/sla" target="_blank" rel="noopener noreferrer">docs.fluso.ai/legal/sla</a>.</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 2 / Description</div>
              <div className={sectionBody}>
                <h2>Description of the Service</h2>
                <ol>
                  <li>Fluso is an AI-powered workplace productivity service that connects to User's workplace tools &mdash; including email, calendar, messaging, and project management applications &mdash; to provide AI-assisted task management, drafting, summarization, and workflow automation.</li>
                  <li><strong>Fluso Mobile:</strong> The Fluso mobile app is a free companion app. Account creation is free, it contains no purchases or payment links, and its features are not unlocked through an external subscription. The provisions of these Terms apply to both Fluso Desktop and Fluso Mobile, except that Article 8 (Pricing and Payment) applies exclusively to Fluso Desktop.</li>
                  <li><strong>How Fluso reads Integration Content:</strong> Fluso reads full content from all connected Integrations to power AI assistance. Within an Integration, Users cannot currently restrict Fluso to specific folders, channels, or projects &mdash; the full scope of the connected service is accessible to the AI during sessions. Integration Content is processed transiently and is discarded after each AI inference session. PREM does not retain a copy of Integration Content.</li>
                  <li><strong>What Fluso does not do:</strong> Fluso does not store Integration Content, use Integration Content to train AI models, or share Integration Content with third parties.</li>
                  <li><strong>Skills:</strong> Users may install Skills to extend Fluso's capabilities. PREM-provided Skills are covered by these Terms. Third-party Skills are subject to separate terms and privacy policies determined by their developers. PREM is not responsible for third-party Skills.</li>
                  <li><strong>Confidential mode:</strong> Fluso may process eligible workloads through Trusted Execution Environment (TEE) infrastructure, subject to the settings and supplementary terms that apply to the User's workspace.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 3 / Accounts</div>
              <div className={sectionBody}>
                <h2>Account registration and access</h2>
                <ol>
                  <li>Users must create an Account to use the Service, providing accurate and complete registration information.</li>
                  <li>Users are responsible for maintaining the confidentiality of their Account credentials and for all activity occurring under their Account.</li>
                  <li>Notify PREM immediately at <a href="mailto:security@premai.io">security@premai.io</a> if you suspect unauthorized access to your Account.</li>
                  <li><strong>Enterprise accounts:</strong> where Fluso is provided by an Organization, the Organization controls access and Account settings. Individual Users should refer to their Organization's own policies governing use of Fluso. The Organization is the Data Controller for Users' personal data processed through Fluso; the DPA governs PREM's obligations to the Organization.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 4 / Integrations</div>
              <div className={sectionBody}>
                <h2>Integrations and user permissions</h2>
                <ol>
                  <li>By connecting an Integration, User authorizes Fluso to access the connected service using OAuth or equivalent authorization, and to read Integration Content from that service to provide the Service.</li>
                  <li><strong>Scope of access:</strong> Fluso requests access to the full scope of each connected Integration. For Slack specifically, this includes public channels, private channels, and direct messages &mdash; Fluso does not filter by channel type or conversation sensitivity. Users cannot currently restrict Fluso's access to specific folders, channels, or projects within a connected service. User controls which Integrations are connected. Organizations deploying Fluso to employees with access to sensitive Slack channels (including board discussions, HR matters, or legally privileged communications) should review this scope carefully before connection.</li>
                  <li><strong>Revoking access:</strong> User may disconnect any Integration at any time from within Fluso's settings or from the connected service's own authorization management. Disconnection immediately stops Fluso from reading new Integration Content from that service.</li>
                  <li><strong>User responsibility for Integration Content:</strong> User is responsible for ensuring that connecting a workplace service to Fluso is consistent with: (a) the terms of service of the connected platform; (b) User's employer's policies; (c) User's professional obligations (including professional secrecy, legal privilege, or data protection obligations applicable to User's role); and (d) applicable law.</li>
                  <li><strong>Healthcare, legal, and regulated sector users:</strong> if User's connected services contain patient data, client-confidential information, or other data subject to professional secrecy obligations, User must ensure that connecting that service to Fluso is permitted under applicable professional rules and, where required, under a DPA between User's Organization and PREM.</li>
                  <li><strong>Google Workspace &mdash; Limited Use:</strong> Where User connects a Google Workspace Integration (Gmail, Google Calendar, Google Drive), PREM attests that: "The use and transfer of raw or derived user data received from Google Workspace APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</a>, including the Limited Use requirements." PREM does not use Google Workspace data to train generalized AI/ML models, does not transfer Google Workspace data to third parties except as permitted by that policy, does not serve advertising based on Google Workspace data, and does not allow humans to read Google Workspace data except in the narrow circumstances permitted by that policy. PREM imposes the same restriction on every sub-processor that participates in providing Google Workspace Integrations. The full Limited Use disclosure is set out in Section 05A of the <a href="/privacy#google-workspace-limited-use">Privacy Policy</a>.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 5 / DPA</div>
              <div className={sectionBody}>
                <h2>Data Processing Agreement</h2>
                <ol>
                  <li>Where Fluso is used to process personal data on behalf of an Organization (enterprise account), the Organization must execute the Fluso Data Processing Agreement (DPA) before deploying Fluso to employees.</li>
                  <li>The DPA governs PREM's processing of personal data as Data Processor on the Organization's behalf. In the event of conflict between these Terms and the DPA with respect to the processing of personal data, the DPA prevails.</li>
                  <li><strong>Regulated sector obligation:</strong> Organizations in healthcare, legal, financial, or other regulated sectors must execute a DPA before deploying Fluso to employees who may process client-confidential or patient-identifiable data through connected Integrations. Deployment without an executed DPA in these sectors is a material breach of these Terms.</li>
                  <li><strong>Special-category data &mdash; additional requirement:</strong> where connected Integrations may contain health data, patient records, biometric data, genetic data, or other special-category personal data within the meaning of GDPR Art. 9 / FADP Art. 5(c), Organization must: (a) have a valid Art. 9(2) and/or FADP Art. 31 legal basis for processing such data through Fluso; (b) notify PREM at <a href="mailto:privacy@premai.io">privacy@premai.io</a> before deployment; and (c) execute a DPA addendum specifically covering special-category processing. PREM reserves the right to decline to enter into such an addendum. Using Fluso to process special-category data without these measures is a material breach of these Terms.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 6 / Skills</div>
              <div className={sectionBody}>
                <h2>Skills</h2>
                <ol>
                  <li>PREM-provided Skills are part of the Service and are covered by these Terms and the Privacy Policy.</li>
                  <li><strong>Third-party Skills:</strong> Skills developed by third parties are not part of the Service. By installing a third-party Skill, User accepts the third party's own terms and privacy policy. PREM is not responsible for the functionality, security, or data practices of third-party Skills.</li>
                  <li><strong>User-provided Skills:</strong> Users may create their own Skills using Fluso's Skills framework. User is solely responsible for the code, data handling, and compliance of Skills they create. User-created Skills must not: (a) store or transmit Integration Content to external systems without appropriate disclosure and User consent; (b) violate any applicable data protection law; (c) circumvent Fluso's security controls.</li>
                  <li>PREM reserves the right to disable any Skill that it reasonably believes violates these Terms or poses a security risk, with notice to the User where practicable.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 7 / Acceptable use</div>
              <div className={sectionBody}>
                <h2>Acceptable use</h2>
                <h3>7.1 &mdash; Permitted use</h3>
                <p>Users may use the Service for lawful workplace productivity purposes in accordance with these Terms and applicable law.</p>
                <h3>7.2 &mdash; Prohibited conduct</h3>
                <div className={callout}>
                  <p><strong>Violations may result in immediate account suspension.</strong></p>
                </div>
                <ul>
                  <li>Use the Service for any unlawful, harmful, or fraudulent purpose.</li>
                  <li>Connect Integrations containing data that User is not authorized to process, including data subject to legal privilege, professional secrecy, or data protection restrictions without appropriate legal basis.</li>
                  <li>Use the Service to process personal data in violation of applicable data protection law.</li>
                  <li>Attempt to extract, store, or export Integration Content outside the Service's intended workflow without appropriate authorization.</li>
                  <li>Attempt to reverse-engineer, decompile, or circumvent the Service's security mechanisms.</li>
                  <li>Share Account credentials or allow unauthorized parties to access the Service through User's Account.</li>
                  <li>Use the Service in a manner that disproportionately burdens PREM's infrastructure or interferes with other Users.</li>
                  <li>Use the Service to generate, distribute, or process content that is illegal, harmful, or infringes third-party rights.</li>
                </ul>
                <h3>7.3 &mdash; Export controls and sanctions</h3>
                <p>User must comply with all applicable trade sanctions, export controls, and embargo regulations, including US OFAC sanctions, EU restrictive measures, and Swiss sanctions under the Embargogesetz (EmbG). User represents and warrants that: (i) User is not located in, or a national or resident of, any country subject to comprehensive US, EU, or Swiss sanctions; (ii) User is not listed on the OFAC SDN List, any applicable EU sanctions list, or any SECO sanctions list; and (iii) User will not use the Service in violation of any applicable sanctions or export control laws.</p>
                <h3>7.4 &mdash; AI output</h3>
                <p>AI-generated Outputs are provided for informational purposes only and may be inaccurate, incomplete, or biased. User is solely responsible for independently evaluating and verifying Outputs. The Service is not a substitute for professional advice and must not be used as the sole basis for decisions with legal, medical, financial, or safety implications. All Outputs must be reviewed by a qualified professional before being relied upon.</p>
                <h3>7.5 &mdash; EU AI Act</h3>
                <p>Where an Organization deploys Fluso as an AI system within the meaning of the EU AI Act, the Organization is responsible for compliance with applicable EU AI Act obligations as <strong>deployer</strong>. PREM's provision of Fluso as a service does not transfer these obligations to PREM.</p>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 8 / Pricing</div>
              <div className={sectionBody}>
                <h2>Pricing and payment</h2>
                <ol>
                  <li><strong>Scope:</strong> This Article applies to Fluso Desktop only. Fluso Mobile is a free companion app: account creation is free, it contains no purchases or payment links, and its features are not unlocked through an external subscription. No fees are charged for Fluso Mobile.</li>
                  <li>Fees for Fluso Desktop are set out in the applicable subscription plan or order form. All fees are exclusive of VAT and other applicable taxes, which are the User's or Organization's responsibility.</li>
                  <li>Payments are processed through Stripe. By making a payment, User agrees to Stripe's Terms of Service.</li>
                  <li>PREM may update fees on 60 days' prior written notice. Continued use after the effective date constitutes acceptance.</li>
                  <li>Where Fluso is provided under an enterprise agreement, payment terms are set out in that agreement.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 9 / IP</div>
              <div className={sectionBody}>
                <h2>Intellectual property</h2>
                <ol>
                  <li>PREM retains all intellectual property rights in the Service, including software, models, documentation, and all improvements. Nothing in these Terms transfers any intellectual property rights to User or Organization.</li>
                  <li>User and Organization retain all intellectual property rights in Integration Content and in any outputs generated by the Service based on their Integration Content. PREM claims no ownership over AI-generated Outputs.</li>
                  <li>By connecting an Integration, User grants PREM a limited, non-exclusive, royalty-free license to access and process Integration Content solely for the purpose of providing the Service during the session. This license is transient &mdash; it does not extend to storage or secondary use of Integration Content.</li>
                  <li><strong>User-created Skills:</strong> Skills created by User using Fluso's Skills framework are owned by User. PREM does not acquire any license to User-created Skills except the limited license necessary to execute the Skill within the Service on User's instruction. User-created Skills must comply with clause 6.3 of these Terms.</li>
                  <li>Any feedback provided about the Service may be used by PREM without obligation or compensation.</li>
                  <li><strong>Platform IP indemnification:</strong> PREM will defend, indemnify, and hold harmless User and Organization against any third-party claim alleging that the Fluso platform software (expressly excluding User-created Skills, third-party Skills, Integration Content, or AI-generated Outputs) infringes a valid third-party intellectual property right. User or Organization must notify PREM promptly of any such claim and grant PREM sole control over the defense and settlement thereof.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 10 / SLA</div>
              <div className={sectionBody}>
                <h2>Service levels and maintenance</h2>
                <ol>
                  <li>PREM targets the availability levels set out in the SLA, incorporated into these Terms by reference.</li>
                  <li>Scheduled maintenance will be announced at least 48 hours in advance on the Fluso status page. Emergency maintenance may be performed without prior notice where necessary to protect infrastructure security.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 11 / Warranties</div>
              <div className={sectionBody}>
                <h2>Warranties and disclaimers</h2>
                <ol>
                  <li><strong>PREM warrants:</strong> (a) it has the right to provide the Service; (b) Integration Content is processed transiently and not stored by PREM after each inference session; (c) PREM does not use Integration Content to train AI models; (d) PREM maintains appropriate security measures as described in the Privacy Policy.</li>
                  <li><strong>User warrants:</strong> (a) it has authority to enter into these Terms; (b) its use of the Service complies with applicable law; (c) connecting each Integration is consistent with the terms of the connected platform and with User's professional and data protection obligations; (d) User has a valid legal basis for any personal data processed through the Service.</li>
                  <li>Save as expressly stated, the Service is provided on an "as is" basis. PREM does not warrant that the Service will be error-free or uninterrupted, or that AI Outputs will be accurate.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 12 / Liability</div>
              <div className={sectionBody}>
                <h2>Liability</h2>
                <ol>
                  <li>Nothing in these Terms limits or excludes either party's liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be limited under Swiss law.</li>
                  <li>Subject to clause 12.1, PREM's aggregate liability to User or Organization under or in connection with these Terms shall not exceed the total fees paid in the 12 months immediately preceding the event giving rise to the claim.</li>
                  <li><strong>Storage or secondary use breach &mdash; Super Cap:</strong> Notwithstanding the general liability cap set forth above, if PREM breaches its warranty that Integration Content is not stored after processing (Article 11.1(b)) or not used for secondary purposes including model training (Article 11.1(c)), PREM's aggregate liability for direct losses arising from that breach shall not exceed two (2) times the total fees paid by User or Organization to PREM in the 12 months immediately preceding the event giving rise to the claim. Under no circumstances shall PREM's liability for such breaches be uncapped.</li>
                  <li>Neither party shall be liable for indirect, special, incidental, or consequential losses, including loss of profits, revenue, or business opportunity.</li>
                  <li>User and Organization shall indemnify PREM against claims, losses, and expenses arising from: (a) breach of these Terms; (b) violation of applicable law or third-party rights; (c) connecting Integrations or processing data without appropriate authorization or legal basis; (d) installation of third-party Skills.</li>
                  <li><strong>Integration Content:</strong> PREM's liability in respect of Integration Content is limited to the obligation not to store it after processing and not to use it for unauthorized purposes. PREM is not liable for the content of User's emails, messages, or other Integration Content, or for AI Outputs generated from that content.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 13 / Term</div>
              <div className={sectionBody}>
                <h2>Term and termination</h2>
                <ol>
                  <li>These Terms commence when User first creates an Account and continue until terminated.</li>
                  <li>User or Organization may cancel at any time through Account settings or by contacting <a href="mailto:fluso@premai.io">fluso@premai.io</a>.</li>
                  <li>PREM may suspend or terminate access: (a) immediately, for material breach of these Terms or prohibited use; (b) with 30 days' written notice, for any other reason.</li>
                  <li>Upon termination: (a) access to the Service ceases; (b) Account Data is deleted per the Privacy Policy retention schedule; (c) since Integration Content is not stored, there is no Integration Content to delete; (d) Articles 9, 11, 12, 14, and 15 survive termination.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 14 / General</div>
              <div className={sectionBody}>
                <h2>General provisions</h2>
                <ol>
                  <li><strong>Entire agreement:</strong> these Terms, together with the DPA (where applicable), Privacy Policy, and SLA, constitute the entire agreement regarding the Service.</li>
                  <li><strong>Amendments:</strong> PREM may update these Terms on 30 days' prior written notice. Continued use after the effective date constitutes acceptance.</li>
                  <li><strong>Assignment:</strong> User may not assign these Terms without PREM's prior written consent. PREM may assign these Terms to any affiliate or successor entity.</li>
                  <li><strong>Severability:</strong> if any provision is found invalid or unenforceable, it will be modified to the minimum extent necessary; remaining provisions remain in force.</li>
                  <li><strong>Force majeure:</strong> neither party is liable for delays caused by events beyond reasonable control.</li>
                  <li><strong>Language:</strong> the controlling language is English.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Art. 15 / Governing law</div>
              <div className={sectionBody}>
                <h2>Governing law and jurisdiction</h2>
                <ol>
                  <li>These Terms are governed by Swiss law, excluding its conflict of laws rules and the CISG.</li>
                  <li>The parties submit to the exclusive jurisdiction of the courts of the Canton of Zurich, Switzerland.</li>
                  <li>Either party may seek emergency injunctive relief from any court of competent jurisdiction.</li>
                  <li>If User is a consumer in the EU/EEA, nothing in these Terms affects User's statutory rights under applicable EU consumer protection laws.</li>
                </ol>
              </div>
            </div>

            <div className={divider}></div>

            <div className="contents">
              <div className={sectionH}>Contact</div>
              <div className={sectionBody}>
                <h2>Contact</h2>
                <p><strong>PREM SA</strong> · Crocicchio Cortogna 6, 6900 Lugano, Switzerland.</p>
                <p><strong>General:</strong> <a href="mailto:fluso@premai.io">fluso@premai.io</a> · <strong>Data protection:</strong> <a href="mailto:privacy@premai.io">privacy@premai.io</a> · <strong>Security:</strong> <a href="mailto:security@premai.io">security@premai.io</a>.</p>
              </div>
            </div>

            <div
              className={cn(
                "col-span-full flex flex-wrap items-center justify-between gap-3.5 border-t border-(--border-soft) pt-[clamp(28px,3vw,40px)]",
                "text-[13px] text-(--text-muted)",
              )}
            >
              <span>PREM SA · Version 1.1 · Last updated 13 August 2026</span>
              <a href="/privacy">Read the Privacy Policy &rarr;</a>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
