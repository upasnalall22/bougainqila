import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const CookiePolicy = () => (
  <div className="min-h-screen flex flex-col">
    <SEOHead title="Cookie Policy | BougainQila" description="Learn about how BougainQila uses cookies on our website." canonical="/cookie-policy" />
    <Navbar />
    <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
      <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-3">Legal</p>
      <h1
        className="text-3xl md:text-4xl font-light text-foreground mb-10"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Cookie Policy
      </h1>

      <div className="space-y-8 text-sm text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help us
            remember your preferences, understand how you use our site, and improve your overall experience.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly, including session management and security features.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices, such as newsletter popup dismissal and cookie consent.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website so we can improve the user experience.</li>
            <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">Types of Cookies We Use</h2>
          <div className="border border-border rounded-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Cookie</th>
                  <th className="text-left px-4 py-2 font-medium">Purpose</th>
                  <th className="text-left px-4 py-2 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2">cookie_consent</td>
                  <td className="px-4 py-2">Records your cookie consent preference</td>
                  <td className="px-4 py-2">Persistent</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">newsletter_popup_dismissed</td>
                  <td className="px-4 py-2">Prevents showing the newsletter popup repeatedly</td>
                  <td className="px-4 py-2">Persistent</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Session cookies</td>
                  <td className="px-4 py-2">Maintain your session while browsing</td>
                  <td className="px-4 py-2">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">Managing Cookies</h2>
          <p>
            You can control and delete cookies through your browser settings. Note that disabling certain
            cookies may affect the functionality of our website. Most browsers allow you to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block cookies from specific sites</li>
            <li>Block all cookies</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page
            with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">Contact Us</h2>
          <p>
            If you have questions about our cookie practices, please contact us at{" "}
            <a href="mailto:kavanika@gmail.com" className="text-primary underline">kavanika@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default CookiePolicy;
