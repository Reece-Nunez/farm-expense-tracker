import { createWorker } from 'tesseract.js';

export class ReceiptOCRService {
  constructor() {
    this.worker = null;
    this.isInitialized = false;
    this.initializationPromise = null;
    this.recognitionInProgress = false;
  }

  async initializeOCR() {
    // If already initialized, return immediately
    if (this.isInitialized && this.worker) return;
    
    // If initialization is in progress, wait for it
    if (this.initializationPromise) {
      await this.initializationPromise;
      return;
    }

    // Start new initialization
    this.initializationPromise = this._doInitialize();
    
    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  async _doInitialize() {
    try {
      console.log('Initializing OCR worker with Tesseract.js...');
      
      // Cleanup any existing worker first
      if (this.worker) {
        try {
          await this.worker.terminate();
        } catch (e) {
          console.warn('Error terminating existing worker:', e);
        }
        this.worker = null;
        this.isInitialized = false;
      }
      
      // Create worker with step-by-step initialization
      console.log('Creating Tesseract worker...');
      
      // Use the simpler createWorker API for v4
      this.worker = await createWorker({
        logger: m => {
          if (m.status && m.progress !== undefined) {
            console.log(`OCR ${m.status}: ${Math.round(m.progress * 100)}%`);
          }
        },
      });
      
      console.log('Loading language data...');
      await this.worker.loadLanguage('eng');
      
      console.log('Initializing worker...');
      await this.worker.initialize('eng');
      
      console.log('Setting parameters...');
      await this.worker.setParameters({
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,/$-:()#'
      });
      
      console.log('OCR worker fully initialized and ready');
      this.isInitialized = true;
      
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
      console.error('Error details:', error.stack);
      this.worker = null;
      this.isInitialized = false;
      throw new Error(`Failed to initialize OCR service: ${error.message}`);
    }
  }

  async extractTextFromImage(imageFile, onProgress) {
    // Prevent concurrent recognition calls
    if (this.recognitionInProgress) {
      throw new Error('OCR recognition is already in progress. Please wait.');
    }

    // Ensure worker is initialized
    if (!this.isInitialized || !this.worker) {
      await this.initializeOCR();
    }

    this.recognitionInProgress = true;
    
    try {
      console.log('Starting OCR text extraction...');
      console.log('Image file type:', imageFile?.type);
      console.log('Image file size:', imageFile?.size);
      
      // Validate image file
      if (!imageFile) {
        throw new Error('No image file provided');
      }
      
      if (!imageFile.type?.startsWith('image/')) {
        throw new Error('Invalid file type. Please provide an image file.');
      }
      
      // Use progress callback if provided
      if (onProgress) {
        onProgress(25);
      }
      
      // Verify worker is still valid before using
      if (!this.worker) {
        throw new Error('OCR worker is not initialized');
      }
      
      console.log('Worker ready, starting recognition...');
      
      // Add timeout to prevent hanging
      const recognizePromise = this.worker.recognize(imageFile);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OCR recognition timed out after 30 seconds')), 30000)
      );
      
      const result = await Promise.race([recognizePromise, timeoutPromise]);
      console.log('Recognition result:', result);
      
      const text = result?.data?.text || result?.text || '';
      
      if (onProgress) {
        onProgress(100);
      }

      console.log('Raw OCR text extracted (length:', text.length, '):', text.substring(0, 200));
      return text;
    } catch (error) {
      console.error('OCR text extraction failed:', error);
      console.error('Worker initialized:', this.isInitialized);
      console.error('Worker exists:', !!this.worker);
      
      // Reset worker if it's broken
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('SetImageFile') || errorMessage.includes('null')) {
        console.log('Resetting broken OCR worker...');
        await this.terminate();
        this.isInitialized = false;
        this.worker = null;
      }
      
      throw new Error(`Failed to extract text from receipt: ${error?.message || String(error)}`);
    } finally {
      this.recognitionInProgress = false;
    }
  }

  parseReceiptData(rawText) {
    console.log('Parsing receipt data from text:', rawText);
    
    const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const receiptData = {
      vendor: '',
      date: '',
      total: 0,
      subtotal: 0,
      tax: 0,
      items: [],
      rawText: rawText,
      confidence: 'medium'
    };

    try {
      // Extract vendor (usually first few lines)
      receiptData.vendor = this.extractVendor(lines);
      
      // Extract date
      receiptData.date = this.extractDate(lines);
      
      // Extract monetary amounts
      const amounts = this.extractAmounts(lines);
      receiptData.total = amounts.total;
      receiptData.subtotal = amounts.subtotal;
      receiptData.tax = amounts.tax;
      
      // Extract line items
      receiptData.items = this.extractLineItems(lines);
      
      // Assess confidence based on extracted data quality
      receiptData.confidence = this.assessConfidence(receiptData);
      
      console.log('Parsed receipt data:', receiptData);
      return receiptData;
    } catch (error) {
      console.error('Error parsing receipt data:', error);
      return receiptData; // Return partial data even if parsing fails
    }
  }

  extractVendor(lines) {
    const vendorPatterns = [
      /^[A-Z][A-Za-z\s&]{2,30}$/,
      /^[A-Z\s]{3,30}$/,
      /\b(STORE|SHOP|MARKET|FARM|SUPPLY|CO|INC|LLC|LTD)\b/i
    ];

    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      if (line.length < 3 || line.length > 50) continue;
      
      for (const pattern of vendorPatterns) {
        if (pattern.test(line)) {
          return line.replace(/[^a-zA-Z0-9\s&-]/g, '').trim();
        }
      }
    }

    // Fallback: return first substantial line
    for (const line of lines.slice(0, 3)) {
      if (line.length >= 3 && line.length <= 30 && /^[A-Za-z]/.test(line)) {
        return line.replace(/[^a-zA-Z0-9\s&-]/g, '').trim();
      }
    }

    return 'Unknown Vendor';
  }

  extractDate(lines) {
    const datePatterns = [
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2})/,
      /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}[,\s]+\d{4}/i,
      /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i
    ];

    const text = lines.join(' ');
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const dateStr = match[1] || match[0];
        const parsedDate = new Date(dateStr);
        
        if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
          return parsedDate.toISOString().split('T')[0];
        }
      }
    }

    // Default to today if no date found
    return new Date().toISOString().split('T')[0];
  }

  extractAmounts(lines) {
    const amounts = { total: 0, subtotal: 0, tax: 0 };
    const text = lines.join('\n').toLowerCase();

    // More precise patterns for receipt amounts
    const totalPatterns = [
      /total\s+(\d+\.\d{2})/i,
      /(?:^|\n)\s*total\s*[\$]?(\d+\.\d{2})/i,
      /(?:amount due|balance)\s*[\$]?(\d+\.\d{2})/i
    ];

    const subtotalPatterns = [
      /subtotal\s+(\d+\.\d{2})/i,
      /(?:^|\n)\s*subtotal\s*[\$]?(\d+\.\d{2})/i
    ];

    const taxPatterns = [
      /tax\s+(\d+\.\d{2})/i,
      /(?:^|\n)\s*tax\s*[\$]?(\d+\.\d{2})/i
    ];

    // Extract amounts more precisely
    for (const line of lines) {
      const lineLower = line.toLowerCase().trim();
      
      // Check for total line
      if (lineLower.startsWith('total') && lineLower.includes('.')) {
        const match = lineLower.match(/total\s*(\d+\.\d{2})/);
        if (match) {
          amounts.total = parseFloat(match[1]);
          continue;
        }
      }
      
      // Check for subtotal line
      if (lineLower.startsWith('subtotal') && lineLower.includes('.')) {
        const match = lineLower.match(/subtotal\s*(\d+\.\d{2})/);
        if (match) {
          amounts.subtotal = parseFloat(match[1]);
          continue;
        }
      }
      
      // Check for tax line
      if (lineLower.startsWith('tax') && lineLower.includes('.')) {
        const match = lineLower.match(/tax\s*(\d+\.\d{2})/);
        if (match) {
          amounts.tax = parseFloat(match[1]);
          continue;
        }
      }
    }

    // If no subtotal but we have total and tax, calculate subtotal
    if (amounts.total > 0 && amounts.tax > 0 && amounts.subtotal === 0) {
      amounts.subtotal = amounts.total - amounts.tax;
    }

    // If no tax but we have total and subtotal, calculate tax
    if (amounts.total > 0 && amounts.subtotal > 0 && amounts.tax === 0) {
      amounts.tax = amounts.total - amounts.subtotal;
    }

    // If we only have total, use it as subtotal too
    if (amounts.total > 0 && amounts.subtotal === 0 && amounts.tax === 0) {
      amounts.subtotal = amounts.total;
    }

    return amounts;
  }

  extractLineItems(lines) {
    const items = [];
    
    // Skip lines that are clearly not items
    const skipPatterns = [
      /^(subtotal|tax|total|debit|credit|cash|change)/i,
      /^(date|time|store|register|cashier|ticket)/i,
      /^(authorization|bank|terminal|cryptogram)/i,
      /^\d+\s*-\s*\d+\s*-\s*\d+/,  // phone numbers
      /^[a-z\s]*\d{3,}\s*[a-z\s]*$/i  // address-like patterns
    ];
    
    // Look for actual item lines - these typically have item codes and prices
    for (const line of lines) {
      const lineTrimmed = line.trim();
      
      // Skip empty lines and lines that match skip patterns
      if (!lineTrimmed || skipPatterns.some(pattern => pattern.test(lineTrimmed))) {
        continue;
      }
      
      // Look for item patterns: description followed by price at end of line
      // Example: "CLOTH 1/4INX1/4IN 24INXBFT" followed by amounts
      const itemMatch = lineTrimmed.match(/^(.+?)\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s*[A-Z]*$/);
      
      if (itemMatch) {
        const description = itemMatch[1].trim();
        const quantity = parseInt(itemMatch[2]) || 1;
        const unitPrice = parseFloat(itemMatch[3]) || 0;
        const total = parseFloat(itemMatch[4]) || 0;
        
        // Validate this looks like a real item
        if (description.length > 3 && total > 0 && 
            !description.toLowerCase().includes('total') &&
            !description.toLowerCase().includes('subtotal') &&
            !description.toLowerCase().includes('tax')) {
          
          items.push({
            description: description,
            quantity: quantity,
            unitPrice: unitPrice,
            total: total,
            category: this.categorizeItem(description)
          });
        }
      }
    }
    
    // If no items found with the strict pattern, try a more lenient approach
    if (items.length === 0) {
      for (const line of lines) {
        const lineTrimmed = line.trim();
        
        if (!lineTrimmed || skipPatterns.some(pattern => pattern.test(lineTrimmed))) {
          continue;
        }
        
        // Look for lines that end with a price and have a substantial description
        const simpleItemMatch = lineTrimmed.match(/^(.+?)\s+(\d+\.\d{2})$/);
        
        if (simpleItemMatch) {
          const description = simpleItemMatch[1].trim();
          const price = parseFloat(simpleItemMatch[2]);
          
          // Only include if it looks like a real item description
          if (description.length > 5 && price > 0 && 
              description.match(/[A-Z]/) && // Has uppercase letters
              !description.toLowerCase().includes('card') &&
              !description.toLowerCase().includes('reference')) {
            
            items.push({
              description: description,
              quantity: 1,
              unitPrice: price,
              total: price,
              category: this.categorizeItem(description)
            });
          }
        }
      }
    }

    return items;
  }

  categorizeItem(description) {
    const categories = {
      'Seeds & Plants': ['seed', 'plant', 'seedling', 'bulb', 'sapling'],
      'Fertilizers': ['fertilizer', 'compost', 'manure', 'nitrogen', 'phosphate'],
      'Pesticides': ['pesticide', 'herbicide', 'insecticide', 'fungicide', 'spray'],
      'Tools & Equipment': ['shovel', 'rake', 'hoe', 'tractor', 'mower', 'tool'],
      'Feed & Nutrition': ['feed', 'grain', 'hay', 'corn', 'oats', 'supplement'],
      'Fuel & Energy': ['gas', 'diesel', 'fuel', 'oil', 'propane', 'electric'],
      'Maintenance': ['repair', 'part', 'maintenance', 'service', 'replacement'],
      'Supplies': ['bag', 'container', 'packaging', 'supplies', 'material']
    };

    const lowerDesc = description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }

    return 'General Supplies';
  }

  assessConfidence(receiptData) {
    let score = 0;
    
    // Vendor found
    if (receiptData.vendor && receiptData.vendor !== 'Unknown Vendor') score += 20;
    
    // Valid date
    if (receiptData.date && receiptData.date !== new Date().toISOString().split('T')[0]) score += 20;
    
    // Total amount found
    if (receiptData.total > 0) score += 30;
    
    // Items found
    if (receiptData.items.length > 0) score += 20;
    
    // Text quality (length indicates OCR success)
    if (receiptData.rawText.length > 50) score += 10;

    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  async terminate() {
    if (this.worker) {
      try {
        await this.worker.terminate();
      } catch (error) {
        console.warn('Error terminating OCR worker:', error);
      }
      this.worker = null;
    }
    
    this.isInitialized = false;
    this.initializationPromise = null;
    this.recognitionInProgress = false;
  }
}

// Singleton instance
export const ocrService = new ReceiptOCRService();

// Helper function for easy use
export const processReceiptImage = async (imageFile, onProgress) => {
  try {
    const rawText = await ocrService.extractTextFromImage(imageFile, onProgress);
    const receiptData = ocrService.parseReceiptData(rawText);
    return receiptData;
  } catch (error) {
    console.error('Receipt processing failed:', error);
    throw error;
  }
};