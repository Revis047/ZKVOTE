import crypto from "crypto";

export type Region =
  | "NA"
  | "SA"
  | "EU"
  | "AF"
  | "AS"
  | "OC";

export type OptionId = "climate" | "health" | "space" | "ai" | "freedom";

export interface Credential {
  token: string; // opaque credential
  region: Region;
  issuedAt: number;
}

export interface ProofRequest {
  token: string;
  option: OptionId;
}

export interface Proof {
  proof: string; // opaque string simulating ZK proof
  nullifier: string; // one-vote-per-user enforcement token (hash of token)
  option: OptionId;
}

export interface Tally {
  option: OptionId;
  count: number;
}

export interface Results {
  tallies: Record<OptionId, number>;
  regions: Record<Region, Record<OptionId, number>>;
  totalVotes: number;
}

const regionList: Region[] = ["NA", "SA", "EU", "AF", "AS", "OC"];

// In-memory stores (ephemeral, for demo)
const issued: Map<string, Credential> = new Map();
const pollNullifiers: Map<string, Set<string>> = new Map();
const pollTallies: Map<string, Record<OptionId, number>> = new Map();
const pollRegionTallies: Map<string, Record<Region, Record<OptionId, number>>> = new Map();
let currentPoll: { id: string; endsAt: number } | null = null;
const POLL_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

function emptyTallies() {
  return { climate: 0, health: 0, space: 0, ai: 0, freedom: 0 } as Record<OptionId, number>;
}
function emptyRegionTallies() {
  return Object.fromEntries(
    regionList.map((r) => [r, { climate: 0, health: 0, space: 0, ai: 0, freedom: 0 }]),
  ) as Record<Region, Record<OptionId, number>>;
}

function newPoll() {
  const id = `poll-${Date.now().toString(36)}-${randHex(3)}`;
  const endsAt = Date.now() + POLL_DURATION_MS;
  pollNullifiers.set(id, new Set());
  pollTallies.set(id, emptyTallies());
  pollRegionTallies.set(id, emptyRegionTallies());
  return { id, endsAt };
}

export function getOrCreateCurrentPoll() {
  if (!currentPoll) currentPoll = newPoll();
  if (Date.now() > currentPoll.endsAt) {
    currentPoll = newPoll();
  }
  return currentPoll;
}

function randHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function issueCredential(region?: Region): Credential {
  const token = randHex(32);
  const cred: Credential = {
    token,
    region: region ?? regionList[Math.floor(Math.random() * regionList.length)],
    issuedAt: Date.now(),
  };
  issued.set(token, cred);
  return cred;
}

export function nullifierFromToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateProof(req: ProofRequest): Proof {
  if (!issued.has(req.token)) {
    throw new Error("Unknown credential");
  }
  const nullifier = nullifierFromToken(req.token);
  const material = `${req.token}:${req.option}:${nullifier}`;
  const proof = crypto.createHash("sha512").update(material).digest("hex");
  return { proof, nullifier, option: req.option };
}

export function verifyProof(p: Proof): { valid: true } | { valid: false; reason: string } {
  // Proof must be correctly formed for some issued token
  const token = [...issued.values()].find((c) => nullifierFromToken(c.token) === p.nullifier)?.token;
  if (!token) return { valid: false, reason: "Nullifier not recognized" };
  // recompute proof
  const expected = crypto
    .createHash("sha512")
    .update(`${token}:${p.option}:${p.nullifier}`)
    .digest("hex");
  if (expected !== p.proof) return { valid: false, reason: "Invalid proof" };
  return { valid: true };
}

export function recordVote(pollId: string, p: Proof) {
  const poll = pollTallies.get(pollId);
  const regions = pollRegionTallies.get(pollId);
  const nulls = pollNullifiers.get(pollId);
  if (!poll || !regions || !nulls) throw new Error("Unknown poll");
  if (nulls.has(p.nullifier)) {
    throw new Error("Nullifier already used");
  }
  const holder = [...issued.values()].find((c) => nullifierFromToken(c.token) === p.nullifier);
  if (!holder) throw new Error("No credential for nullifier");
  nulls.add(p.nullifier);
  poll[p.option] += 1;
  regions[holder.region][p.option] += 1;
}

export function getResults(pollId?: string): Results {
  const id = pollId ?? getOrCreateCurrentPoll().id;
  const poll = pollTallies.get(id);
  const regions = pollRegionTallies.get(id);
  if (!poll || !regions) throw new Error("Unknown poll");
  const totalVotes = Object.values(poll).reduce((a, b) => a + b, 0);
  return {
    tallies: { ...(poll as Record<OptionId, number>) },
    regions: JSON.parse(JSON.stringify(regions)) as Results["regions"],
    totalVotes,
  };
}

export function resetAll() {
  issued.clear();
  pollNullifiers.clear();
  pollTallies.clear();
  pollRegionTallies.clear();
  currentPoll = null;
}

export function getCurrentPollInfo() {
  return getOrCreateCurrentPoll();
}
