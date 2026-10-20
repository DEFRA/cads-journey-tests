export enum EndPoints {
  Health = '/health',
  Locations = '/api/v1/location?',
  Generation = '/api/v1/systemadmin/generation',
  GenerationScenarios = '/api/v1/systemadmin/generation/scenarios',
  Upload = '/api/v1/test-support/files'
}

export enum Queries {
  SelectAllLocationsIdentifiers = "select *, TO_CHAR(lid_current_modified_date, 'YYYY-MM-DD') AS lid_current_modified_date from cts.ct_location_identifiers;",
  SelectAllLocations = "SELECT *, TO_CHAR(loc_current_modified_date, 'YYYY-MM-DD') AS loc_current_modified_date, TO_CHAR(loc_effective_to, 'YYYY-MM-DD') AS loc_effective_to FROM cts.ct_locations;",
  SelectAllFileImports = 'select * from cads.cts_file_imports;',
  SelectAllTransactions = 'select * from cts_transactions.ct_locations;'
}

export enum AuthFile {
  User = 'playwright/.auth/user.json'
}

export enum ScenarioTypes {
  BulkInsert = 'bulk',
  BulkUpdate = 'update'
}

export enum FileNames {
  Path = 'data/',
  BulkUpload0001 = 'CTSM_CADS_PREP_BULK_00001_001_CT_LOCATIONS_2026-07-28-094638.csv'
}

export enum CTSTableNames {
  Locations = 'ct_locations'
}

export const TableNames = {
  CTS: CTSTableNames
} as const
