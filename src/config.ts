export const config = {
  stripe: {
    publishableKey: process.env.publishableKey,
    secretKey: process.env.secretKey,
    proPriceId: process.env.proPriceId,
    webhookSecret: process.env.webhookSecret,
  }
}