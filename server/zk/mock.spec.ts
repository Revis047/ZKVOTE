import { describe, it, expect, beforeEach } from "vitest";
import {
  issueCredential,
  generateProof,
  verifyProof,
  recordVote,
  getResults,
  resetAll,
  getOrCreateCurrentPoll,
} from "./mock";

import type { OptionId } from "./mock";

const options: OptionId[] = ["climate", "health", "space", "ai", "freedom"];

describe("mock ZK flow", () => {
  beforeEach(() => resetAll());

  it("issues credential and generates valid proof", () => {
    const cred = issueCredential("EU");
    const pr = { token: cred.token, option: "ai" as OptionId };
    const proof = generateProof(pr);
    const res = verifyProof(proof);
    expect(res).toEqual({ valid: true });
  });

  it("rejects invalid proof for wrong option", () => {
    const cred = issueCredential("AS");
    const p1 = generateProof({ token: cred.token, option: "space" });
    const tampered = { ...p1, option: "ai" as OptionId };
    const res = verifyProof(tampered);
    expect(res).toEqual({
      valid: false,
      reason: expect.stringContaining("Invalid proof"),
    });
  });

  it("enforces one vote per nullifier", () => {
    const poll = getOrCreateCurrentPoll();
    const cred = issueCredential("NA");
    const p = generateProof({ token: cred.token, option: "health" }) as any;
    const v1 = verifyProof(p);
    expect(v1).toEqual({ valid: true });
    recordVote(poll.id, { ...p, region: cred.region } as any);
    expect(() =>
      recordVote(poll.id, { ...p, region: cred.region } as any),
    ).toThrow(/already used/);
  });

  it("tallies results correctly", () => {
    const poll = getOrCreateCurrentPoll();
    const c1 = issueCredential("EU");
    const c2 = issueCredential("EU");
    const c3 = issueCredential("AF");
    [c1, c2, c3].forEach((c, i) => {
      const proof = generateProof({
        token: c.token,
        option: options[i],
      }) as any;
      recordVote(poll.id, { ...proof, region: c.region } as any);
    });
    const results = getResults(poll.id);
    expect(results.totalVotes).toBe(3);
    expect(Object.values(results.tallies).reduce((a, b) => a + b, 0)).toBe(3);
  });
});
