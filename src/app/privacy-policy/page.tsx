
import Link from "next/link";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      "Advixio360 (“Advixio360”, “we”, “us”, or “our”) respects your privacy. This Privacy Policy explains how we collect, use, disclose, store, and protect information when you visit www.advixio360.com, create an account, browse products or suppliers, submit a listing, contact a business, or use other features of our website and marketplace (collectively, the “Platform”).",
      "The Platform is operated by Advixio360, with its registered office at Nagpur. By using the Platform, you acknowledge this Policy. Where consent is required by applicable law, we will seek it before processing the relevant personal information.",
    ],
  },
  {
    title: "2. Information We May Collect",
    subsections: [
      {
        title: "2.1 Information you provide",
        paragraphs: [
          "Depending on the feature you use, we may collect information such as:",
        ],
        bullets: [
          "Name, business name, job title, and account profile details;",
          "Email address, telephone number, business address, and other contact information;",
          "Login credentials or account authentication information (credentials should be securely protected);",
          "Supplier profile details, product descriptions, images, specifications, prices, certifications, and listing content;",
          "Enquiries, messages, feedback, support requests, and communications with us or other users;",
          "Subscription, transaction, billing, or payment-related details where paid features are offered. Payment card or bank details may be handled by a third-party payment provider rather than stored by us.",
        ],
      },
      {
        title: "2.2 Information collected automatically",
        paragraphs: [
          "When you use the Platform, we or our service providers may automatically receive technical and usage information, such as IP address, browser and device type, operating system, approximate location derived from IP, pages viewed, referring pages, timestamps, clicks, session information, and diagnostic or security logs.",
        ],
      },
      {
        title: "2.3 Cookies and similar technologies",
        paragraphs: [
          "The Platform may use cookies, pixels, local storage, or similar technologies to keep the website working, remember preferences, understand usage, improve performance, prevent fraud, and measure marketing. You can manage cookies through your browser settings and, where provided, our cookie controls. Disabling certain cookies may affect Platform functionality. If analytics or advertising tools are enabled, identify them and describe their use here: [Insert tools and cookie details].",
        ],
      },
      {
        title: "2.4 Information from other sources",
        paragraphs: [
          "We may receive information from business partners, publicly available sources, service providers, or other users when it is relevant to a listing, enquiry, account, or security check. We will handle such information in accordance with this Policy and applicable law.",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Information",
    paragraphs: ["We may use information for purposes including:"],
    bullets: [
      "Creating, managing, and securing user accounts;",
      "Displaying supplier profiles, product listings, and business information;",
      "Enabling product discovery, enquiries, and connections between buyers and suppliers;",
      "Responding to questions, providing support, and sending service-related communications;",
      "Processing subscriptions, payments, invoices, and related administration where applicable;",
      "Operating, maintaining, analysing, and improving Platform features and user experience;",
      "Detecting, investigating, and preventing fraud, abuse, security incidents, and violations of our Terms;",
      "Communicating updates, offers, or marketing where permitted by law and subject to your preferences;",
      "Complying with legal obligations and enforcing our agreements.",
    ],
  },
  {
    title: "4. Legal Grounds and Consent",
    paragraphs: [
      "We process personal information where permitted by applicable law, including to provide a service you request, perform or take steps related to an agreement, comply with legal obligations, protect the Platform and users, or based on consent where required. You may withdraw consent where processing relies on consent; withdrawal does not affect processing lawfully carried out before withdrawal and may mean that certain features are no longer available.",
    ],
  },
  {
    title: "5. How We Share Information",
    paragraphs: [
      "We may share information in the following circumstances, subject to applicable law:",
    ],
    bullets: [
      "With other users: details you choose to publish in a supplier profile or listing, and information you share through an enquiry or business connection.",
      "With service providers: hosting, analytics, communications, customer support, security, payment processing, and other vendors supporting the Platform.",
      "With professional advisers: legal, accounting, audit, or other advisers where reasonably necessary.",
      "For legal and safety reasons: where required by law, legal process, or to protect rights, safety, property, or investigate suspected wrongdoing.",
      "For business changes: in connection with a merger, acquisition, financing, restructuring, or transfer, subject to appropriate safeguards and applicable law.",
      "With your direction or consent: when you ask us to share information or otherwise authorise the sharing.",
    ],
    after: [
      "We do not sell personal information to third parties for their independent marketing purposes. If the Platform uses advertising or analytics partners, describe the relevant data flows and choices in this Policy before launch.",
    ],
  },
  {
    title: "6. Marketplace Visibility and User Communications",
    paragraphs: [
      "Advixio360 is a business discovery and product marketplace. Information entered into public-facing supplier or product listings may be visible to visitors and search engines. When you contact a supplier or buyer, the information you include in that enquiry may be shared with the recipient so they can respond. Do not include sensitive or unnecessary personal information in public listings or enquiries.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We retain personal information for as long as reasonably necessary for the purposes described in this Policy, including to provide the Platform, maintain records, resolve disputes, enforce agreements, and comply with legal requirements. Retention periods depend on the type of information and purpose. When information is no longer required, we will delete it, anonymise it, or securely dispose of it as appropriate and as permitted by law. [Insert any specific retention periods or account deletion process, if established].",
    ],
  },
  {
    title: "8. Security",
    paragraphs: [
      "We use reasonable technical, organisational, and administrative safeguards designed to protect information from unauthorised access, loss, misuse, alteration, or disclosure. No method of transmission or storage is completely secure, and we cannot guarantee absolute security. You are responsible for protecting your account credentials and notifying us promptly of suspected account compromise.",
    ],
  },
  {
    title: "9. Your Choices and Rights",
    paragraphs: [
      "Subject to applicable law, you may have rights to request access to, correction of, or deletion of personal information, withdraw consent, raise a grievance, or exercise other privacy rights. You may also update certain account details through your account settings, where available, or contact us using the details below.",
      "We may need to verify your identity and the legitimacy of a request before responding. Some information may be retained where required or permitted by law. To exercise a right or withdraw consent, contact [Insert privacy / grievance email].",
    ],
  },
  {
    title: "10. Children’s Privacy",
    paragraphs: [
      "The Platform is intended for business users and is not directed to children. We do not knowingly collect personal information from children in circumstances where parental consent or other safeguards are required. If you believe a child has provided personal information to us, contact us so we can assess and take appropriate action.",
    ],
  },
  {
    title: "11. Third-Party Websites and Services",
    paragraphs: [
      "The Platform may link to third-party websites or use third-party tools. Their privacy practices are governed by their own policies, not this one. We encourage you to review those policies before providing information. We are not responsible for third-party websites, services, or their privacy practices.",
    ],
  },
  {
    title: "12. International Processing",
    paragraphs: [
      "Our service providers or infrastructure may process information in locations outside your state or country. Where information is transferred across borders, we will apply safeguards and comply with applicable legal requirements.",
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Policy to reflect changes to the Platform, our practices, or legal requirements. We will post the revised version on this page and update the “Last Updated” date. Where required by law, we will provide notice or seek consent for material changes.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="terms-page">
      <div className="terms-container">
        <Link href="/" className="terms-back">
          ← Back to Home
        </Link>

        <header className="terms-header">
          <span className="terms-eyebrow">
            ADVIXIO360 | BUSINESS DISCOVERY & PRODUCT MARKETPLACE
          </span>
          <h1>Privacy Policy</h1>
          <p>
            Learn how Advixio360 collects, uses and protects your information.
          </p>
        </header>

        <div className="terms-content">
          {sections.map((section) => (
            <section className="terms-section" key={section.title}>
              <h2>{section.title}</h2>

              {section.paragraphs?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              {section.subsections?.map((subsection) => (
                <div className="terms-subsection" key={subsection.title}>
                  <h3>{subsection.title}</h3>

                  {subsection.paragraphs?.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  {subsection.bullets && (
                    <ul>
                      {subsection.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.after?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <footer className="terms-footer">
          <p>Advixio360 Privacy Policy</p>
          <Link href="/">Return to Homepage</Link>
        </footer>
      </div>
    </main>
  );
}
