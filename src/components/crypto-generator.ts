const {
  createHmac, randomBytes
} = await import('node:crypto');

export class CryptoGenerator {

  getHmac(secret: string) {
    const key = randomBytes(32).toString("hex");
    const hmac = createHmac("SHA3-256", key).update(secret).digest("hex");
    return { key, hmac }
  }
}