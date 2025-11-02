const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claim.controller');

router.get('/user/:address', claimController.getUserClaims);
router.get('/:claimId', claimController.getClaimDetails);
router.post('/upload-evidence', claimController.uploadClaimEvidence);

module.exports = router;