import ItemNode from './ItemNode'

class MultiwayTree {
  constructor(width, index) {
    this.root = null
    this.width = width
    this.columnIndex = index
    this.itemNodeArray = []
  }

  // add(element) {
  //   const node = new ItemNode(element)
  //   if (this.root === null) {
  //     this.itemNodeArray.push(node)
  //     return (this.root = node)
  //   }
  //   let currentNode = this.root
  //   let parent
  //   let compare
  //   while (currentNode) {
  //     parent = currentNode
  //     const isPeer = node.begin >= currentNode.peerEnd
  //     const isMin = node.begin >= currentNode.minEnd
  //     const isMax = node.begin >= currentNode.maxEnd
  //     if (isPeer && isMin && isMax) {
  //       this.root = node
  //       this.itemNodeArray.push(node)
  //       return
  //     }
  //     // 如果当前
  //     if (isPeer) {
  //       const right = parent.right
  //       if (right && node.begin >= right.peerEnd) {
  //         node.w++
  //         node.x--
  //         currentNode = currentNode.right
  //         this.setPeer(parent, node)
  //         this.setMinEnd(parent, node)
  //         this.setMax(parent, node)
  //         compare = false
  //       } else if (isMax) {
  //         node.w++
  //         currentNode = currentNode.right
  //         this.setMinEnd(parent, node)
  //         this.setMax(parent, node)
  //         compare = false
  //       } else {
  //         node.x += currentNode.x
  //         currentNode = currentNode.left
  //         this.setPeer(parent, node)
  //         compare = true
  //       }
  //     } else {
  //       const left = parent.left
  //       if (left && !isMin) {
  //         this.setMinEnd(parent, node)
  //         this.setMax(parent, node)
  //         currentNode = currentNode.left
  //         compare = false
  //       } else {
  //         node.x = currentNode.x + 1
  //         currentNode = currentNode.right
  //         // if (!isMin && parent) {
  //         parent.count++
  //         //}
  //         // if (isMin && !isMax) {
  //         // } else if (parent) {
  //         //   parent.count++;
  //         // }
  //         this.setMinEnd(parent, node)
  //         this.setMax(parent, node)

  //         compare = false
  //       }
  //     }
  //   }
  //   node.parent = parent
  //   if (compare) {
  //     parent.left = node
  //   } else {
  //     parent.right = node
  //   }
  // }

  // setPeer(currentNode, node) {
  //   currentNode.peerEnd = Math.max(currentNode.peerEnd, node.peerEnd)
  // }
  // setMinEnd(currentNode, node) {
  //   currentNode.minEnd = Math.min(currentNode.peerEnd, node.minEnd)
  // }
  // setMax(currentNode, node) {
  //   currentNode.maxEnd = Math.max(
  //     currentNode.peerEnd,
  //     currentNode.maxEnd,
  //     node.peerEnd,
  //   )
  // }

  add(data, traverseDF) {
    const node = new ItemNode(data)
    if (this.root === null) {
      this.root = node
      this.prevRoot = node
      this.itemNodeArray.push(this.root)
      return
    }
    const a = this.root.contains(node, true)
    const b = this.root.contains(node)
    if (a && b) {
      const temp = this.prevRoot
      if (this.root.children.length === 0 && this.root.level > 1) {
        if (this.prevRoot.contains(node, true)) {
          this.root.level += 1
          this.root = this.prevRoot
          this.prevRoot = temp
          traverseDF(this.root, node)
          this.prevRoot = this.root
          this.root = temp
        } else {
          this.root.level -= 1
          node.level = this.root.level
          traverseDF(this.root, node)
        }
      } else {
        traverseDF(this.root, node)
      }
    } else if (a && !b) {
      node.level = this.root.level
      this.prevRoot = this.root
      this.root = node
      this.itemNodeArray.push(this.root)
    } else {
      this.prevRoot = node
      this.root = node
      this.itemNodeArray.push(this.root)
    }
  }

  // getItemArray() {
  //   console.log(this.itemNodeArray)
  // }

  preorderTraversal(callback) {
    const list = []
    const traversal = (node, columnCount, width) => {
      // 写递归先考虑 终止条件
      if (node == null) return
      console.log('preorderTraversal', node)
      list.push(this.setupNodeWidth(node, columnCount, width))
      traversal(node.left, columnCount, width)
      traversal(node.right, columnCount, width)
    }
    this.itemNodeArray.forEach((root) => {
      traversal(root, root.count, this.width)
    })
    list.sort((a, b) => {
      return a.begin - b.begin
    })
    return list
  }
  setupNodeWidth(node, columnCount, width) {
    // debugger
    const { columnIndex } = this
    const left = columnIndex * width
    const timeInfo = node.data
    if (node.x <= 1) {
      timeInfo.left = left + width * (node.x / columnCount)
      timeInfo.width = width * ((node.w || 1) / columnCount)
      return timeInfo
    }
    timeInfo.left = left + width * (node.x / columnCount)
    timeInfo.width = width * (node.w / columnCount)

    return timeInfo
  }
  setupWidth() {
    this.itemNodeArray.forEach((node, i) => {
      setupNodeWidthFrom(
        node,
        this.columnIndex * this.width,
        this.width - 4,
        node.level,
      )
    })
  }

  // getList() {
  //   const list = this.preorderTraversal()
  //   console.log('getList', list)
  //   return list
  // }

  getList() {
    if (!this.root) {
      return
    }
    this.setupWidth()
    let list = []
    let arr = [...this.itemNodeArray]
    while (arr.length !== 0) {
      let p = arr.shift()
      list.push(p.data)
      arr.push(...p.children)
    }
    return list
  }
}

export function traverseDF(parentNode, node) {
  if (parentNode.children.length === 0) {
    if (parentNode.contains(node)) {
      parentNode.children.push(node)
      node.parent = parentNode
      parentNode.level += 1
      parentNode.maxEnd = Math.max(parentNode.maxEnd, node.data.end)

      let parent = parentNode.parent
      while (parent) {
        parent.level += 1
        parent.maxEnd = Math.max(parent.maxEnd, node.data.end)
        parent = parent.parent
      }
      return true
    }
    return false
  } else {
    let found = false
    for (let i = parentNode.children.length - 1; i >= 0; i--) {
      const child = parentNode.children[i]
      found = traverseDF(child, node)
      if (found) {
        parentNode.maxEnd = Math.max(child.maxEnd, parentNode.maxEnd)
        break
      }
    }
    if (!found) {
      if (parentNode.contains(node)) {
        parentNode.children.push(node)
        node.parent = parentNode
        //parentNode.level += 1
        parentNode.maxEnd = Math.max(parentNode.maxEnd, node.data.end)
        let parent = parentNode.parent
        while (parent) {
          //parent.level += 1
          parent.maxEnd = Math.max(parent.maxEnd, node.data.end)
          parent = parent.parent
        }
        return true
      }
    }
    return found
  }
}

export function setupNodeWidthFrom(node, left, maxWidth, level) {
  if (level < 1) {
    const timeInfo = node.data
    timeInfo.left = left
    timeInfo.width = maxWidth
    return
  }

  let space = 4
  let count = level
  //因包含子节点导致根节点的宽度为最小
  let minwidth = (maxWidth - (count - 1) * space) / count

  //设置根节点的frame
  const timeInfo = node.data
  timeInfo.left = left
  timeInfo.width = minwidth

  let childLeft = timeInfo.left + timeInfo.width + space
  let childMaxWidth = maxWidth - minwidth - space
  node.children.forEach((child) => {
    setupNodeWidthFrom(child, childLeft, childMaxWidth, child.level)
  })
}

export default MultiwayTree
