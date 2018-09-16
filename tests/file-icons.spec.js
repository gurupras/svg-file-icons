import FileIcons from '@/index'

let fileIcons
beforeAll(async () => {
  fileIcons = new FileIcons()
})

describe('FileIcons', async () => {
  test('Fetch icon', async () => {
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
})
