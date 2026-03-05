import { ethers } from 'ethers';

// Mock blockchain service for demonstration
// In production, connect to actual Polygon Mumbai testnet

class BlockchainService {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem('blockchain_txs') || '[]');
    this.contractAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  }

  // Create proof of fix transaction
  async createProofOfFix(reportId, reportData) {
    try {
      // Simulate transaction creation
      const transaction = {
        hash: this.generateTxHash(),
        reportId: reportId,
        timestamp: new Date().toISOString(),
        blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
        from: '0x' + this.generateRandomAddress(),
        to: this.contractAddress,
        data: {
          category: reportData.category,
          severity: reportData.severity,
          location: reportData.location,
          status: reportData.status,
          fixedAt: new Date().toISOString(),
        },
        gasUsed: '21000',
        gasPrice: '30',
        confirmations: 12,
      };

      // Store transaction
      this.transactions.push(transaction);
      localStorage.setItem('blockchain_txs', JSON.stringify(this.transactions));

      return transaction;
    } catch (error) {
      console.error('Blockchain transaction error:', error);
      throw error;
    }
  }

  // Verify transaction
  async verifyTransaction(txHash) {
    const transaction = this.transactions.find((tx) => tx.hash === txHash);
    
    if (!transaction) {
      return {
        verified: false,
        message: 'Transaction not found',
      };
    }

    return {
      verified: true,
      transaction: transaction,
      message: 'Transaction verified on blockchain',
    };
  }

  // Get all transactions for a report
  getReportTransactions(reportId) {
    return this.transactions.filter((tx) => tx.reportId === reportId);
  }

  // Get transaction by hash
  getTransaction(txHash) {
    return this.transactions.find((tx) => tx.hash === txHash);
  }

  // Generate mock transaction hash
  generateTxHash() {
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Generate random address
  generateRandomAddress() {
    return Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Get transaction explorer URL
  getExplorerUrl(txHash) {
    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  }

  // Get all transactions
  getAllTransactions() {
    return this.transactions;
  }

  // Clear all transactions (for testing)
  clearTransactions() {
    this.transactions = [];
    localStorage.removeItem('blockchain_txs');
  }
}

// Singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;

// Helper functions
export const createProofOfFix = (reportId, reportData) => {
  return blockchainService.createProofOfFix(reportId, reportData);
};

export const verifyTransaction = (txHash) => {
  return blockchainService.verifyTransaction(txHash);
};

export const getReportTransactions = (reportId) => {
  return blockchainService.getReportTransactions(reportId);
};

export const getExplorerUrl = (txHash) => {
  return blockchainService.getExplorerUrl(txHash);
};

// Smart Contract ABI (mock)
export const CONTRACT_ABI = [
  {
    inputs: [
      { name: 'reportId', type: 'string' },
      { name: 'category', type: 'string' },
      { name: 'severity', type: 'string' },
      { name: 'location', type: 'string' },
    ],
    name: 'createProofOfFix',
    outputs: [{ name: 'txHash', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'reportId', type: 'string' }],
    name: 'getProof',
    outputs: [
      { name: 'exists', type: 'bool' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'category', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
