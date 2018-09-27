import { FileIcons, library } from '@/index'

let fileIcons
beforeEach(async () => {
  fileIcons = new FileIcons()
})

describe('FileIcons', async () => {
  test('getIcon', async () => {
    const data = {
      'file.py': 'python-icon',
      '/long/path/readme.txt': 'book-icon',
      'random-file.txt': null,
      'charmap.md': 'markdown-icon',
      'tmux.conf': 'tmux-icon'
    }
    for (const file of Object.keys(data)) {
      const expected = data[file]
      const icon = fileIcons.getIcon(file)
      if (!expected) {
        expect(icon).not.toBeTruthy()
      } else {
        const { prefixedIconName } = icon
        expect(prefixedIconName).toEqual(expected)
      }
    }
  })

  test('getIconByCSSClass', async () => {
    await library.registerIconSet('octicons')
    const iconData = fileIcons.getIconByCSSClass('text-icon')
    expect(iconData.svg).toBeTruthy()
  })

  test('registerLESSIcon', async () => {
    await library.registerIconSet('octicons')
    const lessStr = `.dummy-icon:before       { font-family: octicons; font-size: 16px; top: 1px; content: "\\f016"; }`
    await fileIcons.registerLESSIcon(lessStr)
    const iconData = fileIcons.getIconByCSSClass('dummy-icon')
    expect(iconData.code).toEqual('f016')
    expect(iconData.svg).toBeTruthy()
  })

  test('addFolderIcon', async () => {
    await fileIcons.addFolderIcon()
    const iconData = fileIcons.getIconByCSSClass('folder-icon', 'octicons')
    expect(iconData.code).toEqual('f016')
    expect(iconData.svg).toBeTruthy()
  })
})
