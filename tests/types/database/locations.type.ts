export type Locations = {
  loc_receive_ppaf_flag: string
  loc_id: number
  loc_slt_id: string | null
  loc_lty_id: number
  loc_cty_id: number
  loc_receive_labels_flag: string
  loc_effective_from: string
  /** Formatted as YYYY-MM-DD, e.g. 1998-01-17 */
  loc_effective_to: string
  loc_cessation_reason: string
  loc_premises_type: string
  loc_comments: string
  loc_map_reference: string | null
  loc_source_identifier: string
  loc_source_reference: number
  loc_tel_number: string
  loc_mobile_number: string
  loc_fax_number: string
  loc_email_address: string
  loc_current_status: number
  loc_current_user: string
  loc_current_modified_date: string
  loc_current_pid: number
  loc_reason_code: string
  loc_version: number
  fake_data: number
  row_number: number
  record_type: string
  record_count: number
  imported_date: string
}
