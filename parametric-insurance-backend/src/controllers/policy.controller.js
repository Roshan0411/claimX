const contractService = require('../services/contract.service');
const ipfsService = require('../services/ipfs.service');

exports.getUserPolicies = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }

    const policyIds = await contractService.getUserPolicies(address);
    
    const policies = await Promise.all(
      policyIds.map(async (id) => {
        const policy = await contractService.getPolicyDetails(id);
        let parameters = {};
        
        if (policy.eventParameters) {
          try {
            parameters = await ipfsService.getData(policy.eventParameters);
          } catch (error) {
            console.error('Error fetching IPFS data:', error);
          }
        }

        return {
          ...policy,
          parametersData: parameters
        };
      })
    );

    res.json({
      success: true,
      data: policies
    });
  } catch (error) {
    console.error('Error in getUserPolicies:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getPolicyDetails = async (req, res) => {
  try {
    const { policyId } = req.params;
    
    if (!policyId) {
      return res.status(400).json({
        success: false,
        error: 'Policy ID is required'
      });
    }

    const policy = await contractService.getPolicyDetails(policyId);
    let parameters = {};
    
    if (policy.eventParameters) {
      try {
        parameters = await ipfsService.getData(policy.eventParameters);
      } catch (error) {
        console.error('Error fetching IPFS data:', error);
      }
    }

    res.json({
      success: true,
      data: {
        ...policy,
        parametersData: parameters
      }
    });
  } catch (error) {
    console.error('Error in getPolicyDetails:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.uploadPolicyParameters = async (req, res) => {
  try {
    const { parameters } = req.body;
    
    if (!parameters) {
      return res.status(400).json({
        success: false,
        error: 'Parameters are required'
      });
    }

    const ipfsHash = await ipfsService.uploadJSON(parameters);

    res.json({
      success: true,
      data: {
        ipfsHash,
        gatewayUrl: ipfsService.getGatewayURL(ipfsHash)
      }
    });
  } catch (error) {
    console.error('Error in uploadPolicyParameters:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};