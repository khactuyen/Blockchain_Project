import { randomUUID } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { artifacts, network } from "hardhat";

const { ethers, networkConfig } = await network.create("ganache");
if (networkConfig.type !== "http") {
  throw new Error("The Ganache network must use an HTTP RPC endpoint.");
}

const [admin] = await ethers.getSigners();
if (!admin) {
  throw new Error("Ganache did not provide an account for deployment.");
}

const election = await ethers.deployContract("Election", [], admin);
const transaction = election.deploymentTransaction();
if (!transaction) throw new Error("No Election deployment transaction was created.");
const receipt = await transaction.wait();
if (receipt?.status !== 1) throw new Error("Election deployment did not succeed.");

const { abi } = await artifacts.readArtifact("Election");
const { chainId } = await ethers.provider.getNetwork();
const deployment = {
  rpcUrl: await networkConfig.url.getUrl(),
  chainId: Number(chainId),
  address: await election.getAddress(),
  abi,
};

const directory = new URL("../deployments/", import.meta.url);
const target = new URL("local.json", directory);
const pendingFile = new URL(`.local-${randomUUID()}.json`, directory);
await mkdir(directory, { recursive: true });
try {
  await writeFile(pendingFile, `${JSON.stringify(deployment, null, 2)}\n`, { flag: "wx" });
  await rename(pendingFile, target);
} finally {
  await rm(pendingFile, { force: true });
}

console.log(`Election: ${deployment.address}`);
console.log(`Admin: ${admin.address}`);
console.log(`Chain ID: ${deployment.chainId}`);
console.log(`Deployment transaction: ${receipt.hash}`);
console.log(`Deployment gas: ${receipt.gasUsed}`);
console.log("Wrote deployments/local.json");
