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
  },
};

interface ICase {
  case_number: string,
  case_age: string,
  case_gender: string,
  case_location: string,
  case_diagnose_date: string,
  case_source_of_infection: string,
  case_condition: string,
  case_quarantine: string
};

export interface IDetailsResponse {
  data: {
    cases: ICase[]
  },
};

interface IGovernorate {
  Name: string,
  Cases: string,
  CentralQuarantine: string,
  HomeQuarantine: string,
  Recovered: number,
  Deaths: number
};

export interface IGovernoratesSummaryResponse {
  data: {
    Governorates: IGovernorate[]
  },
};

