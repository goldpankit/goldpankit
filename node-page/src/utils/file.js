// 排序文件
export function sortFiles (files) {
  if (files == null || files.length === 0) {
    return
  }
  files.sort((item1, item2) => {
    if (item1.type === 'DIRECTORY' && item2.type === 'DIRECTORY') {
      if(item1.path.toLowerCase() < item2.path.toLowerCase()) {
        return -1
      }
      return 1
    }
    if (item1.type === 'DIRECTORY') {
      return -1
    }
    if (item2.type === 'DIRECTORY') {
      return 1
    }
    if(item1.path.toLowerCase() < item2.path.toLowerCase()) {
      return -1
    }
    return 1
  })
  for (const file of files) {
    sortFiles(file.children)
  }
}
