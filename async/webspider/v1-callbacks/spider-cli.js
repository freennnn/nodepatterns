import { spiderv1 } from './spider.js'
spiderv1(process.argv[2], (err, filename, downloadedSuccessfully) => {
  if (err) {
    console.error(err)
  } else if (downloadedSuccessfully) {
    console.log(`Completed the download of ${filename}`)
  } else {
    console.log(`${filename} was already donwloaded`)
  }
})