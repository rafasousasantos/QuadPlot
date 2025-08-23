import { type SavedFunction, type InsertSavedFunction } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for saved complex functions
export interface IStorage {
  getSavedFunction(id: string): Promise<SavedFunction | undefined>;
  getAllSavedFunctions(): Promise<SavedFunction[]>;
  createSavedFunction(func: InsertSavedFunction): Promise<SavedFunction>;
  deleteSavedFunction(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private savedFunctions: Map<string, SavedFunction>;

  constructor() {
    this.savedFunctions = new Map();
  }

  async getSavedFunction(id: string): Promise<SavedFunction | undefined> {
    return this.savedFunctions.get(id);
  }

  async getAllSavedFunctions(): Promise<SavedFunction[]> {
    return Array.from(this.savedFunctions.values());
  }

  async createSavedFunction(insertFunc: InsertSavedFunction): Promise<SavedFunction> {
    const id = randomUUID();
    const savedFunction: SavedFunction = { 
      ...insertFunc, 
      id, 
      createdAt: new Date() 
    };
    this.savedFunctions.set(id, savedFunction);
    return savedFunction;
  }

  async deleteSavedFunction(id: string): Promise<boolean> {
    return this.savedFunctions.delete(id);
  }
}

export const storage = new MemStorage();
