export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:px-20 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
        <p className="text-sm text-gray-400">Effective Date: June 22, 2025</p>

        <section>
          <p>
            These terms and conditions apply to the Locatr mobile and web application (hereby
            referred to as &quot;Application&quot;), created by Kadir Metin (the &quot;Service
            Provider&quot;) as an open-source service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
          <p>
            By downloading or using the Application, you agree to these terms. You may not copy,
            modify, or extract the source code of the Application. All trademarks, copyrights, and
            other intellectual property belong to the Service Provider.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Modifications & Charges</h2>
          <p>
            The Service Provider may modify the Application or introduce charges at any time. You
            will be notified clearly of any such changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Security & Usage</h2>
          <p>
            You are responsible for the security of your device and access to the Application.
            Jailbreaking or rooting your device is discouraged as it may compromise security and
            affect functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Third-Party Services</h2>
          <p>The Application may use third-party services which have their own terms:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <a
                href="https://www.google.com/analytics/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Google Analytics for Firebase
              </a>
            </li>
            <li>
              <a
                href="https://expo.io/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Expo
              </a>
            </li>
            <li>
              <a
                href="https://www.mapbox.com/legal/tos"
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
          <h2 className="text-xl font-semibold">Internet Access</h2>
          <p>
            Some Application features require internet access. The Service Provider is not
            responsible for the lack of internet connection or usage fees charged by your mobile
            provider.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Device Responsibility</h2>
          <p>
            It is your responsibility to ensure your device is charged and able to access the
            Application. The Service Provider is not liable if you are unable to use the Application
            due to device issues.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Service Limitations</h2>
          <p>
            While efforts are made to keep the Application updated and functional, the Service
            Provider depends on third parties and cannot guarantee uninterrupted accuracy or
            availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Updates & Termination</h2>
          <p>
            The Service Provider may update or discontinue the Application at any time without
            notice. You agree to accept updates when available and cease use if the Application is
            terminated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Changes to These Terms and Conditions</h2>
          <p>
            These terms may be updated occasionally. Please review this page regularly for any
            changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions or feedback about these terms, contact:
            <a href="mailto:info@locatr.tech" className="text-blue-400 underline ml-1">
              info@locatr.tech
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
