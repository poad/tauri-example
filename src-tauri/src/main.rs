#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Serialize, Deserialize};
use dirs::config_dir;
use tauri::command;

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub struct WriteRequest {
    contents: String,
}

#[derive(Debug, Serialize)]
#[allow(dead_code)]
pub struct LoadReaponse {
  error: bool,
  message: String,
  contents: String,
}

mod file;

#[command]
async fn save_to_file(body: WriteRequest) -> String {
  let path = config_dir().expect("No such find config dir").join("otp_entries");

  let result = file::write_to_file(path, body.contents).await;
  match result {
    Ok(_) => "message response".into(),
    Err(err) => err.to_string()
  }
}

#[command]
async fn load_from_file() -> LoadReaponse {
  let path = config_dir().expect("No such find config dir").join("otp_entries");

  if !path.exists() {
    return LoadReaponse{
      error: false,
      message: "".to_string(),
      contents: "".to_string()
    }
  }
  // println!("{}", (&path).display());
  let result = file::read_from_file(path).await;
  match result {
    Ok(contents) => {
      // println!("{}", &contents);
      LoadReaponse{
        error: false,
        message: "".to_string(),
        contents: contents
      }
    },
    Err(err) => {
      // println!("{}", (&err).to_string());

      LoadReaponse{
        error: true,
        message: err.to_string(),
        contents: "".to_string()
      }
    }
  }
}

fn main() {
  let context = tauri::generate_context!();
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![save_to_file, load_from_file])
    .run(context)
    .expect("error while running tauri application");
}
