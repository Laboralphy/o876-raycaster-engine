const fs = require('fs')
const util = require('util')
const path = require('path')

const mkdir = util.promisify(fs.mkdir)
const ls = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)
const rm = util.promisify(fs.unlink)
const rmdir = util.promisify(fs.rmdir)
const write = util.promisify(fs.writeFile)
const read = util.promisify(fs.readFile)
const mv = util.promisify(fs.rename)
const access = util.promisify(fs.access)

class PromFS {
  /**
   * Builds the specified path.
   * Recursively builds all the missing folders when needed between the first path element and the last.
   * @param sPath {string} path to be created
   * @return {Promise}
   */
  static async mkdir (sPath) {
    const sParent = path.dirname(sPath)
    if (!await PromFS.stat(sParent)) {
      await PromFS.mkdir(sParent)
    }
    if (!await PromFS.stat(sPath)) {
      return mkdir(sPath)
    }
  }

  /**
   * Deletes the specified folder
   * @param sFolder {string}
   * @return {Promise}
   */
  static rmdir (sFolder) {
    return rmdir(sFolder)
  }

  /**
   * Lists all entries inside a folder
   * @param sPath {string}
   * @return {Promise} the returned format is [{name: string, dir: bool},...]
   */
  static async ls (sPath) {
    const list = await ls(sPath, {
      withFileTypes: true
    })
    return list.map(f => ({
      name: f.name,
      dir: f.isDirectory()
    }))
  }

  /**
   * Renvoie une arborescence de fichier/dossier
   * [
   *  fic1,
   *  fic2,
   *  folder1/fic3
   *  folder1/fic4
   * ]
   * @param sPath
   * @returns {Promise<[]>}
   */
  static async tree (sPath) {
    // 1 récupérer la list des entrée
    // 2 pour chaque folder, lancer tree puis ajouter le root
    const aFiles = await PromFS.ls(sPath)
    const aEntries = []
    for (let i = 0, l = aFiles.length; i < l; ++i) {
      const { name, dir } = aFiles[i]
      if (dir) {
        const sDirName = path.join(sPath, name)
        const aSubList = await PromFS.tree(sDirName)
        aEntries.push(...aSubList.map(f => path.join(name, f)))
      } else {
        aEntries.push(name)
      }
    }
    return aEntries
  }

  /**
   * Give stat structure for the given file
   * @param sFile {string}
   * @return {Promise} the returned format is {name: string, dir: bool, size: number, dates:[{created, modified, accessed}]}
   */
  static async stat (sFile) {
    try {
      const st = await stat(sFile)
      const pp = path.parse(sFile)
      return {
        name: pp.base,
        dir: st.isDirectory(),
        size: st.size,
        dates: {
          created: Math.floor(st.birthtimeMs / 1000),
          modified: Math.floor(st.mtimeMs / 1000),
          accessed: Math.floor(st.atimeMs / 1000)
        }
      }
    } catch (e) {
      return null
    }
  }

  /**
   * Deletes a file
   * @param sFile {string}
   * @return {Promise}
   */
  static rm (sFile) {
    return rm(sFile)
  }

  static mv (sOld, sNew) {
    return mv(sOld, sNew)
  }

  static read (sFile, bBinary = false) {
    return read(sFile, bBinary ? null : {
      encoding: 'utf8'
    })
  }

  static write (sFile, data) {
    return write(sFile, data, typeof data === 'string' ? {
      encoding: 'utf8'
    } : null)
  }

  /**
   * Copy one file content to another file, target and source file names must be specify.
   * The destination folder must exists
   * @param from {string} source file name
   * @param to {string} target file name. File name must be specified, destination folder is not enough
   * @return {Promise<any>}
   */
  static cp (from, to) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(to)
      output.on('close', function () {
        resolve(true)
      })
      output.on('error', function (err) {
        reject(err)
      })
      fs.createReadStream(from).pipe(output)
    })
  }

  static access (sFile, rights = '') {
    /**
     * @type {number}
     */
    const nMode = rights
      .toLowerCase()
      .split('')
      .map(r => {
        switch (r) {
          case 'r':
            return fs.constants.R_OK

          case 'w':
            return fs.constants.W_OK

          case 'x':
            return fs.constants.X_OK
        }
      })
      .reduce((prev, curr) => prev | curr, 0)
    return new Promise(resolve => {
      fs.access(sFile, nMode, err => {
        resolve(!err)
      })
    })
  }
}

module.exports = PromFS
