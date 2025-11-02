const { contract } = require('../config/contract.config');
const web3 = require('../config/web3.config');

class ContractService {
  // Get policy details
  async getPolicyDetails(policyId) {
    try {
      const policy = await contract.methods.getPolicyDetails(policyId).call();
      return policy;
    } catch (error) {
      console.error('Error fetching policy:', error);
      throw error;
    }
  }

  // Get user policies
  async getUserPolicies(userAddress) {
    try {
      const policyIds = await contract.methods.getUserPolicies(userAddress).call();
      return policyIds;
    } catch (error) {
      console.error('Error fetching user policies:', error);
      throw error;
    }
  }

  // Get claim details
  async getClaimDetails(claimId) {
    try {
      const claim = await contract.methods.getClaimDetails(claimId).call();
      return claim;
    } catch (error) {
      console.error('Error fetching claim:', error);
      throw error;
    }
  }

  // Get user claims
  async getUserClaims(userAddress) {
    try {
      const claimIds = await contract.methods.getUserClaims(userAddress).call();
      return claimIds;
    } catch (error) {
      console.error('Error fetching user claims:', error);
      throw error;
    }
  }

  // Get contract stats
  async getContractStats() {
    try {
      const stats = await contract.methods.getContractStats().call();
      return {
        totalPolicies: stats.totalPolicies,
        totalClaims: stats.totalClaims,
        poolBalance: web3.utils.fromWei(stats.poolBalance, 'ether'),
        premiumCollected: web3.utils.fromWei(stats.premiumCollected, 'ether'),
        claimsPaid: web3.utils.fromWei(stats.claimsPaid, 'ether')
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Oracle: Approve claim
  async approveClaim(claimId, oracleAddress) {
    try {
      const gasEstimate = await contract.methods
        .approveClaim(claimId)
        .estimateGas({ from: oracleAddress });

      const tx = await contract.methods.approveClaim(claimId).send({
        from: oracleAddress,
        gas: gasEstimate,
      });

      return tx;
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  }

  // Oracle: Reject claim
  async rejectClaim(claimId, oracleAddress) {
    try {
      const gasEstimate = await contract.methods
        .rejectClaim(claimId)
        .estimateGas({ from: oracleAddress });

      const tx = await contract.methods.rejectClaim(claimId).send({
        from: oracleAddress,
        gas: gasEstimate,
      });

      return tx;
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    }
  }

  // Listen to contract events
  listenToEvents() {
    // Policy Created Event
    contract.events.PolicyCreated({})
      .on('data', (event) => {
        console.log('New Policy Created:', event.returnValues);
      })
      .on('error', console.error);

    // Claim Submitted Event
    contract.events.ClaimSubmitted({})
      .on('data', (event) => {
        console.log('New Claim Submitted:', event.returnValues);
      })
      .on('error', console.error);

    // Claim Paid Event
    contract.events.ClaimPaid({})
      .on('data', (event) => {
        console.log('Claim Paid:', event.returnValues);
      })
      .on('error', console.error);
  }
}

module.exports = new ContractService();