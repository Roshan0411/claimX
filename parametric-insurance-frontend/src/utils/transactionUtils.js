// Transaction utilities for handling history actions
import axios from 'axios';
import { BACKEND_URL } from './constants';

export class TransactionUtils {
  // Blockchain explorer URLs for different networks
  static EXPLORER_URLS = {
    11155111: 'https://sepolia.etherscan.io', // Sepolia
    1: 'https://etherscan.io', // Mainnet
    137: 'https://polygonscan.com', // Polygon
    56: 'https://bscscan.com' // BSC
  };

  /**
   * Open transaction hash in blockchain explorer
   * @param {string} txHash - Transaction hash
   * @param {number} chainId - Blockchain network ID
   */
  static viewOnExplorer(txHash, chainId = 11155111) {
    const baseUrl = this.EXPLORER_URLS[chainId] || this.EXPLORER_URLS[11155111];
    const explorerUrl = `${baseUrl}/tx/${txHash}`;
    
    // Open in new tab
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Generate and download PDF receipt for a transaction using backend
   * @param {Object} transaction - Transaction data
   * @param {string} userAccount - User's wallet address
   */
  static async downloadReceipt(transaction, userAccount) {
    try {
      console.log('Requesting receipt from backend for transaction:', transaction.id);
      
      const response = await axios.post(
        `${BACKEND_URL}/api/reports/receipt/${transaction.id}`,
        { userAccount },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Create a new window/tab with the HTML content
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(response.data);
        newWindow.document.close();
        
        // Add print functionality
        setTimeout(() => {
          newWindow.print();
        }, 500);
      } else {
        // Fallback: create and download as HTML file
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ClaimX_Receipt_${transaction.id}_${Date.now()}.html`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      return true;
    } catch (error) {
      console.error('Error downloading receipt from backend:', error);
      if (error.response?.status === 404) {
        throw new Error('Transaction not found');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error while generating receipt');
      } else {
        throw new Error('Failed to download receipt. Please try again.');
      }
    }
  }

  /**
   * Export transaction history to PDF using backend
   * @param {Array} transactions - Array of transaction objects
   * @param {string} userAccount - User's wallet address
   * @param {string} filter - Transaction filter
   */
  static async exportToPDF(transactions, userAccount, filter = 'all') {
    try {
      console.log('Requesting PDF export from backend...');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/reports/export/pdf`,
        { 
          userAccount, 
          filter 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Create a new window/tab with the HTML content
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(response.data);
        newWindow.document.close();
        
        // Add print functionality
        setTimeout(() => {
          newWindow.print();
        }, 500);
      } else {
        // Fallback: create and download as HTML file
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ClaimX_History_${userAccount.substring(0, 8)}_${Date.now()}.html`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      
      return true;
    } catch (error) {
      console.error('Error exporting to PDF from backend:', error);
      if (error.response?.status >= 500) {
        throw new Error('Server error while generating PDF report');
      } else {
        throw new Error('Failed to export PDF. Please try again.');
      }
    }
  }

  /**
   * Export transaction history to CSV using backend
   * @param {Array} transactions - Array of transaction objects
   * @param {string} userAccount - User's wallet address
   * @param {string} filter - Transaction filter
   */
  static async exportToCSV(transactions, userAccount, filter = 'all') {
    try {
      console.log('Requesting CSV export from backend...');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/reports/export/csv`,
        { 
          userAccount, 
          filter 
        },
        {
          responseType: 'blob', // Important for handling text data as blob
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Create blob and download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ClaimX_History_${userAccount.substring(0, 8)}_${Date.now()}.csv`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting to CSV from backend:', error);
      if (error.response?.status >= 500) {
        throw new Error('Server error while generating CSV export');
      } else {
        throw new Error('Failed to export CSV. Please try again.');
      }
    }
  }

  /**
   * Send transaction report via email using backend
   * @param {Array} transactions - Array of transaction objects
   * @param {string} userAccount - User's wallet address
   * @param {string} emailAddress - User's email address
   * @param {string} filter - Transaction filter
   */
  static async emailReport(transactions, userAccount, emailAddress, filter = 'all') {
    try {
      console.log('Sending email report via backend...');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/reports/email`,
        { 
          userAccount, 
          email: emailAddress,
          filter 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: response.data.message,
        reportId: response.data.reportId
      };
      
    } catch (error) {
      console.error('Error sending email report from backend:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Invalid email address');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error while sending email report');
      } else {
        throw new Error('Failed to send email report. Please try again.');
      }
    }
  }

  /**
   * Validate email address format
   * @param {string} email - Email address to validate
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Format transaction amount for display
   * @param {string} amount - Amount string
   * @param {string} type - Transaction type
   */
  static formatAmount(amount, type) {
    const sign = type === 'payout' ? '+' : '-';
    return `${sign}${amount}`;
  }

  /**
   * Get transaction type display name
   * @param {string} type - Transaction type
   */
  static getTypeDisplayName(type) {
    const typeNames = {
      policy_creation: 'Policy Creation',
      claim_submission: 'Claim Submission',
      payout: 'Payout Received',
      premium_payment: 'Premium Payment'
    };
    return typeNames[type] || type;
  }
}

export default TransactionUtils;