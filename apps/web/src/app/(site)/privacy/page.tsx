export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Privacy Policy
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Information We Collect</h2>
          <p>
            When you create a TechForge account we collect your name, email
            address, and password (stored securely as a salted hash). When you
            place an order we also collect shipping and billing details needed
            to fulfill it.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">
            How We Use Your Information
          </h2>
          <p>
            We use your information to operate your account, process orders, and
            communicate with you about purchases. We do not sell your personal
            information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Cookies &amp; Sessions</h2>
          <p>
            TechForge uses a secure, HTTP-only session cookie to keep you signed
            in. This cookie is required for authenticated features such as your
            cart and order history.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a
              href="mailto:privacy@techforge.dev"
              className="font-medium text-primary hover:underline"
            >
              privacy@techforge.dev
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
