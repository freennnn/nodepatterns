import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import  mkdirp from 'mkdirp'
import { urlToFilename, currentDirPath, storagePathForFilename } from "./utils.js";

// callbacks based, pyramide of doom - callback hell
export function spiderv1(url, cb) {
  let filename = urlToFilename(url);
  let filepath = storagePathForFilename(filename);
  console.log(filepath);
  fs.access(filepath, err => {
    if (err && err.code === 'ENOENT') {
      console.log(`Downloading ${url} into ${filepath}`)
      superagent.get(url).end((err, res) => {
        if (err) {
          cb(err)
        } else {
          console.log(`mkdirp for ${path.dirname(filepath)}`)
          mkdirp(path.dirname(filepath), err => {
            if (err) {
              cb(err)
            } else {
              fs.writeFile(filepath, res.text, err => {
                if (err) {
                  cb(err)
                } else {
                  cb(null, filepath, true)
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

// callback based, with best practices - like early return + small/decoupled functions
export function spiderv2(url, cb) {
  let filename = urlToFilename(url);
  let filePath = storagePathForFilename(filename);
  fs.access(filePath, err => {
    if (!err || err.code !== 'ENOENT') {
      return cb(null, filePath, false);
    }
    download(url, filePath, err => {
      if (err) {
        return cb(err);
      }
      cb(null, filePath, true)
    })
  })
} 

function saveToFile(filePath, contents, cb) {
  mkdirp(path.dirname(filePath), err => {
    if (err) {
      return cb(err);
    }
    fs.writeFile(filePath, contents, err => {
      if (err) {
        return cb(err);
      }
      cb(null, filePath, true)
    })
  })
}

function download(url, filePath, cb) {
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err)
    }
    saveToFile(filePath, res.text, cb);
  });
}
