import _ from 'lodash'
import { scheduleTableConfig } from './dayTable.config.js'

const noContainKeys = ['id', 'time']

const scheduleTableUtil = {
  // 说明:
  // dataIndex表示data下的索引
  // colIndex表示apptList下的索引

  getUnitAndOffset(dataList, rowDispatcher) {
    const data = _.cloneDeep(dataList)
    const arrAreaList = {}

    data.forEach((dataItem, dataIndex) => {
      Object.keys(dataItem).forEach((dataItemKey) => {
        if (!noContainKeys.includes(dataItemKey)) {
          // 表示每一列的单元格
          const colList = dataItem[dataItemKey].list

          // 表示哪一列, 按列进行分组
          if (!Array.isArray(arrAreaList[dataItemKey])) {
            arrAreaList[dataItemKey] = []
          }

          const areaList = arrAreaList[dataItemKey]

          colList.forEach((col, colIndex) => {
            // 每一列中的每一个预约 生成最大值, 最小值区间
            let area = {}

            const { startTimeStamp, endTimeStamp } = rowDispatcher ? rowDispatcher(col) : col

            area = {
              min: startTimeStamp,
              max: endTimeStamp,
              ...col,
              dataIndex,
              colIndex,
              parentKey: dataItemKey,
            }

            // 将有相交区域的预约放在一个数组中,就会生成多个不想交的分组区域
            const index = areaList.findIndex(
              (areaItem) =>
                areaItem.findIndex((areaChildItem) => area.min <= areaChildItem.max) > -1,
            )

            if (index > -1) {
              if (areaList[areaList.length - 1]) {
                areaList[areaList.length - 1].push(area)
              } else {
                areaList[areaList.length - 1] = [area]
              }
            } else {
              areaList.push([area])
            }
          })

          arrAreaList[dataItemKey] = areaList
        }
      })
    })

    Object.keys(arrAreaList).forEach((arrAreaKey) => {
      const arrArea = arrAreaList[arrAreaKey]

      arrArea.forEach((area) => {
        // 按列进行分组
        const rowSortList = []
        // 生成当前组每列存在的最大值
        let rowMaxArr = []

        area.forEach((areaItem) => {
          if (rowSortList[areaItem.dataIndex]) {
            rowSortList[areaItem.dataIndex].push(areaItem)
          } else {
            rowSortList[areaItem.dataIndex] = [areaItem]
          }
        })

        // 将rowSortList中的每组进行降序排列
        rowSortList.forEach((rowSort) => {
          rowSort.sort((a, b) => a.min - b.min)
        })

        rowSortList.forEach((rowSort) => {
          rowSort.forEach((rowSortItem, rowSortIndex) => {
            const { max, min } = rowSortItem

            // 判断当前列的数据在缓存rowMaxArr对应的数据中 哪个比较大, 大的话覆盖 并且更新rowMaxArr
            // 小的话切换到下一列并判断大小
            // 如果缓存区的值小于当前盒子的最小值, 那么证明没有交集
            const isArea = (rowMaxArr[rowSortIndex] || 0) < min

            if (isArea) {
              // 没有交集 更新缓存区值
              rowMaxArr[rowSortIndex] = max
              // offset为当前降序后的索引位置
              rowSortItem.$config = {
                offset: rowSortIndex,
              }
            } else {
              // 存在交集 需要去下一列去判断 (递归判断)
              getRowInfo(rowMaxArr, rowSortItem, rowSortIndex + 1)
            }
          })
        })

        // 更新unit (unit的值就是rowMaxArr长度)
        const unit = rowMaxArr.length

        area.forEach((areaItem) => {
          areaItem.$config.unit = unit
        })
      })
    })

    Object.keys(arrAreaList).forEach((arrAreaKey) => {
      // 这一层表示的是每列的数据
      const arrArea = arrAreaList[arrAreaKey]

      arrArea.forEach((area) => {
        // 这一层表示的分组, 各组之间没有交集
        area.forEach((areaItem) => {
          // 这一层表示每一个盒子
          // 在这里给data赋值unit, offset
          const { dataIndex, colIndex, parentKey, $config } = areaItem

          const itemStyle = scheduleTableUtil.calcStyle($config)

          // const record = data[dataIndex];
          // const item = record[parentKey].list[colIndex];
          // const timestampMap = rowDispatcher ? rowDispatcher(item) : item;

          // const itemPosition = scheduleTableUtil.calcCardPosition({
          //   rowStart: record.time.startMTime.valueOf(),
          //   rowEnd: record.time.endMTime.valueOf(),
          //   cardVerticalStart: timestampMap.startTimeStamp,
          //   cardVerticalEnd: timestampMap.endTimeStamp,
          //   cellInnerHeight: scheduleTableConfig.cellInnerHeight,
          //   colUnit: $config.unit,
          //   colOffset: $config.offset,
          // });

          data[dataIndex][parentKey].list[colIndex].$config = {
            style: itemStyle,
            ...$config,
          }
        })
      })
    })

    return data

    /**
     *
     * @param {*} rowMaxArr 缓存区
     * @param {*} rowSortItem 当前盒子
     * @param {*} colPosition 预估盒子要添加的列, 有交集的话就要去下一列递归判断
     */
    function getRowInfo(rowMaxArr, rowSortItem, colPosition) {
      const { max, min } = rowSortItem

      if ((rowMaxArr[colPosition] || 0) < min) {
        rowMaxArr[colPosition] = max
        rowSortItem.$config = {
          offset: colPosition,
        }
      } else {
        getRowInfo(rowMaxArr, rowSortItem, colPosition + 1)
      }
    }
  },

  // 计算style样式
  calcStyle($config) {
    const pl = 2
    const padding = ($config.unit - 1) * pl + 'px'
    const width = `calc((100% - 50px - ${padding}) / ${$config.unit})`

    return `width: ${width};left: calc(50px + ((100% - 50px - ${padding}) / ${$config.unit} + ${pl}px) * ${$config.offset})`
  },

  /**
   * @param {object} config
   * @param {number} config.rowStart
   * @param {number} config.rowEnd
   * @param {number} config.cardVerticalStart
   * @param {number} config.cardVerticalEnd
   * @param {number} config.cellInnerHeight
   * @param {number=} config.colUnit
   * @param {number=} config.colOffset
   * @param {number=} config.horizontalPadding
   * @param {number=} config.splitLineWidth
   * @param {number=} config.verticalPadding
   *
   * @return {{top: *, left: *, width: *, height: *, rangeNumber: *}}
   */
  calcCardPosition(config) {
    const {
      rowStart,
      rowEnd,
      cardVerticalStart,
      cardVerticalEnd,
      cellInnerHeight,
      colUnit = 1,
      colOffset = 0,
      horizontalPadding = 8,
      splitLineWidth = 1,
      verticalPadding = 0,
    } = config

    const relativeCardVerticalStart = getTimestampByToday(cardVerticalStart)
    const baseOffset =
      rowStart === relativeCardVerticalStart ? 0 : cardVerticalStart - relativeCardVerticalStart
    const relativeCardVerticalEnd = cardVerticalEnd - baseOffset
    const relativeRowStart = getTimestampByToday(rowStart)
    const relativeRowEnd = getTimestampByToday(rowEnd)

    const unitDuration = relativeRowEnd - relativeRowStart + 1

    const top = Math.max(
      verticalPadding,
      Math.floor(((relativeCardVerticalStart - relativeRowStart) / unitDuration) * cellInnerHeight),
    )

    const unitNumber = Math.max(
      -1,
      Math.floor((relativeCardVerticalEnd - relativeRowEnd - 1000) / unitDuration),
    )

    let bottom

    if (relativeCardVerticalEnd - relativeRowEnd <= 0) {
      bottom = Math.min(
        cellInnerHeight - verticalPadding,
        Math.floor(((relativeCardVerticalEnd + 1000) / unitDuration) * cellInnerHeight),
      )
    } else {
      const remainder = (relativeCardVerticalEnd - relativeRowEnd) % unitDuration
      const heightPercent = remainder === 0 ? 1 : remainder / unitDuration

      bottom = Math.min(
        cellInnerHeight - verticalPadding,
        Math.floor(heightPercent * cellInnerHeight),
      )
    }

    const height = (unitNumber + 1) * (cellInnerHeight + splitLineWidth) - top + bottom

    const left = `calc(${(100 * colOffset) / colUnit}% + ${
      horizontalPadding - (colOffset * horizontalPadding) / colUnit
    }px)`
    const width = `calc(${100 / colUnit}% - ${horizontalPadding + horizontalPadding / colUnit}px)`

    return {
      top,
      left,
      width,
      height,
      rangeNumber: unitNumber + 2,
    }

    function getTimestampByToday(timestamp) {
      const aDayMS = 24 * 60 * 60 * 1000

      return timestamp % aDayMS
    }
  },
}

export { scheduleTableUtil }
