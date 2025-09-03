/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ZKVote shared types
export type OptionId = "climate" | "health" | "space" | "ai" | "freedom";
export type Region = "NA" | "SA" | "EU" | "AF" | "AS" | "OC";

export interface Credential {
  token: string;
  region: Region;
  issuedAt: number;
}

export interface Proof {
  proof: string;
  nullifier: string;
  option: OptionId;
  tokenHash?: string;
}

export interface Results {
  tallies: Record<OptionId, number>;
  regions: Record<Region, Record<OptionId, number>>;
  totalVotes: number;
}

export interface PollInfo {
  id: string;
  endsAt: number; // ms epoch
}
