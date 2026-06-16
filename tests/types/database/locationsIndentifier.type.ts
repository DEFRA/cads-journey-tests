export type LocationsIndentifier = {
  lid_id: number
  lid_loc_id: number
  lid_effective_from_date: string
  lid_identifier: string
  lid_full_identifier: string
  lid_sub_identifier: string | null
  lid_effective_to_date: string | null
  lid_current_status: number
  lid_current_modified_date: string
  lid_current_user: string
  lid_current_pid: number
  lid_current_amend_reason: string | null
  lid_version: number
  row_number: number
  record_type: string
  record_count: number
  imported_date: string
}
