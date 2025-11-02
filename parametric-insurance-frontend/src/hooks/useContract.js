import { useContext, useCallback } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import Web3 from 'web3';

export const useContract = () => {
  const { contract, account, web3 } = useWeb3Context();

  // Create Policy
  const createPolicy = useCallback(
    async (coverageAmount, premium, durationInDays, eventType, eventParametersHash) => {
      try {
        const coverageWei = Web3.utils.toWei(coverageAmount.toString(), 'ether');
        const premiumWei = Web3.utils.toWei(premium.toString(), 'ether');

        const tx = await contract.methods
          .createPolicy(
            coverageWei,
            premiumWei,
            durationInDays,
            eventType,
            eventParametersHash
          )
          .send({ from: account });

        toast.success('Policy created successfully!');
        return tx;
      } catch (error) {
        console.error('Error creating policy:', error);
        toast.error('Failed to create policy');
        throw error;
      }
    },
    [contract, account]
  );

  // Pay Premium
  const payPremium = useCallback(
    async (policyId, premiumAmount) => {
      try {
        const premiumWei = Web3.utils.toWei(premiumAmount.toString(), 'ether');

        const tx = await contract.methods
          .payPremium(policyId)
          .send({ from: account, value: premiumWei });

        toast.success('Premium paid successfully!');
        return tx;
      } catch (error) {
        console.error('Error paying premium:', error);
        toast.error('Failed to pay premium');
        throw error;
      }
    },
    [contract, account]
  );

  // Submit Claim
  const submitClaim = useCallback(
    async (policyId, eventDataHash) => {
      try {
        const tx = await contract.methods
          .submitClaim(policyId, eventDataHash)
          .send({ from: account });

        toast.success('Claim submitted successfully!');
        return tx;
      } catch (error) {
        console.error('Error submitting claim:', error);
        toast.error('Failed to submit claim');
        throw error;
      }
    },
    [contract, account]
  );

  // Get User Policies
  const getUserPolicies = useCallback(async () => {
    try {
      const policyIds = await contract.methods.getUserPolicies(account).call();
      
      const policies = await Promise.all(
        policyIds.map(async (id) => {
          const policy = await contract.methods.getPolicyDetails(id).call();
          return {
            ...policy,
            coverageAmount: Web3.utils.fromWei(policy.coverageAmount, 'ether'),
            premium: Web3.utils.fromWei(policy.premium, 'ether'),
            claimAmount: Web3.utils.fromWei(policy.claimAmount, 'ether'),
          };
        })
      );

      return policies;
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Failed to fetch policies');
      return [];
    }
  }, [contract, account]);

  // Get User Claims
  const getUserClaims = useCallback(async () => {
    try {
      const claimIds = await contract.methods.getUserClaims(account).call();
      
      const claims = await Promise.all(
        claimIds.map(async (id) => {
          const claim = await contract.methods.getClaimDetails(id).call();
          return {
            ...claim,
            claimAmount: Web3.utils.fromWei(claim.claimAmount, 'ether'),
          };
        })
      );

      return claims;
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to fetch claims');
      return [];
    }
  }, [contract, account]);

  // Get Contract Stats
  const getContractStats = useCallback(async () => {
    try {
      const stats = await contract.methods.getContractStats().call();
      return {
        totalPolicies: stats.totalPolicies.toString(),
        totalClaims: stats.totalClaims.toString(),
        poolBalance: Web3.utils.fromWei(stats.poolBalance, 'ether'),
        premiumCollected: Web3.utils.fromWei(stats.premiumCollected, 'ether'),
        claimsPaid: Web3.utils.fromWei(stats.claimsPaid, 'ether'),
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }, [contract]);

  // Cancel Policy
  const cancelPolicy = useCallback(
    async (policyId) => {
      try {
        const tx = await contract.methods
          .cancelPolicy(policyId)
          .send({ from: account });

        toast.success('Policy cancelled successfully!');
        return tx;
      } catch (error) {
        console.error('Error cancelling policy:', error);
        toast.error('Failed to cancel policy');
        throw error;
      }
    },
    [contract, account]
  );

  // Fund Pool
  const fundPool = useCallback(
    async (amount) => {
      try {
        const amountWei = Web3.utils.toWei(amount.toString(), 'ether');

        const tx = await contract.methods
          .fundPool()
          .send({ from: account, value: amountWei });

        toast.success('Pool funded successfully!');
        return tx;
      } catch (error) {
        console.error('Error funding pool:', error);
        toast.error('Failed to fund pool');
        throw error;
      }
    },
    [contract, account]
  );

  // Process Payout (for oracle/admin)
  const processPayout = useCallback(
    async (claimId) => {
      try {
        const tx = await contract.methods
          .processPayout(claimId)
          .send({ from: account });

        toast.success('Payout processed successfully!');
        return tx;
      } catch (error) {
        console.error('Error processing payout:', error);
        toast.error('Failed to process payout');
        throw error;
      }
    },
    [contract, account]
  );

  // Approve Claim (oracle only)
  const approveClaim = useCallback(
    async (claimId) => {
      try {
        const tx = await contract.methods
          .approveClaim(claimId)
          .send({ from: account });

        toast.success('Claim approved successfully!');
        return tx;
      } catch (error) {
        console.error('Error approving claim:', error);
        toast.error('Failed to approve claim');
        throw error;
      }
    },
    [contract, account]
  );

  // Reject Claim (oracle only)
  const rejectClaim = useCallback(
    async (claimId) => {
      try {
        const tx = await contract.methods
          .rejectClaim(claimId)
          .send({ from: account });

        toast.success('Claim rejected');
        return tx;
      } catch (error) {
        console.error('Error rejecting claim:', error);
        toast.error('Failed to reject claim');
        throw error;
      }
    },
    [contract, account]
  );

  return {
    createPolicy,
    payPremium,
    submitClaim,
    getUserPolicies,
    getUserClaims,
    getContractStats,
    cancelPolicy,
    fundPool,
    processPayout,
    approveClaim,
    rejectClaim,
  };
};