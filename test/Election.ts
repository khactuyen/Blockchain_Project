import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

describe("Election", function () {
  async function deployElection() {
    const [owner, alice, bob, visitor] = await ethers.getSigners();
    const election = await ethers.deployContract("Election", [], owner);
    const address = await election.getAddress();
    return {
      election,
      owner,
      alice,
      bob,
      visitor,
      aliceElection: await ethers.getContractAt("Election", address, alice),
      bobElection: await ethers.getContractAt("Election", address, bob),
      publicElection: await ethers.getContractAt("Election", address, visitor),
    };
  }

  async function openElection() {
    const fixture = await deployElection();
    const { election, alice, bob } = fixture;
    await election.registerVoter(alice.address);
    await election.registerVoter(bob.address);
    await election.addCandidate("An");
    await election.addCandidate("Binh");
    await election.openVoting();
    return fixture;
  }

  it("starts in Setup with the deployer as owner and empty public results", async function () {
    const { election, owner, visitor, publicElection } = await deployElection();
    expect(await publicElection.owner()).to.equal(owner.address);
    expect(await publicElection.phase()).to.equal(0n);
    expect(await publicElection.candidateCount()).to.equal(0n);
    expect(await election.eligibleVoterCount()).to.equal(0n);
    expect(await publicElection.voterStatus(visitor.address)).to.equal(0n);
  });

  it("registers voters, opens, tallies public votes, and closes with events", async function () {
    const { election, alice, bob, aliceElection, bobElection, publicElection } = await deployElection();
    await expect(election.registerVoter(alice.address)).to.emit(election, "VoterRegistered").withArgs(alice.address);
    await election.registerVoter(bob.address);
    expect(await election.eligibleVoterCount()).to.equal(2n);
    expect(await publicElection.voterStatus(alice.address)).to.equal(1n);
    await expect(election.addCandidate("An")).to.emit(election, "CandidateAdded").withArgs(0n, "An");
    await expect(election.addCandidate("Binh")).to.emit(election, "CandidateAdded").withArgs(1n, "Binh");
    expect(await publicElection.getCandidate(0)).to.deep.equal(["An", 0n]);

    await expect(election.openVoting()).to.emit(election, "VotingOpened");
    expect(await publicElection.phase()).to.equal(1n);
    await expect(aliceElection.vote(0)).to.emit(election, "VoteCast").withArgs(alice.address, 0n);
    expect(await publicElection.getCandidate(0)).to.deep.equal(["An", 1n]);
    expect(await publicElection.getCandidate(1)).to.deep.equal(["Binh", 0n]);
    expect(await publicElection.voterStatus(alice.address)).to.equal(2n);
    await bobElection.vote(1);

    await expect(election.closeVoting()).to.emit(election, "VotingClosed");
    expect(await publicElection.phase()).to.equal(2n);
    expect(await publicElection.candidateCount()).to.equal(2n);
    expect(await publicElection.getCandidate(0)).to.deep.equal(["An", 1n]);
    expect(await publicElection.getCandidate(1)).to.deep.equal(["Binh", 1n]);
  });

  it("rejects all administrative actions from other addresses", async function () {
    const { election, aliceElection, alice } = await openElection();
    await expect(aliceElection.registerVoter(alice.address)).to.be.revertedWithCustomError(election, "Unauthorized");
    await expect(aliceElection.addCandidate("An")).to.be.revertedWithCustomError(election, "Unauthorized");
    await expect(aliceElection.openVoting()).to.be.revertedWithCustomError(election, "Unauthorized");
    await expect(aliceElection.closeVoting()).to.be.revertedWithCustomError(election, "Unauthorized");
  });

  it("rejects zero and duplicate voter addresses without increasing the count", async function () {
    const { election, alice } = await deployElection();
    await expect(election.registerVoter(ethers.ZeroAddress)).to.be.revertedWithCustomError(election, "InvalidVoter");
    await election.registerVoter(alice.address);
    await expect(election.registerVoter(alice.address)).to.be.revertedWithCustomError(election, "VoterAlreadyRegistered");
    expect(await election.eligibleVoterCount()).to.equal(1n);
  });

  it("rejects empty candidate names and distinguishes candidates with the same name", async function () {
    const { election } = await deployElection();
    await expect(election.addCandidate("")).to.be.revertedWithCustomError(election, "EmptyCandidateName");
    await expect(election.addCandidate("An")).to.emit(election, "CandidateAdded").withArgs(0n, "An");
    await expect(election.addCandidate("An")).to.emit(election, "CandidateAdded").withArgs(1n, "An");
    expect(await election.candidateCount()).to.equal(2n);
  });

  it("requires registered voters and candidates before opening", async function () {
    const { election, alice } = await deployElection();
    await expect(election.openVoting()).to.be.revertedWithCustomError(election, "NoVoters");
    await election.registerVoter(alice.address);
    await expect(election.openVoting()).to.be.revertedWithCustomError(election, "NoCandidates");
    expect(await election.phase()).to.equal(0n);
  });

  it("rejects closing before voting opens", async function () {
    const { election } = await deployElection();
    await expect(election.closeVoting()).to.be.revertedWithCustomError(election, "WrongPhase");
  });

  it("freezes candidates and voters once the election is open", async function () {
    const { election, visitor } = await openElection();
    await expect(election.registerVoter(visitor.address)).to.be.revertedWithCustomError(election, "WrongPhase");
    await expect(election.addCandidate("New")).to.be.revertedWithCustomError(election, "WrongPhase");
    await expect(election.openVoting()).to.be.revertedWithCustomError(election, "WrongPhase");
    expect(await election.candidateCount()).to.equal(2n);
    expect(await election.eligibleVoterCount()).to.equal(2n);
  });

  it("rejects votes from unregistered addresses including the deployer", async function () {
    const { election, publicElection } = await openElection();
    await expect(publicElection.vote(0)).to.be.revertedWithCustomError(election, "NotRegistered");
    await expect(election.vote(0)).to.be.revertedWithCustomError(election, "NotRegistered");
    expect(await election.getCandidate(0)).to.deep.equal(["An", 0n]);
  });

  it("rejects a second vote from the same address without changing either tally", async function () {
    const { election, alice, aliceElection } = await openElection();
    await aliceElection.vote(0);
    await expect(aliceElection.vote(1)).to.be.revertedWithCustomError(election, "AlreadyVoted");
    expect(await election.voterStatus(alice.address)).to.equal(2n);
    expect(await election.getCandidate(0)).to.deep.equal(["An", 1n]);
    expect(await election.getCandidate(1)).to.deep.equal(["Binh", 0n]);
  });

  it("rejects an invalid candidate without consuming the voter’s eligibility", async function () {
    const { election, alice, aliceElection } = await openElection();
    await expect(election.getCandidate(2)).to.be.revertedWithCustomError(election, "InvalidCandidate");
    await expect(aliceElection.vote(2)).to.be.revertedWithCustomError(election, "InvalidCandidate");
    expect(await election.voterStatus(alice.address)).to.equal(1n);
    expect(await election.getCandidate(0)).to.deep.equal(["An", 0n]);
    await aliceElection.vote(0);
  });

  it("rejects votes outside Open and rejects reopening after close", async function () {
    const { election, alice, aliceElection } = await deployElection();
    await election.registerVoter(alice.address);
    await election.addCandidate("An");
    await expect(aliceElection.vote(0)).to.be.revertedWithCustomError(election, "WrongPhase");
    await election.openVoting();
    await election.closeVoting();
    await expect(aliceElection.vote(0)).to.be.revertedWithCustomError(election, "WrongPhase");
    await expect(election.openVoting()).to.be.revertedWithCustomError(election, "WrongPhase");
    await expect(election.closeVoting()).to.be.revertedWithCustomError(election, "WrongPhase");
    expect(await election.voterStatus(alice.address)).to.equal(1n);
    expect(await election.getCandidate(0)).to.deep.equal(["An", 0n]);
  });
});
