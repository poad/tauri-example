#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs::{write};

#[tauri::command]
async fn write_entry(app: tauri::AppHandle) -> Result<(), String> {
  let app_dir = app.path_resolver().app_dir().expect("failed to get app dir");
  let report_path = app_dir.join("report.txt");
  write(&report_path, r#"the file content"#)
    .map_err(|e| e.to_string());
  Ok(())
}


fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![write_entry])
    .menu(tauri::Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
