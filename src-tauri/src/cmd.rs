use serde::{Serialize, Deserialize};
use tauri::command;
use dirs::config_dir;
use std::fs::File;
use std::path::PathBuf;
use std::io::{Read, Write};

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

async fn write_to_file(path: PathBuf, mut contents: String) -> std::io::Result<()> {
  println!("{}", &contents);
  let mut f = File::create(path)?;
  let body = unsafe { contents.as_mut_str().as_bytes_mut() };
  f.write_all(body)?;
  f.sync_all()?;
  f.flush()
}

async fn read_from_file(path: PathBuf) -> std::io::Result<String> {
  let mut buffer = String::new();
  let f = File::open(path);
  match f {
    Ok(mut file) => {
      file.read_to_string(&mut buffer)?;
      Ok(buffer)
    },
    Err(err) => Err(err)
  }
}

#[command]
pub async fn save(body: WriteRequest) -> String {
  let path = config_dir().expect("No such find config dir").join("otp_entries");
  
  let result = write_to_file(path, body.contents).await;
  match result {
    Ok(_) => "message response".into(),
    Err(err) => err.to_string()
  }
}

#[command]
pub async fn load() -> LoadReaponse {
  let path = config_dir().expect("No such find config dir").join("otp_entries");
  
  if !path.exists() {
    return LoadReaponse{
      error: false,
      message: "".to_string(),
      contents: "".to_string()
    }
  }
  // println!("{}", (&path).display());
  let result = read_from_file(path).await;
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
