import path from 'path'
import { URL } from 'url'
import slug from 'slug'

export function urlToFilename(url) {
  const parsedUrl = new URL(url);
  const urlPath = parsedUrl.pathname
    .split('/')
    .filter((el) => el !== '')
    .map((el) => slug(el, {remove: null}))
    .join('/')
  let filename = path.join(parsedUrl.hostname.replace('.', '_'), urlPath)
  if (!path.extname(filename).match(/htm/)) {
    filename += '.html'
  }
  return filename
  console.log(filename);
}