
export interface AnalysisResult {
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correctOption: string;
  justification: string;
  regulationReference: string;
}

export interface AppState {
  isAnalyzing: boolean;
  images: string[];
  result: AnalysisResult[] | null;
  error: string | null;
  hasApiKey: boolean;
}
