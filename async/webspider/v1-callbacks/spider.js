import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import  mkdirp from 'mkdirp'
import { fileURLToPath } from 'url';
import { urlToFilename } from "./utils.js";

export function spider(url, cb) {
  let filename = urlToFilename(url);
  const __dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "downloads");
  filename = path.join(__dirname, filename);
  console.log(filename);
  fs.access(filename, err => {
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filename}`)
      superagent.get(url).end((err, res) => {
        if (err) {
          cb(err)
        } else {
          console.log(`mkdirp for ${path.dirname(filename)}`)
          mkdirp(path.dirname(filename), err => {
            if (err) {
              cb(err)
            } else {
              fs.writeFile(filename, res.text, err => {
                if (err) {
                  cb(err)
                } else {
                  cb(null, filename, true)
                }
              })
            }
          })
        }
      })
    } else if (err) {
      console.log(err);
    } else {
      cb(null, filename, false)
    }
  })
}