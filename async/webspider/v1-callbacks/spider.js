import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import  mkdirp from 'mkdirp'
import { urlToFilename, currentDirPath, storagePathForFilename } from "./utils.js";

// callbacks based, pyramide of doom - callback hell
export function spiderV1Base(url, cb) {
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
export function spiderV1Refactored(url, cb) {
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

function download(url, filePath, cb) {
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err)
    }
    saveToFile(filePath, res.text, cb);
  });
}

function saveToFile(filePath, contents, cb) {
  mkdirp(path.dirname(filePath), err => {
    if (err) {
      return cb(err);
    }
    fs.writeFile(filePath, contents, cb);
  })
}

// recursive downloading all links in the initial page and so on
// sequential execution of collection of async tasks (with nesting limit)
export function spiderV2 (url, nesting, cb) {
  const filename = urlToFilename(url)
  const filePath = storagePathForFilename(filename)
  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        return cb(err)
      }
      // The file doesn't exist - download it first, then spiderLinks()
      return download(url, filePath, (err, requestContent) => {
        if (err) {
          return cb(err)
        }
        spiderLinks(url, requestContent, nesting, cb)
      })
    }
    // The file already exists, let's process the links
    spiderLinks(url, fileContent, nesting, cb)
  })

  function spiderLinks(currentUrl, body, nesting, cb) {
    if (nesting === 0) {
      process.nextTick(cb)
    }
    const links = getPageLinks(currentUrl, body)
    if (links.length === 0) {
      return process.nextTick(cb)
    }
    function iterate(index) {
      if (index === links.length) {
        return cb();
      }
      spiderLinks(links[index], nesting -1, function (err) {
        if (err) {
          return cb(err)
        }
        iterate(index+1)
      })
      iterate(0)
    }
  }
}
