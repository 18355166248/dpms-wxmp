class ItemNode {
  constructor(element, parent) {
    this.data = element
    this.parent = parent
    this.begin = element.begin
    this.peerEnd = element.end
    this.minEnd = element.end
    this.maxEnd = element.end // element.end
    this.x = 0
    this.w = 1
    this.wdith = 0
    this.count = 1
    this.level = 1
    this.left = null
    this.right = null
    this.type = 0
    this.children = []
  }
  contains(parentNode, useMaxEndTime = false) {
    let tempEndTime = useMaxEndTime ? this.maxEnd : this.data.end
    let value =
      parentNode.data.begin >= this.data.begin &&
      parentNode.data.begin < tempEndTime
    return value
  }
}

export default ItemNode
