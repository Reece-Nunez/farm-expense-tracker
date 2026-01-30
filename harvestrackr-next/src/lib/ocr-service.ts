import { createWorker, Worker } from "tesseract.js";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/schemas/expense";

// Parsed receipt data interface
export interface ParsedReceiptData {
  vendor: string;
  date: string;
  total: number;
  subtotal: number;
  tax: number;
  items: ParsedLineItem[];
  rawText: string;
  confidence: "high" | "medium" | "low";
}

export interface ParsedLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: ExpenseCategory;
}

// Category keywords mapping for auto-categorization
const CATEGORY_KEYWORDS: Record<string, ExpenseCategory> = {
  // Seeds and Plants
  seed: "Seeds and Plants",
  plant: "Seeds and Plants",
  seedling: "Seeds and Plants",
  bulb: "Seeds and Plants",
  sapling: "Seeds and Plants",

  // Fertilizers
  fertilizer: "Fertilizers and Lime",
  compost: "Fertilizers and Lime",
  manure: "Fertilizers and Lime",
  nitrogen: "Fertilizers and Lime",
  phosphate: "Fertilizers and Lime",
  lime: "Fertilizers and Lime",

  // Chemicals
  pesticide: "Chemicals",
  herbicide: "Chemicals",
  insecticide: "Chemicals",
  fungicide: "Chemicals",
  spray: "Chemicals",
  chemical: "Chemicals",

  // Feed
  feed: "Feed Purchased",
  grain: "Feed Purchased",
  hay: "Feed Purchased",
  corn: "Feed Purchased",
  oats: "Feed Purchased",
  supplement: "Feed Purchased",

  // Fuel
  gas: "Gasoline, Fuel, and Oil",
  diesel: "Gasoline, Fuel, and Oil",
  fuel: "Gasoline, Fuel, and Oil",
  oil: "Gasoline, Fuel, and Oil",
  propane: "Gasoline, Fuel, and Oil",
  gasoline: "Gasoline, Fuel, and Oil",

  // Equipment
  tractor: "Farm Equipment",
  mower: "Farm Equipment",
  equipment: "Farm Equipment",
  machinery: "Farm Equipment",

  // Tools
  shovel: "Supplies Purchased",
  rake: "Supplies Purchased",
  hoe: "Supplies Purchased",
  tool: "Supplies Purchased",

  // Repairs
  repair: "Repairs and Maintenance",
  part: "Repairs and Maintenance",
  maintenance: "Repairs and Maintenance",
  service: "Repairs and Maintenance",

  // Vet/Medicine
  vet: "Vet",
  veterinary: "Vet",
  vaccine: "Medicine",
  medicine: "Medicine",
  medication: "Medicine",
  antibiotic: "Medicine",

  // Utilities
  electric: "Utilities",
  water: "Utilities",
  utility: "Utilities",
  power: "Utilities",

  // Freight
  freight: "Freight and Trucking",
  trucking: "Freight and Trucking",
  shipping: "Freight and Trucking",
  delivery: "Freight and Trucking",
};

export class ReceiptOCRService {
  private worker: Worker | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private recognitionInProgress = false;

  async initializeOCR(): Promise<void> {
    if (this.isInitialized && this.worker) return;

    if (this.initializationPromise) {
      await this.initializationPromise;
      return;
    }

    this.initializationPromise = this._doInitialize();

    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log("Initializing OCR worker with Tesseract.js...");

      if (this.worker) {
        try {
          await this.worker.terminate();
        } catch (e) {
          console.warn("Error terminating existing worker:", e);
        }
        this.worker = null;
        this.isInitialized = false;
      }

      this.worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status && m.progress !== undefined) {
            console.log(`OCR ${m.status}: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      await this.worker.setParameters({
        tessedit_char_whitelist:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,/$-:()#",
      });

      console.log("OCR worker fully initialized and ready");
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize OCR worker:", error);
      this.worker = null;
      this.isInitialized = false;
      throw new Error(
        `Failed to initialize OCR service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async extractTextFromImage(
    imageFile: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    if (this.recognitionInProgress) {
      throw new Error("OCR recognition is already in progress. Please wait.");
    }

    if (!this.isInitialized || !this.worker) {
      await this.initializeOCR();
    }

    this.recognitionInProgress = true;

    try {
      console.log("Starting OCR text extraction...");
      console.log("Image file type:", imageFile?.type);
      console.log("Image file size:", imageFile?.size);

      if (!imageFile) {
        throw new Error("No image file provided");
      }

      if (!imageFile.type?.startsWith("image/")) {
        throw new Error("Invalid file type. Please provide an image file.");
      }

      onProgress?.(25);

      if (!this.worker) {
        throw new Error("OCR worker is not initialized");
      }

      console.log("Worker ready, starting recognition...");

      const recognizePromise = this.worker.recognize(imageFile);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("OCR recognition timed out after 30 seconds")),
          30000
        )
      );

      const result = await Promise.race([recognizePromise, timeoutPromise]);
      console.log("Recognition result:", result);

      const text = result?.data?.text || "";

      onProgress?.(100);

      console.log(
        "Raw OCR text extracted (length:",
        text.length,
        "):",
        text.substring(0, 200)
      );
      return text;
    } catch (error) {
      console.error("OCR text extraction failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("SetImageFile") || errorMessage.includes("null")) {
        console.log("Resetting broken OCR worker...");
        await this.terminate();
        this.isInitialized = false;
        this.worker = null;
      }

      throw new Error(
        `Failed to extract text from receipt: ${errorMessage}`
      );
    } finally {
      this.recognitionInProgress = false;
    }
  }

  parseReceiptData(rawText: string): ParsedReceiptData {
    console.log("Parsing receipt data from text:", rawText);

    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const receiptData: ParsedReceiptData = {
      vendor: "",
      date: "",
      total: 0,
      subtotal: 0,
      tax: 0,
      items: [],
      rawText: rawText,
      confidence: "medium",
    };

    try {
      receiptData.vendor = this.extractVendor(lines);
      receiptData.date = this.extractDate(lines);

      const amounts = this.extractAmounts(lines);
      receiptData.total = amounts.total;
      receiptData.subtotal = amounts.subtotal;
      receiptData.tax = amounts.tax;

      receiptData.items = this.extractLineItems(lines);
      receiptData.confidence = this.assessConfidence(receiptData);

      console.log("Parsed receipt data:", receiptData);
      return receiptData;
    } catch (error) {
      console.error("Error parsing receipt data:", error);
      return receiptData;
    }
  }

  extractVendor(lines: string[]): string {
    const vendorPatterns = [
      /^[A-Z][A-Za-z\s&]{2,30}$/,
      /^[A-Z\s]{3,30}$/,
      /\b(STORE|SHOP|MARKET|FARM|SUPPLY|CO|INC|LLC|LTD)\b/i,
    ];

    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      if (line.length < 3 || line.length > 50) continue;

      for (const pattern of vendorPatterns) {
        if (pattern.test(line)) {
          return line.replace(/[^a-zA-Z0-9\s&-]/g, "").trim();
        }
      }
    }

    for (const line of lines.slice(0, 3)) {
      if (line.length >= 3 && line.length <= 30 && /^[A-Za-z]/.test(line)) {
        return line.replace(/[^a-zA-Z0-9\s&-]/g, "").trim();
      }
    }

    return "Unknown Vendor";
  }

  extractDate(lines: string[]): string {
    const datePatterns = [
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2})/,
      /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}[,\s]+\d{4}/i,
      /\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}/i,
    ];

    const text = lines.join(" ");

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const dateStr = match[1] || match[0];
        const parsedDate = new Date(dateStr);

        if (!isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 2000) {
          return parsedDate.toISOString().split("T")[0];
        }
      }
    }

    return new Date().toISOString().split("T")[0];
  }

  extractAmounts(lines: string[]): {
    total: number;
    subtotal: number;
    tax: number;
  } {
    const amounts = { total: 0, subtotal: 0, tax: 0 };

    for (const line of lines) {
      const lineLower = line.toLowerCase().trim();

      if (lineLower.startsWith("total") && lineLower.includes(".")) {
        const match = lineLower.match(/total\s*(\d+\.\d{2})/);
        if (match) {
          amounts.total = parseFloat(match[1]);
          continue;
        }
      }

      if (lineLower.startsWith("subtotal") && lineLower.includes(".")) {
        const match = lineLower.match(/subtotal\s*(\d+\.\d{2})/);
        if (match) {
          amounts.subtotal = parseFloat(match[1]);
          continue;
        }
      }

      if (lineLower.startsWith("tax") && lineLower.includes(".")) {
        const match = lineLower.match(/tax\s*(\d+\.\d{2})/);
        if (match) {
          amounts.tax = parseFloat(match[1]);
          continue;
        }
      }
    }

    if (amounts.total > 0 && amounts.tax > 0 && amounts.subtotal === 0) {
      amounts.subtotal = amounts.total - amounts.tax;
    }

    if (amounts.total > 0 && amounts.subtotal > 0 && amounts.tax === 0) {
      amounts.tax = amounts.total - amounts.subtotal;
    }

    if (amounts.total > 0 && amounts.subtotal === 0 && amounts.tax === 0) {
      amounts.subtotal = amounts.total;
    }

    return amounts;
  }

  extractLineItems(lines: string[]): ParsedLineItem[] {
    const items: ParsedLineItem[] = [];

    const skipPatterns = [
      /^(subtotal|tax|total|debit|credit|cash|change)/i,
      /^(date|time|store|register|cashier|ticket)/i,
      /^(authorization|bank|terminal|cryptogram)/i,
      /^\d+\s*-\s*\d+\s*-\s*\d+/,
      /^[a-z\s]*\d{3,}\s*[a-z\s]*$/i,
    ];

    for (const line of lines) {
      const lineTrimmed = line.trim();

      if (
        !lineTrimmed ||
        skipPatterns.some((pattern) => pattern.test(lineTrimmed))
      ) {
        continue;
      }

      const itemMatch = lineTrimmed.match(
        /^(.+?)\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s*[A-Z]*$/
      );

      if (itemMatch) {
        const description = itemMatch[1].trim();
        const quantity = parseInt(itemMatch[2]) || 1;
        const unitPrice = parseFloat(itemMatch[3]) || 0;
        const total = parseFloat(itemMatch[4]) || 0;

        if (
          description.length > 3 &&
          total > 0 &&
          !description.toLowerCase().includes("total") &&
          !description.toLowerCase().includes("subtotal") &&
          !description.toLowerCase().includes("tax")
        ) {
          items.push({
            description: description,
            quantity: quantity,
            unitPrice: unitPrice,
            total: total,
            category: this.categorizeItem(description),
          });
        }
      }
    }

    if (items.length === 0) {
      for (const line of lines) {
        const lineTrimmed = line.trim();

        if (
          !lineTrimmed ||
          skipPatterns.some((pattern) => pattern.test(lineTrimmed))
        ) {
          continue;
        }

        const simpleItemMatch = lineTrimmed.match(/^(.+?)\s+(\d+\.\d{2})$/);

        if (simpleItemMatch) {
          const description = simpleItemMatch[1].trim();
          const price = parseFloat(simpleItemMatch[2]);

          if (
            description.length > 5 &&
            price > 0 &&
            description.match(/[A-Z]/) &&
            !description.toLowerCase().includes("card") &&
            !description.toLowerCase().includes("reference")
          ) {
            items.push({
              description: description,
              quantity: 1,
              unitPrice: price,
              total: price,
              category: this.categorizeItem(description),
            });
          }
        }
      }
    }

    return items;
  }

  categorizeItem(description: string): ExpenseCategory {
    const lowerDesc = description.toLowerCase();

    for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }

    return "Supplies Purchased";
  }

  assessConfidence(receiptData: ParsedReceiptData): "high" | "medium" | "low" {
    let score = 0;

    if (receiptData.vendor && receiptData.vendor !== "Unknown Vendor") {
      score += 20;
    }

    if (
      receiptData.date &&
      receiptData.date !== new Date().toISOString().split("T")[0]
    ) {
      score += 20;
    }

    if (receiptData.total > 0) {
      score += 30;
    }

    if (receiptData.items.length > 0) {
      score += 20;
    }

    if (receiptData.rawText.length > 50) {
      score += 10;
    }

    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      try {
        await this.worker.terminate();
      } catch (error) {
        console.warn("Error terminating OCR worker:", error);
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
export async function processReceiptImage(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<ParsedReceiptData> {
  try {
    const rawText = await ocrService.extractTextFromImage(imageFile, onProgress);
    const receiptData = ocrService.parseReceiptData(rawText);
    return receiptData;
  } catch (error) {
    console.error("Receipt processing failed:", error);
    throw error;
  }
}
