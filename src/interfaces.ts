export interface ISummaryResponse {
  data: {
    readonly LastUpdated: string;
    readonly TotalCases: number;
    readonly TotalRecovery: number;
    readonly TotalActiveCases: number;
    readonly TotalDeath: number;
    readonly TotalCriticalCases: number;
    readonly TotalTestedSamples: number;
    readonly HomeQuarantine: string | number;
    readonly CentralQuarantine: string | number;
    readonly DetailedMap: string;
  };
}
