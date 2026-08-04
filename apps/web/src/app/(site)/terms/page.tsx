export default function TermsOfServicePage() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Terms of Service
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
          <h2 className="mb-2 text-lg font-semibold">Acceptance of Terms</h2>
          <p>
            By creating an account or placing an order on TechForge, you agree
            to be bound by these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Orders &amp; Pricing</h2>
          <p>
            Product prices and availability are subject to change without
            notice. We reserve the right to refuse or cancel any order for any
            reason, including pricing errors or suspected fraud.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">
            Limitation of Liability
          </h2>
          <p>
            TechForge is provided on an &quot;as is&quot; basis. We are not
            liable for any indirect or consequential damages arising from your
            use of the platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of
            TechForge after changes are posted constitutes acceptance of the
            updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:legal@techforge.dev"
              className="font-medium text-primary hover:underline"
            >
              legal@techforge.dev
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
