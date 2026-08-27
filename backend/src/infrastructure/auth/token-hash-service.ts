import { createHash } from "node:crypto";

import type { TokenHashService } from "@/src/domain/repositories/token-hash-service";

export class Sha256TokenHashService implements TokenHashService {
  hash(token: string): string {
    return createHash("sha256").update(token, "utf8").digest("hex");
  }
}