import { spawn } from "node:child_process";

const spawnPnpm = (args, options = {}) =>
  spawn("pnpm", args, {
    ...options,
    shell: process.platform === "win32",
  });

const stripe = spawnPnpm([
  "exec",
  "stripe",
  "listen",
  "--events",
  "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed",
  "--forward-to",
  "http://localhost:3001/api/payments/stripe/webhook",
]);

let dev;
const stop = () => {
  stripe.kill();
  dev?.kill();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
const handleStripeOutput = (chunk, outputStream) => {
  const output = chunk.toString();
  outputStream.write(output);
  const secret = output.match(/whsec_[A-Za-z0-9_]+/)?.[0];
  if (secret && !dev) {
    dev = spawnPnpm(["exec", "turbo", "run", "dev", "--parallel"], {
      stdio: "inherit",
      env: { ...process.env, STRIPE_WEBHOOK_SECRET: secret },
    });
    dev.on("exit", stop);
  }
};

stripe.stdout.on("data", (chunk) => handleStripeOutput(chunk, process.stdout));
stripe.stderr.on("data", (chunk) => handleStripeOutput(chunk, process.stderr));
stripe.on("error", (error) => {
  console.error(`Unable to start the Stripe listener: ${error.message}`);
  process.exit(1);
});
stripe.on("exit", (code) => process.exit(code ?? 1));
