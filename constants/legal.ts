export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  title: string;
  subtitle: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}

export const TermsOfService: LegalDoc = {
  title: 'Terms of Service',
  subtitle: 'Hair by the Minute (HBTM)',
  effectiveDate: 'July 22, 2026',
  intro:
    'These Terms of Service ("Terms") govern your access to and use of the Hair by the Minute beta website, application, and the Hair IQ Interface (collectively, the "Service"), operated by Hair by the Minute ("HBTM," "we," "us," or "our"). By creating an account, taking the quiz, or otherwise using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.',
  sections: [
    {
      heading: '1. About This Service — MVP / Beta Testing Notice',
      blocks: [
        {
          type: 'paragraph',
          text: 'The Service is currently an early-stage minimum viable product (MVP) offered as a beta test. It is provided strictly for the purposes of testing, feedback collection, and product development. The Service is not a finished commercial product, and features, availability, and functionality may change, break, or be removed at any time without notice.',
        },
        {
          type: 'paragraph',
          text: 'By participating, you understand and agree that:',
        },
        {
          type: 'bullets',
          items: [
            'You are participating as a tester, not as an employee, contractor, partner, or paid participant.',
            'No compensation of any kind — monetary or otherwise — will be provided to you for using the Service, submitting feedback, participating in the beta community, or for any other form of participation.',
            'The Service may contain bugs, errors, inaccuracies, or incomplete features, and is provided on an "as is" and "as available" basis, without warranties of any kind.',
          ],
        },
      ],
    },
    {
      heading: '2. Eligibility & Age Requirement',
      blocks: [
        {
          type: 'paragraph',
          text: 'You must be at least 13 years old to create an account, submit information (including your email address), or otherwise use the Service. This age requirement applies without exception to any collection of personal information, including account registration and email sign-up.',
        },
        {
          type: 'paragraph',
          text: 'If you are between the ages of 13 and 17, you represent that you have obtained permission from a parent or legal guardian to use the Service and to provide any personal information in connection with it. HBTM does not knowingly collect personal information from anyone under the age of 13. If we learn that we have collected information from a child under 13, we will delete that information promptly. If you believe a child under 13 has provided us with personal information, please contact us at hairbytheminute@gmail.com.',
        },
      ],
    },
    {
      heading: '3. Description of the Service',
      blocks: [
        {
          type: 'paragraph',
          text: 'Hair by the Minute provides the Hair IQ Interface, an intake questionnaire and AI-assisted tool that collects information you provide (such as responses about your hair type, texture, porosity, styling habits, and scalp condition) and generates a personalized hair profile, along with routine, ingredient, and product guidance based on that profile. The Service is informational and educational in nature.',
        },
      ],
    },
    {
      heading: '4. AI Disclaimer',
      blocks: [
        {
          type: 'paragraph',
          text: 'The Hair IQ Interface uses artificial intelligence, including third-party AI models and services, to analyze your quiz responses and generate personalized profiles, routines, and recommendations.',
        },
        {
          type: 'paragraph',
          text: 'You acknowledge and agree that:',
        },
        {
          type: 'bullets',
          items: [
            'AI-generated output is based on patterns in data and may be incomplete, inaccurate, generic, or simply wrong for your specific hair, scalp, or skin condition.',
            'Recommendations provided through the Service are not professional, cosmetological, dermatological, or medical advice, and are not a substitute for consultation with a licensed stylist, dermatologist, physician, or other qualified professional.',
            'You are solely responsible for evaluating any recommendation before acting on it, including testing any suggested product on a small area first and discontinuing use if you experience any adverse reaction.',
            'HBTM does not guarantee any particular outcome, result, or improvement to your hair or scalp from following AI-generated guidance.',
          ],
        },
      ],
    },
    {
      heading: '5. User-Generated Content',
      blocks: [
        {
          type: 'paragraph',
          text: 'As part of the beta community, you may be permitted to submit content such as comments, photos, reviews, questions, or feedback ("User Content").',
        },
        {
          type: 'paragraph',
          text: 'Content guidelines. You agree not to post User Content that:',
        },
        {
          type: 'bullets',
          items: [
            'Is false, misleading, defamatory, or impersonates another person;',
            'Is obscene, harassing, hateful, threatening, or discriminatory;',
            "Infringes another person's intellectual property, privacy, or other rights;",
            'Contains medical, diagnostic, or treatment claims (e.g., claiming to cure or treat a medical condition);',
            'Promotes illegal activity, spam, or unauthorized advertising;',
            'Contains personal information about another individual without their consent.',
          ],
        },
        {
          type: 'paragraph',
          text: 'If you are unsure whether specific content is appropriate, do not post it, or check with us first at hairbytheminute@gmail.com.',
        },
        {
          type: 'paragraph',
          text: 'Moderation. HBTM may, but is not obligated to, monitor, review, edit, or remove any User Content at our sole discretion, without notice, and for any reason, including violation of these guidelines.',
        },
        {
          type: 'paragraph',
          text: 'License and ownership. By submitting User Content, you grant HBTM a worldwide, royalty-free, perpetual, irrevocable, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, display, and distribute that content in connection with operating, promoting, and improving the Service. See Section 7 (Intellectual Property) for further detail.',
        },
      ],
    },
    {
      heading: '6. Account Terms',
      blocks: [
        {
          type: 'bullets',
          items: [
            'You must provide accurate and current information when creating an account.',
            'You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.',
            'You may not share your account, create an account on behalf of someone else without authorization, or maintain more than one account without our permission.',
            'You must notify us promptly at hairbytheminute@gmail.com of any unauthorized use of your account.',
          ],
        },
      ],
    },
    {
      heading: '7. Termination',
      blocks: [
        {
          type: 'paragraph',
          text: 'By you. You may stop using the Service and request deletion of your account at any time by contacting hairbytheminute@gmail.com.',
        },
        {
          type: 'paragraph',
          text: 'By HBTM. Because this is a beta test, HBTM may suspend, limit, or terminate your access to the Service, or discontinue the Service entirely, at any time, with or without notice or cause, including but not limited to violations of these Terms, misuse of the Service, or discontinuation of the beta program.',
        },
        {
          type: 'paragraph',
          text: 'Upon termination, your right to use the Service ends immediately. Sections of these Terms that by their nature should survive termination (including Intellectual Property, Limitation of Liability, and Dispute Resolution) will survive.',
        },
      ],
    },
    {
      heading: '8. Intellectual Property',
      blocks: [
        {
          type: 'paragraph',
          text: 'The Service, including the Hair IQ Interface, all underlying software, algorithms, quiz content, design, branding, and AI-generated outputs (such as generated hair profiles, routines, and recommendations), is and remains the exclusive property of Hair by the Minute. Nothing in these Terms grants you any ownership interest in the Service.',
        },
        {
          type: 'paragraph',
          text: 'As described in Section 5, any User Content you submit is licensed to HBTM as described above, and to the fullest extent permitted by law, HBTM shall own all right, title, and interest (including intellectual property rights) in any feedback, suggestions, or ideas you submit regarding the Service. You waive any moral rights you may have in such contributions to the extent permitted by law.',
        },
        {
          type: 'paragraph',
          text: "You may not copy, modify, reverse-engineer, distribute, or create derivative works from the Service or any of its content without HBTM's prior written consent.",
        },
      ],
    },
    {
      heading: '9. Limitation of Liability',
      blocks: [
        {
          type: 'paragraph',
          text: 'No liability for incidents arising from use of the Service. To the fullest extent permitted by law, HBTM, its founders, employees, contractors, and affiliates shall not be liable for any injury, allergic reaction, product outcome, hair or scalp damage, dissatisfaction, data loss, or any other direct, indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the Service — including reliance on any AI-generated recommendation, routine, or product suggestion — regardless of the legal theory asserted, even if HBTM has been advised of the possibility of such damages.',
        },
        {
          type: 'paragraph',
          text: 'As-is basis. The Service is provided "as is" and "as available," without warranties of any kind, whether express, implied, or statutory, including implied warranties of merchantability, fitness for a particular purpose, non-infringement, or accuracy of results.',
        },
        {
          type: 'paragraph',
          text: "Cap on liability. Because the Service is provided free of charge as part of a beta test, HBTM's total aggregate liability arising from or related to these Terms or the Service shall not exceed fifty U.S. dollars ($50).",
        },
        {
          type: 'paragraph',
          text: 'Assumption of risk. You expressly assume all risk associated with using any information, routine, or recommendation provided through the Service on your hair, scalp, or skin.',
        },
        {
          type: 'paragraph',
          text: 'Some jurisdictions do not allow certain limitations of liability, so some of the above limitations may not apply to you.',
        },
      ],
    },
    {
      heading: '10. Indemnification',
      blocks: [
        {
          type: 'paragraph',
          text: 'You agree to defend, indemnify, and hold harmless HBTM and its founders, employees, and affiliates from any claims, damages, liabilities, and expenses (including reasonable attorneys\' fees) arising out of your use of the Service, your violation of these Terms, or your violation of any rights of a third party.',
        },
      ],
    },
    {
      heading: '11. Dispute Resolution & Governing Law',
      blocks: [
        {
          type: 'paragraph',
          text: 'Governing law. These Terms are governed by the laws of the State of Maryland, without regard to its conflict of laws principles.',
        },
        {
          type: 'paragraph',
          text: 'Informal resolution first. Before filing a claim, you agree to first contact us at hairbytheminute@gmail.com so we can attempt to resolve the dispute informally.',
        },
        {
          type: 'paragraph',
          text: 'Venue. If a dispute cannot be resolved informally, you agree that any legal action or proceeding arising out of or relating to these Terms or the Service shall be brought exclusively in the state or federal courts located in Maryland, and you consent to the personal jurisdiction of those courts. Nothing in this section prevents either party from bringing an individual claim in small claims court.',
        },
      ],
    },
    {
      heading: '12. Changes to These Terms',
      blocks: [
        {
          type: 'paragraph',
          text: 'We may update these Terms from time to time, particularly as the Service moves from beta to a full release. If we make material changes, we will notify users through the Service or by email. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.',
        },
      ],
    },
    {
      heading: '13. General',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Severability. If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.',
            'No waiver. Our failure to enforce any provision is not a waiver of that provision.',
            'Assignment. You may not assign these Terms; HBTM may assign these Terms in connection with a merger, acquisition, or sale of assets.',
            'Entire agreement. These Terms, together with our Privacy Policy, constitute the entire agreement between you and HBTM regarding the Service.',
          ],
        },
      ],
    },
    {
      heading: '14. Contact',
      blocks: [
        {
          type: 'paragraph',
          text: 'Questions about these Terms? Contact us at hairbytheminute@gmail.com.',
        },
      ],
    },
  ],
};

export const PrivacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  subtitle: 'Hair by the Minute (HBTM)',
  effectiveDate: 'July 22, 2026',
  intro:
    'This Privacy Policy explains how Hair by the Minute ("HBTM," "we," "us," or "our") collects, uses, stores, and shares information when you use our beta website and the Hair IQ Interface (collectively, the "Service"). Please read this Policy carefully. By using the Service, you agree to the practices described here.',
  sections: [
    {
      heading: '1. Age Requirement',
      blocks: [
        {
          type: 'paragraph',
          text: "The Service is intended for users 13 years of age and older. We do not knowingly collect personal information, including email addresses, from anyone under 13. If you are between 13 and 17, you must have a parent or guardian's permission to use the Service and provide any information. If we become aware that we have collected information from a child under 13, we will delete it as soon as possible. Parents or guardians who believe their child has submitted information to us may contact hairbytheminute@gmail.com to request deletion.",
        },
      ],
    },
    {
      heading: '2. Information We Collect',
      blocks: [
        {
          type: 'paragraph',
          text: 'We collect the following categories of information:',
        },
        {
          type: 'bullets',
          items: [
            'a. Quiz and hair/scalp profile data. Responses you submit through the Hair IQ Interface intake questionnaire, including information about your hair type, texture, porosity, curl pattern, styling habits, goals, and scalp condition ("Hair & Scalp Data").',
            'b. Account information. Name, email address, password (stored in encrypted/hashed form), and any profile details you choose to provide.',
            'c. Usage data. Information about how you interact with the Service, including pages viewed, features used, session duration, device type, browser type, operating system, and IP address.',
            'd. Communications. Feedback, survey responses, support requests, and any User Content you submit (see our Terms of Service for User Content rules).',
          ],
        },
      ],
    },
    {
      heading: '3. Important Note on Hair & Scalp Data — Not Medical Data',
      blocks: [
        {
          type: 'paragraph',
          text: 'Some of the information collected through the Hair IQ Interface (such as scalp condition) may resemble health-adjacent information. We want to be explicit: Hair & Scalp Data collected through the Service is not medical, diagnostic, or clinical data. It is not collected, stored, or processed as a medical record, is not reviewed by a licensed medical or dermatological professional as part of the Service, and is not intended to diagnose, treat, cure, or prevent any disease or condition. It is treated as ordinary user profile data used solely to generate personalized hair-care content.',
        },
        {
          type: 'paragraph',
          text: 'How this data is stored: Hair & Scalp Data is stored using Supabase, our secure cloud database and authentication provider, encrypted in transit (e.g., via TLS/HTTPS) and at rest, with row-level access controls so each account can only access its own data. It is stored alongside your account profile and is retained according to the timelines in Section 8 below.',
        },
        {
          type: 'paragraph',
          text: 'If you have an actual medical or dermatological concern, please consult a licensed physician or dermatologist. Do not rely on the Service as a substitute for professional medical care.',
        },
      ],
    },
    {
      heading: '4. How We Use Your Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use the information we collect to:',
        },
        {
          type: 'bullets',
          items: [
            'Generate your personalized hair profile, routines, and product/ingredient recommendations through the Hair IQ Interface;',
            'Create and maintain your account;',
            'Operate, troubleshoot, and improve the Service, including analyzing usage patterns during this beta period;',
            'Communicate with you, including sending emails about the Service, product updates, or requesting feedback;',
            'Monitor for misuse, fraud, or violations of our Terms of Service;',
            'Comply with legal obligations.',
          ],
        },
      ],
    },
    {
      heading: '5. How AI Processes Your Information',
      blocks: [
        {
          type: 'paragraph',
          text: 'The Hair IQ Interface uses artificial intelligence to analyze your quiz responses, generate your personalized profile and routine, and power the in-app chat assistant. This processing is performed using a third-party AI service — currently Google\'s Gemini API (provided by Google). When your data is processed by this provider:',
        },
        {
          type: 'bullets',
          items: [
            'It is transmitted to that provider solely to generate your requested output (e.g., your hair profile or routine recommendations);',
            'Providers may process data on servers outside your state or country;',
            'We select providers that maintain reasonable data protection safeguards, but we do not control their internal systems, and their use of your data is also governed by their own privacy terms.',
          ],
        },
        {
          type: 'paragraph',
          text: "We do not use your Hair & Scalp Data to train publicly available third-party AI models unless a provider's standard terms otherwise apply; where possible, we take reasonable steps to limit further use of your data by our AI providers to the purpose of providing the Service.",
        },
      ],
    },
    {
      heading: '6. Third-Party Sharing',
      blocks: [
        {
          type: 'paragraph',
          text: 'We do not sell your personal information. We may share information with the following categories of service providers, solely to operate the Service:',
        },
        {
          type: 'bullets',
          items: [
            'Cloud infrastructure — Supabase, which provides the database, authentication, and hosting where your account, hair profile, and tracking data are stored.',
            'AI service provider — Google (Gemini API), to generate hair profiles, routines, and chat responses (see Section 5).',
            'Analytics provider — PostHog, to understand usage and improve the Service during beta testing.',
            'Email/communications platforms (e.g., providers used to send account, support, or product update emails) — to communicate with you.',
            'Payment processors — if and when the Service introduces any paid features in the future, a third-party payment processor would handle payment information; we do not currently collect payment information as part of this free beta.',
            'Legal/safety disclosures — if required to comply with a law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of HBTM, our users, or others.',
            'Business transfers — if HBTM is involved in a merger, acquisition, or sale of assets, information may be transferred as part of that transaction, subject to this Policy.',
          ],
        },
      ],
    },
    {
      heading: '7. Cookies & Tracking Technologies',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use cookies and similar tracking technologies (such as pixels or local storage) to:',
        },
        {
          type: 'bullets',
          items: [
            'Keep you logged in and remember preferences (essential/functional cookies);',
            'Understand how users interact with the Service (analytics cookies);',
            'Improve the Service during beta testing.',
          ],
        },
        {
          type: 'paragraph',
          text: 'You can control cookies through your browser settings, including blocking or deleting them; note that disabling essential cookies may affect Service functionality. We do not currently use cookies for third-party advertising.',
        },
      ],
    },
    {
      heading: '8. Data Retention & Your Deletion Rights',
      blocks: [
        {
          type: 'paragraph',
          text: 'We retain your information for as long as your account is active or as needed to operate the Service, improve it during this beta period, and comply with legal obligations. You may, at any time:',
        },
        {
          type: 'bullets',
          items: [
            'Request access to the personal information we hold about you;',
            'Request correction of inaccurate information;',
            'Request deletion of your account and associated data;',
            'Request a copy of your data in a portable format.',
          ],
        },
        {
          type: 'paragraph',
          text: 'To exercise any of these rights, contact us at hairbytheminute@gmail.com. We will respond within a reasonable time and in accordance with applicable law. We may retain limited information where required for legal, security, or fraud-prevention purposes even after a deletion request.',
        },
      ],
    },
    {
      heading: '9. California Privacy Rights (CCPA/CPRA)',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you are a California resident, you have the right to:',
        },
        {
          type: 'bullets',
          items: [
            'Know what personal information we collect, use, and disclose, and the categories/sources of that information;',
            'Request deletion of your personal information;',
            'Request correction of inaccurate personal information;',
            'Opt out of the "sale" or "sharing" of personal information (we do not sell or share your personal information for cross-context behavioral advertising);',
            'Not be discriminated against for exercising your privacy rights.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Categories of personal information we collect generally fall under: identifiers (e.g., name, email), internet/network activity (e.g., usage data), and other information you voluntarily provide (e.g., Hair & Scalp Data, User Content). To exercise your California privacy rights, contact hairbytheminute@gmail.com. We will verify your request using the information associated with your account before responding.',
        },
      ],
    },
    {
      heading: '10. GDPR / International Users',
      blocks: [
        {
          type: 'paragraph',
          text: 'If you access the Service from the European Economic Area (EEA), United Kingdom, or other regions with similar data protection laws, the following applies:',
        },
        {
          type: 'bullets',
          items: [
            'Legal basis for processing. We process your information based on: your consent (e.g., when you submit quiz responses or sign up), performance of our Terms of Service with you, and our legitimate interests in operating and improving the Service.',
            'Your rights. Subject to applicable law, you have the right to access, correct, delete, restrict, or object to our processing of your personal information, and the right to data portability. You may also withdraw consent at any time where processing is based on consent, without affecting the lawfulness of processing before withdrawal.',
            'International transfers. Because our Service and its third-party providers (including AI and cloud infrastructure providers described in Sections 5–6) may process data in the United States or other countries, your information may be transferred internationally. We take reasonable steps to ensure appropriate safeguards are in place for such transfers where required by law.',
            'Complaints. You have the right to lodge a complaint with your local data protection supervisory authority.',
          ],
        },
        {
          type: 'paragraph',
          text: 'To exercise any of these rights, contact hairbytheminute@gmail.com.',
        },
      ],
    },
    {
      heading: '11. Data Security',
      blocks: [
        {
          type: 'paragraph',
          text: 'We use reasonable administrative, technical, and organizational measures (such as encryption in transit and at rest, and restricted access) designed to protect your information. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security, particularly during this beta testing period.',
        },
      ],
    },
    {
      heading: '12. Changes to This Privacy Policy',
      blocks: [
        {
          type: 'paragraph',
          text: 'We may update this Privacy Policy from time to time, particularly as the Service develops beyond its current beta stage. If we make material changes, we will notify you through the Service or by email. The "Effective Date" at the top of this Policy reflects the most recent revision.',
        },
      ],
    },
    {
      heading: '13. Contact Us',
      blocks: [
        {
          type: 'paragraph',
          text: 'For any privacy-related questions, requests, or concerns, contact us at:\nEmail: hairbytheminute@gmail.com',
        },
      ],
    },
  ],
};
