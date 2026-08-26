export enum EndPoints {
  Health = '/health',
  Locations = '/api/v1/location?'
}

export enum Queries {
  SelectAllLocationsIdentifiers = "SELECT *, TO_CHAR(lid_current_modified_date, 'YYYY-MM-DD') AS lid_current_modified_date FROM cts.ct_location_identifiers;",
  SelectAllLocations = "SELECT *, TO_CHAR(loc_current_modified_date, 'YYYY-MM-DD') AS loc_current_modified_date, TO_CHAR(loc_effective_to, 'YYYY-MM-DD') AS loc_effective_to FROM cts.ct_locations;"
}

export enum AuthFile {
  User = 'playwright/.auth/user.json'
}
