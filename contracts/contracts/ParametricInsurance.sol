// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ParametricInsurance {
    address public admin;
    uint256 public policyCounter;
    uint256 public claimCounter;
    uint256 public totalPoolFunds;
    uint256 public totalPremiumCollected;
    uint256 public totalClaimsPaid;
    uint256 public platformFeePercentage = 5; // 5%
    
    struct Policy {
        uint256 policyId;
        address policyholder;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        string eventType;
        string eventParameters;
        bool isActive;
        bool claimed;
        uint256 claimAmount;
    }
    
    struct Claim {
        uint256 claimId;
        uint256 policyId;
        address claimant;
        uint256 claimAmount;
        uint256 claimDate;
        string eventDataHash;
        ClaimStatus status;
    }
    
    enum ClaimStatus { Pending, Approved, Rejected, Paid }
    
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userPolicies;
    mapping(address => uint256[]) public userClaims;
    mapping(address => bool) public authorizedOracles;
    
    event PolicyCreated(uint256 indexed policyId, address indexed policyholder, uint256 coverageAmount, uint256 premium, string eventType, uint256 timestamp);
    event PremiumPaid(uint256 indexed policyId, address indexed policyholder, uint256 amount, uint256 startDate, uint256 endDate);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant, uint256 claimAmount, uint256 timestamp);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus status, uint256 timestamp);
    event ClaimPaid(uint256 indexed claimId, address indexed claimant, uint256 amount, uint256 timestamp);
    event PolicyCancelled(uint256 indexed policyId, uint256 timestamp);
    event PoolFunded(address indexed funder, uint256 amount, uint256 timestamp);
    event OracleAuthorized(address indexed oracle, uint256 timestamp);
    event OracleRevoked(address indexed oracle, uint256 timestamp);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender] || msg.sender == admin, "Only authorized oracles can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        policyCounter = 0;
        claimCounter = 0;
    }
    
    function createPolicy(
        uint256 _coverageAmount,
        uint256 _premium,
        uint256 _durationInDays,
        string memory _eventType,
        string memory _eventParametersHash
    ) external returns (uint256) {
        require(_coverageAmount > 0, "Coverage amount must be greater than 0");
        require(_premium > 0, "Premium must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");
        
        policyCounter++;
        
        policies[policyCounter] = Policy({
            policyId: policyCounter,
            policyholder: msg.sender,
            coverageAmount: _coverageAmount,
            premium: _premium,
            startDate: 0, // Will be set when premium is paid
            endDate: 0,   // Will be set when premium is paid
            eventType: _eventType,
            eventParameters: _eventParametersHash,
            isActive: false, // Will be activated when premium is paid
            claimed: false,
            claimAmount: 0
        });
        
        userPolicies[msg.sender].push(policyCounter);
        
        emit PolicyCreated(policyCounter, msg.sender, _coverageAmount, _premium, _eventType, block.timestamp);
        
        return policyCounter;
    }
    
    function payPremium(uint256 _policyId) external payable {
        require(_policyId <= policyCounter && _policyId > 0, "Invalid policy ID");
        Policy storage policy = policies[_policyId];
        require(policy.policyholder == msg.sender, "Only policyholder can pay premium");
        require(!policy.isActive, "Premium already paid");
        require(msg.value == policy.premium, "Incorrect premium amount");
        
        uint256 duration = (_policyId % 365) + 30; // Dynamic duration based on policy ID
        policy.startDate = block.timestamp;
        policy.endDate = block.timestamp + (duration * 1 days);
        policy.isActive = true;
        
        totalPremiumCollected += msg.value;
        totalPoolFunds += msg.value;
        
        emit PremiumPaid(_policyId, msg.sender, msg.value, policy.startDate, policy.endDate);
    }
    
    function submitClaim(uint256 _policyId, string memory _eventDataHash) external returns (uint256) {
        require(_policyId <= policyCounter && _policyId > 0, "Invalid policy ID");
        Policy storage policy = policies[_policyId];
        require(policy.policyholder == msg.sender, "Only policyholder can submit claim");
        require(policy.isActive, "Policy is not active");
        require(!policy.claimed, "Claim already submitted for this policy");
        require(block.timestamp <= policy.endDate, "Policy has expired");
        
        claimCounter++;
        
        claims[claimCounter] = Claim({
            claimId: claimCounter,
            policyId: _policyId,
            claimant: msg.sender,
            claimAmount: policy.coverageAmount,
            claimDate: block.timestamp,
            eventDataHash: _eventDataHash,
            status: ClaimStatus.Pending
        });
        
        userClaims[msg.sender].push(claimCounter);
        policy.claimed = true;
        policy.claimAmount = policy.coverageAmount;
        
        emit ClaimSubmitted(claimCounter, _policyId, msg.sender, policy.coverageAmount, block.timestamp);
        
        return claimCounter;
    }
    
    function approveClaim(uint256 _claimId) external onlyAuthorizedOracle {
        require(_claimId <= claimCounter && _claimId > 0, "Invalid claim ID");
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Pending, "Claim is not pending");
        
        claim.status = ClaimStatus.Approved;
        
        emit ClaimStatusUpdated(_claimId, ClaimStatus.Approved, block.timestamp);
    }
    
    function rejectClaim(uint256 _claimId) external onlyAuthorizedOracle {
        require(_claimId <= claimCounter && _claimId > 0, "Invalid claim ID");
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Pending, "Claim is not pending");
        
        claim.status = ClaimStatus.Rejected;
        
        emit ClaimStatusUpdated(_claimId, ClaimStatus.Rejected, block.timestamp);
    }
    
    function processPayout(uint256 _claimId) external onlyAdmin {
        require(_claimId <= claimCounter && _claimId > 0, "Invalid claim ID");
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Approved, "Claim is not approved");
        require(totalPoolFunds >= claim.claimAmount, "Insufficient pool funds");
        
        claim.status = ClaimStatus.Paid;
        totalPoolFunds -= claim.claimAmount;
        totalClaimsPaid += claim.claimAmount;
        
        payable(claim.claimant).transfer(claim.claimAmount);
        
        emit ClaimPaid(_claimId, claim.claimant, claim.claimAmount, block.timestamp);
    }
    
    function cancelPolicy(uint256 _policyId) external {
        require(_policyId <= policyCounter && _policyId > 0, "Invalid policy ID");
        Policy storage policy = policies[_policyId];
        require(policy.policyholder == msg.sender || msg.sender == admin, "Unauthorized");
        require(policy.isActive, "Policy is not active");
        require(!policy.claimed, "Cannot cancel claimed policy");
        
        policy.isActive = false;
        
        emit PolicyCancelled(_policyId, block.timestamp);
    }
    
    function fundPool() external payable {
        require(msg.value > 0, "Must send ETH to fund pool");
        totalPoolFunds += msg.value;
        
        emit PoolFunded(msg.sender, msg.value, block.timestamp);
    }
    
    function authorizeOracle(address _oracle) external onlyAdmin {
        require(_oracle != address(0), "Invalid oracle address");
        authorizedOracles[_oracle] = true;
        
        emit OracleAuthorized(_oracle, block.timestamp);
    }
    
    function revokeOracle(address _oracle) external onlyAdmin {
        authorizedOracles[_oracle] = false;
        
        emit OracleRevoked(_oracle, block.timestamp);
    }
    
    function setPlatformFee(uint256 _feePercentage) external onlyAdmin {
        require(_feePercentage <= 10, "Fee cannot exceed 10%");
        platformFeePercentage = _feePercentage;
    }
    
    function withdrawPlatformFees() external onlyAdmin {
        uint256 feeAmount = (totalPremiumCollected * platformFeePercentage) / 100;
        require(totalPoolFunds >= feeAmount, "Insufficient funds");
        
        totalPoolFunds -= feeAmount;
        payable(admin).transfer(feeAmount);
    }
    
    function transferAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        admin = _newAdmin;
    }
    
    // View functions
    function getPolicyDetails(uint256 _policyId) external view returns (Policy memory) {
        require(_policyId <= policyCounter && _policyId > 0, "Invalid policy ID");
        return policies[_policyId];
    }
    
    function getClaimDetails(uint256 _claimId) external view returns (Claim memory) {
        require(_claimId <= claimCounter && _claimId > 0, "Invalid claim ID");
        return claims[_claimId];
    }
    
    function getUserPolicies(address _user) external view returns (uint256[] memory) {
        return userPolicies[_user];
    }
    
    function getUserClaims(address _user) external view returns (uint256[] memory) {
        return userClaims[_user];
    }
    
    function getPoolBalance() external view returns (uint256) {
        return totalPoolFunds;
    }
    
    function getContractStats() external view returns (uint256, uint256, uint256, uint256, uint256) {
        return (policyCounter, claimCounter, totalPoolFunds, totalPremiumCollected, totalClaimsPaid);
    }
    
    function isOracleAuthorized(address _oracle) external view returns (bool) {
        return authorizedOracles[_oracle];
    }
    
    // Receive function to accept ETH
    receive() external payable {
        totalPoolFunds += msg.value;
        emit PoolFunded(msg.sender, msg.value, block.timestamp);
    }
}