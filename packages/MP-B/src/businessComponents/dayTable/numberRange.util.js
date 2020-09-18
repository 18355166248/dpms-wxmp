const numberRangeUtil = {
  comparePosition(source, target) {
    const [aStart, aEnd] = source.sort((a, b) => a - b)

    const [bStart, bEnd] = target.sort((a, b) => a - b)

    if (aEnd < bStart) {
      return 'ahead' // source ahead target
    }

    if (aStart < bStart && aEnd >= bStart && aEnd <= bEnd) {
      return 'overAhead'
    }

    if (aStart < bStart && aEnd > bEnd) {
      return 'over'
    }

    if (aStart === bStart && aEnd === bEnd) {
      return 'equal'
    } else if (aStart >= bStart && aEnd <= bEnd) {
      return 'in'
    }

    if (aStart >= bStart && aStart <= bEnd && aEnd > bEnd) {
      return 'overBelow'
    }

    if (aStart > bEnd) {
      return 'below'
    }
  },

  isOver(source, target) {
    const res = numberRangeUtil.comparePosition(source, target)

    return ['overAhead', 'over', 'equal', 'in', 'overBelow'].includes(res)
  },
}

export { numberRangeUtil }
