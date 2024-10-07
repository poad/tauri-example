#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;
use tauri::menu::Menu;

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![cmd::save, cmd::load])
    .menu(Menu::os_default(&context.package_info().name))
    .run(context)
    .expect("error while running tauri application");
}
