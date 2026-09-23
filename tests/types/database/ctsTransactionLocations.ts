export type CTSTransactionLocations = {
  trans_id: bigint
  trans_type: string
  loc_receive_ppaf_flag: string
  loc_id: number
  loc_slt_id: number | null
  loc_lty_id: number
  loc_cty_id: number
  loc_receive_labels_flag: string
  loc_effective_from: string
  loc_effective_to: string | null
  loc_cessation_reason: string | null
  loc_premises_type: string
  loc_comments: string | null
  loc_map_reference: string | null
  loc_source_identifier: string
  loc_source_reference: string
  loc_tel_number: string | null
  loc_mobile_number: string | null
  loc_fax_number: string | null
  loc_email_address: string | null
  loc_current_status: string
  loc_current_user: string
  loc_current_modified_date: string
  loc_current_pid: number
  loc_reason_code: string | null
  loc_version: number
  fake_data: number
  row_number: number
  loc_aud_id: bigint
  loc_aud_type: string
  loc_aud_datetime: string
  record_type: string
  record_count: number
  imported_date: string
  cts_file_import_id: bigint
}
