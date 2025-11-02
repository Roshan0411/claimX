const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policy.controller');

router.get('/user/:address', policyController.getUserPolicies);
router.get('/:policyId', policyController.getPolicyDetails);
router.post('/upload-parameters', policyController.uploadPolicyParameters);

module.exports = router;