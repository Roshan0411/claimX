const contractService = require('../services/contract.service');
const ipfsService = require('../services/ipfs.service');
const oracleService = require('../services/oracle.service');

class ClaimController {
  // Get user claims
  async getUserClaims(req, res) {
    try {
      const { address } = req.params;
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

          return {
            ...claim,
            eventDataDetails: eventData
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
      const claim = await contractService.getClaimDetails(claimId);

      // Fetch from IPFS
      let eventData = {};
      if (claim.eventDataHash) {
        try {
          eventData = await ipfsService.getData(claim.eventDataHash);
        } catch (error) {
          console.error('Error fetching IPFS data:', error);
        }
      }

      res.json({
        success: true,
        data: {
          ...claim,
          eventDataDetails: eventData
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