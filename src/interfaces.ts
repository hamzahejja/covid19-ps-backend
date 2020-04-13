export interface ISummaryResponse {
  data: {
    LastUpdated: string;
    TotalCases: number;
    TotalRecovery: number;
    TotalActiveCases: number;
    TotalDeath: number;
    TotalCriticalCases: number;
    TotalTestedSamples: number;
    HomeQuarantine: string | number;
    CentralQuarantine: string | number;
    DetailedMap: string;
  },
};

export interface ICase {
  case_number: string,
  case_age: string,
  case_gender: string,
  case_location: string,
  case_diagnose_date: string,
  case_source_of_infection: string,
  case_condition: string,
  case_quarantine: string,
  case_community: string,
};

export interface IDetailsResponse {
  data: {
    cases: ICase[]
  },
};

export interface IGovernorate {
  Name: string,
  Cases: string,
  CentralQuarantine: string,
  HomeQuarantine: string,
  Recovered: number|boolean,
  Deaths: number
};

export interface IGovernoratesSummaryResponse {
  data: {
    Governorates: IGovernorate[]
  },
};
