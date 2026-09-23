export type CTSFileImports = {
  cts_file_import_id: number
  destination_table_name: string
  file_name: string
  total_rows_to_process: number
  added_at: string
  import_status_id: number
  processing_status_id: number
  rows_found: number
  import_start_at: string
  import_end_at: string
  processing_start_at: string | null
  processing_end_at: string | null
  failed_attempts: number
  last_error_reason: string | null
  group_key: string
  import_type: string
  batch_date: string
  rows_imported: number
  last_file_part_imported: number | null
  destination_prefix: string
  amendments_made_flag: boolean
}
