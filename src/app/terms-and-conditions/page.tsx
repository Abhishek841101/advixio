import Link from "next/link";

const terms = [
  {
    title: "1. Introduction and Acceptance",
    content: [
      "These Terms and Conditions (“Terms”) govern your access to and use of Advixio360, including the website www.advixio360.com, its pages, features, listings, and related services (collectively, the “Platform”). The Platform is operated by Advixio360, having its registered office at Nagpur (“Advixio360”, “we”, “us”, or “our”).",
      "By accessing or using the Platform, creating an account, submitting a listing, contacting a supplier, or otherwise using any Platform feature, you agree to these Terms. If you do not agree, do not use the Platform. If you use the Platform on behalf of a business or other entity, you represent that you are authorised to bind that entity.",
    ],
  },
  {
    title: "2. About the Platform",
    content: [
      "Advixio360 is a business discovery and product marketplace that enables users to discover products, view supplier profiles and listings, showcase business offerings, and connect with other businesses or potential buyers. Unless expressly stated in a separate written agreement, Advixio360 is a platform intermediary and is not the manufacturer, seller, buyer, distributor, delivery provider, or contracting party to transactions between users.",
      "Product availability, specifications, pricing, minimum order quantities, delivery terms, warranties, and other commercial details are provided by the relevant supplier or listing owner and should be confirmed directly before placing an order or making a business decision.",
    ],
  },
  {
    title: "3. Eligibility and Account Registration",
    content: [
      "You must be legally capable of entering into a binding agreement under applicable law to use the Platform. Where you create an account for a business, you must have authority to represent that business. You agree to provide accurate, current, and complete registration information and to keep it updated.",
      "You are responsible for maintaining the confidentiality of your login credentials and for activities carried out through your account. Notify us promptly if you suspect unauthorised access. We may refuse registration, suspend, or close accounts where information is inaccurate, misuse is suspected, or these Terms are breached.",
    ],
  },
  {
    title: "4. User Roles and Responsibilities",
    subsections: [
      {
        title: "4.1 Buyers and visitors",
        content: "Buyers and visitors must conduct their own due diligence before contacting a supplier, purchasing goods, sharing business information, or entering into a transaction. Verify supplier identity, product quality, certifications, tax details, price, payment instructions, delivery commitments, and applicable terms independently.",
      },
      {
        title: "4.2 Suppliers and listing owners",
        content: "Suppliers are responsible for the accuracy, legality, completeness, and timely updating of their profiles, product listings, images, descriptions, prices, specifications, inventory, certifications, and contact details. Suppliers must have the rights and permissions needed to publish all submitted material and must comply with applicable laws, including product-specific rules, consumer-protection requirements, taxation, intellectual-property laws, and advertising standards.\n\nSuppliers must not publish false, misleading, counterfeit, prohibited, unsafe, or unauthorised products or claims. Suppliers are solely responsible for fulfilment, invoicing, taxes, shipping, returns, warranties, after-sales service, and resolving disputes arising from their transactions, unless a separate written agreement states otherwise.",
      },
    ],
  },
  {
    title: "5. Listings, Content, and Platform Information",
    content: [
      "The Platform may display information submitted by users or obtained from third-party sources. We do not guarantee that any listing, profile, image, specification, price, review, or other information is accurate, complete, current, or independently verified. Any verification label or review process, if offered, is limited in scope and is not a guarantee of a user's identity, product quality, performance, compliance, or reliability.",
      "We may review, edit for formatting, decline, remove, or restrict content at our discretion, including where content appears unlawful, misleading, infringing, harmful, or inconsistent with Platform policies. Such action does not create an obligation to monitor all content.",
    ],
  },
  {
    title: "6. Acceptable Use",
    content: ["You agree not to:"],
    bullets: [
      "use the Platform for unlawful, fraudulent, deceptive, or harmful purposes;",
      "post false, misleading, defamatory, abusive, discriminatory, obscene, or infringing content;",
      "list counterfeit, stolen, prohibited, unsafe, or restricted goods, or misrepresent a product's origin or certification;",
      "scrape, harvest, copy, or collect Platform data or user contact details through automated means without written permission;",
      "interfere with the Platform's operation, security, or access controls, or introduce malware or harmful code;",
      "impersonate another person or business, manipulate reviews or enquiries, or send spam or unsolicited bulk communications;",
      "circumvent Platform fees, controls, or account restrictions, where applicable; or",
      "use Platform content, trademarks, or data in a way that violates applicable law or another party's rights.",
    ],
  },
  {
    title: "7. Enquiries, Orders, Payments, and Transactions",
    content: [
      "Unless a specific feature expressly states otherwise, enquiries and transactions are arranged directly between buyers and suppliers. Advixio360 does not guarantee that an enquiry will receive a response, that a supplier will accept an order, or that a transaction will be completed. Users should document agreed terms in writing.",
      "If the Platform introduces payment, subscription, promotional, or other paid features, the applicable fees, billing cycle, taxes, renewal terms, cancellation process, and refund policy will be disclosed separately. You agree to pay charges properly incurred through your account. Do not rely on payment instructions received outside verified channels without independently confirming them with the relevant party.",
    ],
  },
  {
    title: "8. Fees, Plans, and Promotions",
    content: [
      "Certain supplier, advertising, listing, or account features may be offered on a paid or subscription basis. Details will be shown at the time of purchase or in the applicable plan terms. We may change prices or features prospectively with reasonable notice where required. Promotional offers may be subject to additional conditions and may be withdrawn or modified as permitted by law.",
    ],
  },
  {
    title: "9. Intellectual Property",
    content: [
      "The Platform's software, design, layout, branding, logos, text, and other materials owned by Advixio360 are protected by applicable intellectual-property laws. Except as expressly permitted, you may not copy, modify, distribute, reproduce, reverse engineer, or commercially exploit them without our prior written consent.",
      "You retain ownership of content you submit. By submitting content, you grant Advixio360 a non-exclusive, worldwide, royalty-free licence to host, store, reproduce, display, format, and use that content as reasonably necessary to operate, promote, and improve the Platform and provide the relevant services. You represent that you have the rights to grant this licence. You may request removal of your content, subject to legal, operational, and record-retention needs.",
    ],
  },
  {
    title: "10. Third-Party Services and Links",
    content: [
      "The Platform may contain links to third-party websites, tools, payment providers, or services. These are provided for convenience only. Advixio360 does not control or endorse third-party content, policies, products, or services and is not responsible for their availability, security, or actions. Your use of third-party services is subject to their own terms and privacy policies.",
    ],
  },
  {
    title: "11. Privacy and Personal Information",
    content: [
      "Our collection and use of personal information is described in our Privacy Policy, which should be read together with these Terms. By using the Platform, you acknowledge that information may be processed as described in that policy and in accordance with applicable data-protection laws. Please insert and link the final Privacy Policy here: [Privacy Policy URL].",
    ],
  },
  {
    title: "12. Disclaimers",
    content: [
      "To the maximum extent permitted by applicable law, the Platform is provided on an “as is” and “as available” basis. We do not warrant uninterrupted or error-free access, or that listings, supplier information, products, services, or user conduct will meet your expectations. We disclaim implied warranties to the extent legally permitted.",
      "Advixio360 does not make guarantees regarding product quality, merchantability, fitness for a particular purpose, title, non-infringement, supplier capability, or transaction outcomes, except where such guarantees cannot be excluded under applicable law.",
    ],
  },
  {
    title: "13. Limitation of Liability",
    content: [
      "To the extent permitted by applicable law, Advixio360 and its directors, employees, affiliates, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive losses, loss of profits, business, data, goodwill, or opportunities, or losses arising from user-to-user dealings, inaccurate listings, products, delivery, payment, or third-party conduct.",
      "To the extent permitted by law, our aggregate liability arising from or relating to the Platform will be limited to the amount, if any, paid by you directly to Advixio360 for the relevant Platform service during the three months preceding the event giving rise to the claim. Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law.",
    ],
  },
  {
    title: "14. Indemnity",
    content: [
      "You agree, to the extent permitted by law, to indemnify and hold harmless Advixio360 and its directors, employees, and affiliates from claims, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from your content, listings, products, transactions, misuse of the Platform, violation of these Terms, or infringement of another party's rights.",
    ],
  },
  {
    title: "15. Suspension and Termination",
    content: [
      "We may suspend, restrict, or terminate your access to the Platform if we reasonably believe you have violated these Terms, created risk or legal exposure, supplied inaccurate information, or misused the Platform, or where required by law. You may stop using the Platform at any time and may request account closure through [Insert support email]. Provisions that by their nature should survive termination will continue to apply.",
    ],
  },
  {
    title: "16. Changes to the Platform or Terms",
    content: [
      "We may update, modify, suspend, or discontinue any Platform feature and may revise these Terms from time to time. The updated version will be posted on this page with a revised “Last Updated” date. Changes will take effect as stated in the updated Terms or as required by law. Continued use after the effective date constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "17. Governing Law and Dispute Resolution",
    content: [
      "These Terms are governed by the laws of India, without regard to conflict-of-law principles. Subject to any mandatory consumer or other legal rights, courts located in [Insert city and state, India] will have jurisdiction over disputes arising from these Terms or the Platform.",
      "Before initiating formal proceedings, parties are encouraged to contact us at [Insert support email] and attempt to resolve the dispute in good faith. This does not restrict any statutory rights or remedies.",
    ],
  },
  {
    title: "18. Grievance and Contact Details",
    content: ["For questions, complaints, notices, or requests relating to these Terms or the Platform, contact:"],
    bullets: [
      "Platform: Advixio360",
      "Website: www.advixio360.com",
      "Legal entity: Advixio360",
      "Support email: advixio12@gmai.com",
      "Contact number: +91 8530955850",
    ],
  },
  {
    title: "19. General Provisions",
    content: [
      "If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect. Our failure to enforce a provision is not a waiver. You may not assign your rights or obligations under these Terms without our prior written consent; we may assign them as part of a business reorganisation, merger, or transfer, subject to law. These Terms, together with policies expressly incorporated by reference and any applicable feature-specific terms, form the agreement between you and Advixio360 concerning your use of the Platform.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="terms-page">
      <div className="terms-container">
        <Link href="/" className="terms-back">
          ← Back to Home
        </Link>

        <header className="terms-header">
          <span className="terms-eyebrow">ADVIXIO360 | BUSINESS DISCOVERY & PRODUCT MARKETPLACE</span>
          <h1>Terms and Conditions</h1>
          <p>Please read these terms carefully before using Advixio360.</p>
        </header>

        <div className="terms-content">
          {terms.map((section, index) => (
            <section className="terms-section" key={section.title}>
              <h2>{section.title}</h2>

              {section.content?.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}

              {section.subsections?.map((subsection) => (
                <div className="terms-subsection" key={subsection.title}>
                  <h3>{subsection.title}</h3>
                  {subsection.content.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ))}

              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="terms-footer">
          <p>Advixio360 Terms and Conditions</p>
          <Link href="/">Return to Homepage</Link>
        </footer>
      </div>
    </main>
  );
}