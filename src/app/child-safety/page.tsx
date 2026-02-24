export const metadata = {
  title: 'Child Safety Standards – Mango',
  description: 'Mango child safety and CSAE prevention policy',
};

export default function ChildSafetyPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: 'sans-serif', color: '#111', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Child Safety Standards</h1>
      <p style={{ color: '#555', marginBottom: 32 }}>Last updated: February 2026 · Mango (sn.mango.dating)</p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>Our Commitment</h2>
      <p>
        Mango has a zero-tolerance policy toward child sexual abuse and exploitation (CSAE).
        We are committed to protecting minors and ensuring our platform is never used to harm children in any way.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>Age Requirement</h2>
      <p>
        Mango is strictly for adults aged 18 and older. Users are required to confirm they are at least 18 years old during registration.
        Accounts found to belong to minors will be immediately terminated.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>Prohibited Content</h2>
      <p>The following content is strictly prohibited on Mango:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Any content that sexually exploits or abuses minors (CSAM)</li>
        <li>Any content that solicits, grooms, or endangers minors</li>
        <li>Any attempt to connect with minors for sexual purposes</li>
        <li>Sharing, distributing or encouraging any form of child sexual abuse material</li>
      </ul>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>Reporting</h2>
      <p>
        Mango provides in-app reporting tools that allow users to flag inappropriate content or behavior, including any concerns related to child safety.
        All reports are reviewed and acted upon promptly.
      </p>
      <p>
        Any discovered CSAM is immediately reported to the relevant national authorities and the National Center for Missing &amp; Exploited Children (NCMEC) as required by law.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>Enforcement</h2>
      <p>
        Violations of this policy result in immediate account termination and may be reported to law enforcement.
        We cooperate fully with law enforcement investigations related to child safety.
      </p>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 32 }}>Contact</h2>
      <p>
        To report child safety concerns or CSAE-related issues, contact us at:{' '}
        <a href="mailto:vianney@dunesignature.com" style={{ color: '#E87000' }}>vianney@dunesignature.com</a>
      </p>
    </main>
  );
}
