class PDFService {
  /**
   * Generate simple HTML-based receipt that can be printed to PDF
   * @param {Object} transaction - Transaction data
   * @param {string} userAccount - User's wallet address
   * @returns {string} - HTML content
   */
  static generateReceiptHTML(transaction, userAccount) {
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ClaimX Insurance Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2874f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            color: #2874f0;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        .tagline {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        .receipt-title {
            font-size: 20px;
            margin: 20px 0 10px 0;
            color: #333;
        }
        .receipt-id {
            float: right;
            color: #666;
            font-size: 12px;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .details-table th,
        .details-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .details-table th {
            background-color: #2874f0;
            color: white;
            font-weight: bold;
        }
        .details-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .field-label {
            font-weight: bold;
            width: 30%;
        }
        .verification-section {
            margin-top: 40px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .verification-title {
            font-size: 16px;
            margin-bottom: 15px;
            color: #333;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .qr-placeholder {
            float: right;
            width: 100px;
            height: 100px;
            border: 2px dashed #ccc;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #999;
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">ClaimX Insurance</h1>
        <p class="tagline">Parametric Insurance Platform</p>
    </div>

    <div style="overflow: hidden;">
        <h2 class="receipt-title">Transaction Receipt</h2>
        <div class="receipt-id">Receipt #: RCP-${transaction.id}-${Date.now()}</div>
    </div>

    <table class="details-table">
        <thead>
            <tr>
                <th>Field</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="field-label">Transaction ID</td>
                <td>${transaction.id}</td>
            </tr>
            <tr>
                <td class="field-label">Description</td>
                <td>${transaction.description}</td>
            </tr>
            <tr>
                <td class="field-label">Amount</td>
                <td><strong>${transaction.amount}</strong></td>
            </tr>
            <tr>
                <td class="field-label">Date</td>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
            <tr>
                <td class="field-label">Status</td>
                <td><span style="color: ${transaction.status === 'Completed' ? 'green' : 'orange'}">${transaction.status}</span></td>
            </tr>
            <tr>
                <td class="field-label">Transaction Hash</td>
                <td style="word-break: break-all; font-family: monospace;">${transaction.txHash}</td>
            </tr>
            <tr>
                <td class="field-label">Account</td>
                <td style="word-break: break-all; font-family: monospace;">${userAccount}</td>
            </tr>
            <tr>
                <td class="field-label">Network</td>
                <td>Sepolia Testnet</td>
            </tr>
            <tr>
                <td class="field-label">Generated On</td>
                <td>${new Date().toLocaleString()}</td>
            </tr>
        </tbody>
    </table>

    <div class="verification-section">
        <h3 class="verification-title">Verification Details</h3>
        <table style="width: 100%; border: none;">
            <tr style="border: none;">
                <td style="border: none; padding: 5px 0;"><strong>Blockchain Network:</strong> Ethereum Sepolia Testnet</td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; padding: 5px 0;"><strong>Explorer Link:</strong> https://sepolia.etherscan.io/tx/${transaction.txHash}</td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; padding: 5px 0;"><strong>Platform:</strong> ClaimX Parametric Insurance</td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; padding: 5px 0;"><strong>Document Type:</strong> Digital Transaction Receipt</td>
            </tr>
        </table>
        
        <div class="qr-placeholder">
            QR Code<br>(Verification)
        </div>
    </div>

    <div class="footer">
        <p>This is an automated receipt generated by ClaimX Insurance Platform.</p>
        <p>No physical signature required. This document serves as proof of transaction.</p>
        <p>Document ID: DOC-${Date.now()}-${transaction.id}</p>
        <p>© 2025 ClaimX Insurance Platform - Parametric Insurance Solutions</p>
    </div>
</body>
</html>`;
    
    return receiptHTML;
  }

  /**
   * Generate transaction history HTML report
   * @param {Array} transactions - Array of transaction objects
   * @param {string} userAccount - User's wallet address
   * @param {Object} options - Additional options
   * @returns {string} - HTML content
   */
  static generateHistoryReportHTML(transactions, userAccount, options = {}) {
    // Calculate totals
    const totalPremiums = transactions
      .filter(tx => tx.type === 'premium_payment' || tx.type === 'policy_creation')
      .reduce((sum, tx) => sum + parseFloat(tx.amount.replace(' ETH', '')), 0);
    
    const totalPayouts = transactions
      .filter(tx => tx.type === 'payout')
      .reduce((sum, tx) => sum + parseFloat(tx.amount.replace(' ETH', '')), 0);
    
    const netActivity = totalPayouts - totalPremiums;
    const successRate = ((transactions.filter(tx => tx.status === 'Completed').length / transactions.length) * 100).toFixed(1);

    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ClaimX Insurance Transaction History</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #2874f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            color: #2874f0;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        .report-title {
            font-size: 18px;
            margin: 10px 0 5px 0;
            color: #333;
        }
        .metadata {
            font-size: 12px;
            color: #666;
            margin: 5px 0;
        }
        .metadata-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 20px 0;
        }
        .history-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 12px;
        }
        .history-table th,
        .history-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .history-table th {
            background-color: #2874f0;
            color: white;
            font-weight: bold;
        }
        .history-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .summary-section {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .summary-item {
            padding: 10px;
            background: white;
            border-radius: 4px;
            border-left: 4px solid #2874f0;
        }
        .summary-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        .summary-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
            text-align: center;
        }
        @media print {
            body { margin: 0; }
            .metadata-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">ClaimX Insurance</h1>
        <h2 class="report-title">Transaction History Report</h2>
    </div>

    <div class="metadata-grid">
        <div>
            <div class="metadata"><strong>Account:</strong> ${userAccount}</div>
            <div class="metadata"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            <div class="metadata"><strong>Total Transactions:</strong> ${transactions.length}</div>
        </div>
        <div>
            <div class="metadata"><strong>Report Period:</strong> ${options.period || 'All Time'}</div>
            <div class="metadata"><strong>Filter:</strong> ${options.filter || 'All Transactions'}</div>
            <div class="metadata"><strong>Success Rate:</strong> ${successRate}%</div>
        </div>
    </div>

    <table class="history-table">
        <thead>
            <tr>
                <th>#</th>
                <th>ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Tx Hash</th>
            </tr>
        </thead>
        <tbody>
            ${transactions.map((tx, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${tx.id}</td>
                    <td>${tx.description.length > 50 ? tx.description.substring(0, 50) + '...' : tx.description}</td>
                    <td><strong>${tx.amount}</strong></td>
                    <td>${new Date(tx.date).toLocaleDateString()}</td>
                    <td style="color: ${tx.status === 'Completed' ? 'green' : 'orange'}">${tx.status}</td>
                    <td style="font-family: monospace; font-size: 10px;">${tx.txHash.substring(0, 16)}...</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="summary-section">
        <h3>Financial Summary</h3>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">Total Premiums Paid</div>
                <div class="summary-value">${totalPremiums.toFixed(4)} ETH</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Payouts Received</div>
                <div class="summary-value">${totalPayouts.toFixed(4)} ETH</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Net Activity</div>
                <div class="summary-value" style="color: ${netActivity >= 0 ? 'green' : 'red'}">${netActivity.toFixed(4)} ETH</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Transaction Count</div>
                <div class="summary-value">${transactions.length}</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>© 2025 ClaimX Insurance Platform - Parametric Insurance Solutions</p>
        <p>This report is automatically generated and contains verified blockchain transaction data.</p>
        <p>Report ID: RPT-${Date.now()}-${userAccount.substring(0, 8)}</p>
    </div>
</body>
</html>`;
    
    return reportHTML;
  }

  /**
   * Generate CSV data for transaction history
   * @param {Array} transactions - Array of transaction objects
   * @param {string} userAccount - User's wallet address
   * @returns {string} - CSV content
   */
  static generateCSV(transactions, userAccount) {
    try {
      // CSV headers
      const headers = [
        'Transaction ID',
        'Type',
        'Description',
        'Amount (ETH)',
        'Date',
        'Status',
        'Transaction Hash',
        'Account',
        'Network',
        'Generated On'
      ];
      
      // Convert transactions to CSV format
      const csvData = transactions.map(tx => [
        tx.id,
        tx.type,
        `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
        tx.amount.replace(' ETH', ''),
        tx.date,
        tx.status,
        tx.txHash,
        userAccount,
        'Sepolia Testnet',
        new Date().toISOString()
      ]);
      
      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');
      
      return csvContent;
    } catch (error) {
      console.error('Error generating CSV:', error);
      throw new Error('Failed to generate CSV data');
    }
  }
}

module.exports = PDFService;