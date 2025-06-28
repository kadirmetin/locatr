export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:px-20 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Effective Date: June 22, 2025</p>

        <section>
          <p>
            This privacy policy applies to the Locatr mobile application and web platform (hereby
            referred to as &quot;Application&quot;), created by Kadir Metin (the &quot;Service
            Provider&quot;) as an open-source service. This service is provided &quot;AS IS&quot;.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Information Collection and Use</h2>
          <p>The Application may collect certain information automatically, including:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Your device’s IP address</li>
            <li>Visited pages and time spent</li>
            <li>Your mobile operating system</li>
            <li>Device location (approximate)</li>
          </ul>
          <p>
            The Application uses location data to provide location-based features, analytics, and
            enhancements through third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Personal Data</h2>
          <p>
            For better functionality, you may be asked to provide personally identifiable
            information such as your name and email. This data is used in accordance with this
            policy and never shared without purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Third-Party Services</h2>
          <p>The Application may share anonymized data with the following external services:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <a
                href="https://firebase.google.com/support/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Google Analytics for Firebase
              </a>
            </li>
            <li>
              <a
                href="https://expo.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Expo
              </a>
            </li>
            <li>
              <a
                href="https://www.mapbox.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Mapbox
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Data Disclosure</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>When required by law</li>
            <li>To protect rights, investigate fraud, or comply with legal process</li>
            <li>With trusted partners who act on our behalf under strict confidentiality</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Opt-Out Rights</h2>
          <p>
            You can stop all data collection by uninstalling the mobile app or ceasing to use the
            web version.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Data Retention</h2>
          <p>
            User-provided data is retained as long as the Application is in use and for a reasonable
            period thereafter. To request deletion, email:
            <a href="mailto:info@locatr.tech" className="text-blue-400 underline">
              info@locatr.tech
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Children</h2>
          <p>
            Locatr does not knowingly collect personal data from children under the age of 13. If
            such data is found, it will be deleted. Parents may contact:
            <a href="mailto:info@locatr.tech" className="text-blue-400 underline">
              info@locatr.tech
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Security</h2>
          <p>
            We use physical, electronic, and procedural safeguards to protect your data and maintain
            confidentiality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes to This Policy</h2>
          <p>
            This policy may be updated from time to time. Updates will be reflected on this page.
            Continued use of the Application indicates acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Your Consent</h2>
          <p>
            By using the Application, you consent to the practices outlined in this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact</h2>
          <p>
            For questions about privacy, contact us at:
            <a href="mailto:info@locatr.tech" className="text-blue-400 underline">
              info@locatr.tech
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
