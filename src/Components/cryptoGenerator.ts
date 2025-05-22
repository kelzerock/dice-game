const {
  createHash, createHmac
} = await import('node:crypto');
import { v4 as uuidv4 } from 'uuid';

export class CryptoGenerator {
  getHash(key: string) {
    const hash = createHash("SHA3-256");
    hash.update(key);
    return hash.digest("hex");
  }

  createHmac(secret: string) {
    const key = this.getHash(uuidv4());
    const hmac = createHmac("SHA3-256", key).update(secret).digest("hex");
    return { key, hmac }
  }
}