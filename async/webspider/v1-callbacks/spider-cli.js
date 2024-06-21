import { spiderV1Base } from './spider.js'
import { spiderV1Refactored } from './spider.js'

function spiderCallback(err, filePath, downloadedSuccessfully) {
  if (err) {
    console.error(err)
  } else if (downloadedSuccessfully) {
    console.log(`Completed the download of ${filePath}`)
  } else {
    console.log(`${filePath} was already donwloaded`)
  }
}

//spiderV1Base(process.argv[2], spiderCallback);

spiderV1Refactored(process.argv[2], spiderCallback);