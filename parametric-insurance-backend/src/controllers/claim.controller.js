const contractService = require('../services/contract.service');
const ipfsService = require('../services/ipfs.service');
const oracleService = require('../services/oracle.service');

class ClaimController {
  // Get user claims
  async getUserClaims(req, res) {
    try {
      const { address } = req.params;
      if (!address) {
        return res.status(400).json({ success: false, error: 'Address is required' });
      }
      const claimIds = await contractService.getUserClaims(address);
      
      const claims = await Promise.all(
        claimIds.map(async (id) => {
          const claim = await contractService.getClaimDetails(id);
          
          // Fetch event data from IPFS
          let eventData = {};
          if (claim.eventDataHash) {
            try {
              eventData = await ipfsService.getData(claim.eventDataHash);
            } catch (error) {
              console.error('Error fetching IPFS data:', error);
            }
          }

          // Attempt to fetch the related policy for this claim (safe)
          let policySummary = null;
          try {
            if (claim && (claim.policyId || claim.policyId === 0)) {
              const policy = await contractService.getPolicyDetails(claim.policyId);
              policySummary = {
                policyId: policy.policyId || policy.policyId === 0 ? policy.policyId : null,
                policyholder: policy.policyholder || null,
                coverageAmount: policy.coverageAmount || null,
                premium: policy.premium || null,
                startDate: policy.startDate || null,
                endDate: policy.endDate || null,
                eventType: policy.eventType || null,
                isActive: policy.isActive || false,
                claimed: policy.claimed || false
              };
            }
          } catch (policyErr) {
            console.warn('Could not fetch policy for claim', id, policyErr.message || policyErr);
            policySummary = null;
          }

          return {
            ...claim,
            eventDataDetails: eventData,
            policy: policySummary
          };
        })
      );

      res.json({
        success: true,
        data: claims
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get claim details
  async getClaimDetails(req, res) {
    try {
      const { claimId } = req.params;
      if (!claimId && claimId !== 0 && claimId !== '0') {
        return res.status(400).json({ success: false, error: 'Claim ID is required' });
      }
      const claim = await contractService.getClaimDetails(claimId);

      // If contract returns an empty struct or a zero id, treat as not found
      const claimIdValue = claim && (claim.claimId || claim.claimId === 0 ? claim.claimId : null);
      if (!claim || claimIdValue === null || Number(claimIdValue) === 0) {
        return res.status(404).json({ success: false, error: 'Claim not found' });
      }

      // Fetch from IPFS
      let eventData = {};
      if (claim.eventDataHash) {
        try {
          eventData = await ipfsService.getData(claim.eventDataHash);
        } catch (error) {
          console.error('Error fetching IPFS data:', error);
        }
      }

      // Try to fetch the linked policy details as well
      let policy = null;
      try {
        if (claim && (claim.policyId || claim.policyId === 0)) {
          const p = await contractService.getPolicyDetails(claim.policyId);
          policy = {
            policyId: p.policyId || p.policyId === 0 ? p.policyId : null,
            policyholder: p.policyholder || null,
            coverageAmount: p.coverageAmount || null,
            premium: p.premium || null,
            startDate: p.startDate || null,
            endDate: p.endDate || null,
            eventType: p.eventType || null,
            eventParameters: p.eventParameters || null,
            isActive: p.isActive || false,
            claimed: p.claimed || false,
            claimAmount: p.claimAmount || null
          };
        }
      } catch (policyErr) {
        console.warn('Could not fetch policy for claim details', claimId, policyErr.message || policyErr);
        policy = null;
      }

      res.json({
        success: true,
        data: {
          ...claim,
          eventDataDetails: eventData,
          policy
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Upload claim evidence to IPFS
  async uploadClaimEvidence(req, res) {
    try {
      const { evidence } = req.body;
      const ipfsHash = await ipfsService.uploadJSON(evidence);

      res.json({
        success: true,
        data: {
          ipfsHash,
          gatewayUrl: ipfsService.getGatewayURL(ipfsHash)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ClaimController();