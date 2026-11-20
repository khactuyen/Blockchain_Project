// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @notice A single public election for pre-registered voter addresses.
contract Election {
    enum Phase { Setup, Open, Closed }
    enum VoterStatus { Unregistered, Eligible, Voted }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    error Unauthorized();
    error WrongPhase();
    error InvalidVoter();
    error VoterAlreadyRegistered();
    error EmptyCandidateName();
    error NoVoters();
    error NoCandidates();
    error InvalidCandidate();
    error NotRegistered();
    error AlreadyVoted();

    event VoterRegistered(address indexed voter);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VotingOpened();
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event VotingClosed();

    address public immutable owner;
    Phase public phase;
    uint256 public eligibleVoterCount;
    mapping(address => VoterStatus) public voterStatus;
    Candidate[] private candidates;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier inPhase(Phase requiredPhase) {
        if (phase != requiredPhase) revert WrongPhase();
        _;
    }

    function registerVoter(address voter) external onlyOwner inPhase(Phase.Setup) {
        if (voter == address(0)) revert InvalidVoter();
        if (voterStatus[voter] != VoterStatus.Unregistered) revert VoterAlreadyRegistered();

        voterStatus[voter] = VoterStatus.Eligible;
        eligibleVoterCount++;
        emit VoterRegistered(voter);
    }

    function addCandidate(string calldata name) external onlyOwner inPhase(Phase.Setup) {
        if (bytes(name).length == 0) revert EmptyCandidateName();

        uint256 candidateId = candidates.length;
        candidates.push(Candidate({name: name, voteCount: 0}));
        emit CandidateAdded(candidateId, name);
    }

    function openVoting() external onlyOwner inPhase(Phase.Setup) {
        if (eligibleVoterCount == 0) revert NoVoters();
        if (candidates.length == 0) revert NoCandidates();

        phase = Phase.Open;
        emit VotingOpened();
    }

    function vote(uint256 candidateId) external inPhase(Phase.Open) {
        VoterStatus status = voterStatus[msg.sender];
        if (status == VoterStatus.Unregistered) revert NotRegistered();
        if (status == VoterStatus.Voted) revert AlreadyVoted();
        if (candidateId >= candidates.length) revert InvalidCandidate();

        voterStatus[msg.sender] = VoterStatus.Voted;
        candidates[candidateId].voteCount++;
        emit VoteCast(msg.sender, candidateId);
    }

    function closeVoting() external onlyOwner inPhase(Phase.Open) {
        phase = Phase.Closed;
        emit VotingClosed();
    }

    function candidateCount() external view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 candidateId) external view returns (string memory name, uint256 voteCount) {
        if (candidateId >= candidates.length) revert InvalidCandidate();

        Candidate storage candidate = candidates[candidateId];
        return (candidate.name, candidate.voteCount);
    }
}
