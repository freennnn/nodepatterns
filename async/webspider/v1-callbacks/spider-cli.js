import { spiderv1 } from './spider.js'
import { spiderv2 } from './spider.js'

function spiderCallback(err, filePath, downloadedSuccessfully) {
  if (err) {
    console.error(err)
  } else if (downloadedSuccessfully) {
    console.log(`Completed the download of ${filePath}`)
  } else {
    console.log(`${filePath} was already donwloaded`)
  }
}

//spiderv1(process.argv[2], spiderCallback);

spiderv2(process.argv[2], spiderCallback);