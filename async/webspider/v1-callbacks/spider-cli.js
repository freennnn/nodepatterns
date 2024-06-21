import { spiderV1Base } from './spider.js'
import { spiderV1Refactored } from './spider.js'
import { spiderV2 } from './spider.js'

function spiderV1Callback(err, filePath, downloadedSuccessfully) {
  if (err) {
    console.error(err)
  } else if (downloadedSuccessfully) {
    console.log(`Completed the download of ${filePath}`)
  } else {
    console.log(`${filePath} was already donwloaded`)
  }
}

//spiderV1Base(process.argv[2], spiderV1Callback);
//spiderV1Refactored(process.argv[2], spiderV1Callback);
let nesting = Number.parseInt(process.argv[3], 10) || 1
spiderV2(process.argv[2], nesting, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('Download complete')
})