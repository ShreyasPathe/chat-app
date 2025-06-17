import CryptoJS from 'crypto-js';

class EncryptionService {
  constructor() {
    this.key = null;
  }

  // Generate a new encryption key
  generateKey() {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  // Set the encryption key
  setKey(key) {
    this.key = key;
  }

  // Encrypt a message
  encryptMessage(message) {
    if (!this.key) {
      throw new Error('Encryption key not set');
    }
    return CryptoJS.AES.encrypt(message, this.key).toString();
  }

  // Decrypt a message
  decryptMessage(encryptedMessage) {
    if (!this.key) {
      throw new Error('Encryption key not set');
    }
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate a unique conversation ID for two users
  generateConversationId(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return CryptoJS.MD5(sortedIds.join('_')).toString();
  }

  // Generate a group encryption key
  generateGroupKey() {
    return this.generateKey();
  }

  // Share group key with a new member
  shareGroupKey(groupKey, publicKey) {
    // In a real implementation, you would use RSA to encrypt the group key
    // with the new member's public key
    return CryptoJS.AES.encrypt(groupKey, publicKey).toString();
  }
}

export const encryptionService = new EncryptionService(); 