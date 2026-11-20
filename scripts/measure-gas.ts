import assert from "node:assert/strict";
import type { ContractTransactionResponse } from "ethers";
import { network } from "hardhat";

const { ethers } = await network.create("ganache");
const [admin, firstVoter, secondVoter] = await ethers.getSigners();
if (!admin || !firstVoter || !secondVoter) {
  throw new Error("Gas measurement requires three unlocked Ganache test accounts.");
}

type Measurement = { action: string; gas: bigint; tx: string };

async function record(action: string, transaction: ContractTransactionResponse): Promise<Measurement> {
  const receipt = await transaction.wait();
  if (receipt?.status !== 1) throw new Error(`Gas measurement failed: ${action}`);
  return { action, gas: receipt.gasUsed, tx: receipt.hash };
}

async function measure(contractName: string) {
  const election = await ethers.deployContract(contractName, [], admin);
  const deployment = election.deploymentTransaction();
  if (!deployment) throw new Error(`No deployment transaction for ${contractName}`);

  const rows = [await record("Deploy", deployment)];
  const address = await election.getAddress();
  const firstElection = await ethers.getContractAt(contractName, address, firstVoter);
  const secondElection = await ethers.getContractAt(contractName, address, secondVoter);

  rows.push(await record("Register voter 1", await election.registerVoter(firstVoter.address)));
  rows.push(await record("Register voter 2", await election.registerVoter(secondVoter.address)));
  rows.push(await record("Add candidate 0", await election.addCandidate("An")));
  rows.push(await record("Add candidate 1", await election.addCandidate("Ly")));
  rows.push(await record("Open voting", await election.openVoting()));
  rows.push(await record("First vote for candidate 0", await firstElection.vote(0)));
  rows.push(await record("Second vote for candidate 0", await secondElection.vote(0)));
  rows.push(await record("Close voting", await election.closeVoting()));

  assert.equal(await election.phase(), 2n);
  assert.equal(await election.eligibleVoterCount(), 2n);
  assert.equal(await election.voterStatus(firstVoter.address), 2n);
  assert.equal(await election.voterStatus(secondVoter.address), 2n);
  assert.deepEqual(Array.from(await election.getCandidate(0)), ["An", 2n]);
  assert.deepEqual(Array.from(await election.getCandidate(1)), ["Ly", 0n]);

  return { address, rows };
}

const optimized = await measure("Election");
const baseline = await measure("ElectionTwoMappings");
console.log(`Node: ${await ethers.provider.send("web3_clientVersion", [])}`);
console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);
console.log(`Election: ${optimized.address}`);
console.log(`ElectionTwoMappings: ${baseline.address}`);
console.log("| Action | Election | Two mappings | Gas saved | Election tx | Two mappings tx |");
console.log("| --- | ---: | ---: | ---: | --- | --- |");
for (const [index, row] of optimized.rows.entries()) {
  const comparison = baseline.rows[index];
  assert.equal(row.action, comparison.action);
  console.log(`| ${row.action} | ${row.gas} | ${comparison.gas} | ${comparison.gas - row.gas} | ${row.tx} | ${comparison.tx} |`);
}
