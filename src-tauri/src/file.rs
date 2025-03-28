
use std::fs::File;
use std::path::PathBuf;
use std::io::{Read, Write};

pub async fn write_to_file(path: PathBuf, mut contents: String) -> std::io::Result<()> {
  println!("{}", &contents);
  let mut f = File::create(path)?;
  let body = unsafe { contents.as_mut_str().as_bytes_mut() };
  f.write_all(body)?;
  f.sync_all()?;
  f.flush()
}

pub async fn read_from_file(path: PathBuf) -> std::io::Result<String> {
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
