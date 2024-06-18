import path from 'path'
import { URL, fileURLToPath } from 'url'
import slug from 'slug'

export function urlToFilename(url) {
  const parsedUrl = new URL(url);
  const urlPath = parsedUrl.pathname
    .split('/')
    .filter((el) => el !== '')
    .map((el) => slug(el, {remove: null}))
    .join('/')
  let filename = path.join(parsedUrl.hostname.replace('.', '-'), urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }
  
  console.log(filename);
  return filename
}

export function storagePathForFilename(filename) {
  const __dirname = path.join(currentDirPath(), "downloads");
  console.log(filename);
  return path.join(__dirname, filename);
}

export function currentDirPath() {
  return path.dirname(fileURLToPath(import.meta.url));
}