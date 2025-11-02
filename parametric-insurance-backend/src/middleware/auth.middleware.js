const jwt = require('jsonwebtoken');
const web3Config = require('../config/web3.config');

class AuthMiddleware {
  // Optional authentication - doesn't fail if no token provided
  optional(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          req.authenticated = true;
        } catch (error) {
          // Token is invalid, but we continue anyway for optional auth
          req.authenticated = false;
        }
      } else {
        req.authenticated = false;
      }
      
      next();
    } catch (error) {
      req.authenticated = false;
      next();
    }
  }

  // Required authentication - fails if no valid token provided
  required(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Access token required'
        });
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.authenticated = true;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: error.message
      });
    }
  }

  // Web3 signature verification middleware
  async verifyWeb3Signature(req, res, next) {
    try {
      const { address, signature, message, timestamp } = req.body;
      
      if (!address || !signature || !message) {
        return res.status(400).json({
          success: false,
          message: 'Address, signature, and message are required'
        });
      }

      // Check timestamp to prevent replay attacks (5 minute window)
      if (timestamp) {
        const now = Date.now();
        const messageTime = new Date(timestamp).getTime();
        const timeDiff = Math.abs(now - messageTime);
        
        if (timeDiff > 5 * 60 * 1000) { // 5 minutes
          return res.status(400).json({
            success: false,
            message: 'Message timestamp expired'
          });
        }
      }

      // Verify the signature
      const web3 = web3Config.getWeb3();
      const recoveredAddress = web3.eth.accounts.recover(message, signature);
      
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid signature'
        });
      }

      // Add the verified address to the request
      req.verifiedAddress = address.toLowerCase();
      req.web3Verified = true;
      
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Signature verification failed',
        error: error.message
      });
    }
  }

  // Generate JWT token for Web3 authenticated user
  generateToken(address, additionalClaims = {}) {
    try {
      const payload = {
        address: address.toLowerCase(),
        type: 'web3',
        iat: Math.floor(Date.now() / 1000),
        ...additionalClaims
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

      return token;
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
  }

  // Admin role check middleware
  requireAdmin(req, res, next) {
    try {
      if (!req.authenticated) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: error.message
      });
    }
  }

  // Oracle role check middleware
  requireOracle(req, res, next) {
    try {
      if (!req.authenticated) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!req.user || !['admin', 'oracle'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Oracle access required'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authorization error',
        error: error.message
      });
    }
  }

  // Address ownership verification
  requireAddressOwnership(req, res, next) {
    try {
      const targetAddress = req.params.address || req.body.address;
      
      if (!targetAddress) {
        return res.status(400).json({
          success: false,
          message: 'Address parameter required'
        });
      }

      // If Web3 verified, check if the verified address matches
      if (req.web3Verified && req.verifiedAddress) {
        if (req.verifiedAddress !== targetAddress.toLowerCase()) {
          return res.status(403).json({
            success: false,
            message: 'Address ownership verification failed'
          });
        }
      }
      // If JWT authenticated, check if the token address matches
      else if (req.authenticated && req.user && req.user.address) {
        if (req.user.address !== targetAddress.toLowerCase()) {
          return res.status(403).json({
            success: false,
            message: 'Address ownership verification failed'
          });
        }
      }
      // If admin, allow access to any address
      else if (req.authenticated && req.user && req.user.role === 'admin') {
        // Admin can access any address
      }
      else {
        return res.status(401).json({
          success: false,
          message: 'Address ownership verification required'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Address verification error',
        error: error.message
      });
    }
  }

  // Rate limiting per address
  createAddressRateLimit(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    const addressLimits = new Map();

    return (req, res, next) => {
      try {
        const address = req.verifiedAddress || req.user?.address || req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        if (!addressLimits.has(address)) {
          addressLimits.set(address, []);
        }

        const requests = addressLimits.get(address);
        
        // Remove old requests outside the window
        const validRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (validRequests.length >= maxRequests) {
          return res.status(429).json({
            success: false,
            message: 'Rate limit exceeded for this address',
            retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
          });
        }

        validRequests.push(now);
        addressLimits.set(address, validRequests);

        next();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Rate limiting error',
          error: error.message
        });
      }
    };
  }
}

module.exports = new AuthMiddleware();