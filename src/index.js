import db from './icondb'

class FileIcons {
  constructor (iconDB = db) {
    this.db = iconDB
  }
  /**
   * Match an icon using a resource's basename.
   *
   * @param {String} name - Name of filesystem entity
   * @return {Icon}
   */
  getIcon (path) {
    for (const icon of this.db) {
      if (icon.match.test(path)) {
        return icon
      }
    }
    return null
  }
}

export default FileIcons
