import { RequestHandler } from "express";
import {
  issueCredential,
  generateProof,
  verifyProof,
  recordVote,
  getResults,
  getCurrentPollInfo,
  getOrCreateCurrentPoll,
  type Region,
  type OptionId,
} from "../zk/mock";

export const getPoll: RequestHandler = (_req, res) => {
  const poll = getOrCreateCurrentPoll();
  res.status(200).json(poll);
};

export const postCredential: RequestHandler = (req, res) => {
  const region = (req.body?.region ?? undefined) as Region | undefined;
  try {
    const cred = issueCredential(region);
    res.status(201).json(cred);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Unable to issue credential" });
  }
};

export const postProve: RequestHandler = (req, res) => {
  const { token, option } = req.body as { token?: string; option?: OptionId; pollId?: string };
  if (!token || !option) return res.status(400).json({ error: "token and option are required" });
  try {
    const proof = generateProof({ token, option, pollId: req.body?.pollId });
    res.status(200).json(proof);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Proof generation failed" });
  }
};

export const postVote: RequestHandler = (req, res) => {
  const { proof, nullifier, option, pollId } = req.body as { proof?: string; nullifier?: string; option?: OptionId; pollId?: string };
  if (!proof || !nullifier || !option) return res.status(400).json({ error: "proof, nullifier, option are required" });
  const status = verifyProof({ proof, nullifier, option });
  if (!status.valid) return res.status(400).json({ error: status.reason });
  try {
    const poll = pollId ?? getCurrentPollInfo().id;
    recordVote(poll, { proof, nullifier, option });
    res.status(200).json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Vote failed" });
  }
};

export const getVotes: RequestHandler = (req, res) => {
  try {
    const pollId = (req.query?.pollId as string | undefined) ?? undefined;
    const results = getResults(pollId);
    res.status(200).json(results);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Unable to get results" });
  }
};
