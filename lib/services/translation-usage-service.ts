import { TranslationUsageRecord, PromptType } from "../types/translation";

class TranslationUsageService {
  private records: TranslationUsageRecord[] = [];

  recordUsage(params: {
    languageCode: string;
    templateId: string;
    promptType: PromptType;
    estimatedTokens: number;
    estimatedCost: number;
    status: "simulated" | "success" | "failed";
  }): TranslationUsageRecord {
    const record: TranslationUsageRecord = {
      id: `usage-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      languageCode: params.languageCode,
      templateId: params.templateId,
      promptType: params.promptType,
      estimatedTokens: params.estimatedTokens,
      estimatedCost: params.estimatedCost,
      status: params.status,
      timestamp: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  getRecords(): TranslationUsageRecord[] {
    return [...this.records];
  }

  getTotalTokens(languageCode?: string): number {
    return this.records
      .filter((r) => !languageCode || r.languageCode === languageCode)
      .reduce((acc, curr) => acc + curr.estimatedTokens, 0);
  }

  getTotalEstimatedCost(languageCode?: string): number {
    return this.records
      .filter((r) => !languageCode || r.languageCode === languageCode)
      .reduce((acc, curr) => acc + curr.estimatedCost, 0);
  }
}

export const translationUsageService = new TranslationUsageService();
