import httper from '../http'

const goodAPI = {
  /**
   * @description 获取物品分类列表
   * @param {*} params
   * @returns
   */
  getCategoryList(params) {
    return httper.get('physical/settings-merchandise/category/list', params)
  },

  /**
   * @description 查询物品
   * @param {Number} params.merchandiseCategoryId     物品分类主键id
   * @param {Number} params.current                   页码
   * @param {Number} params.size                      条数
   * @returns
   */
  getGoodsList(params) {
    return httper.get('physical/merchandise/page', params)
  },

  /**
   * @description 获取物品详情
   * @param {Number} params.merchandiseId            // 物品id
   * @returns
   */
  getGoodsDetail(params) {
    return httper.get('physical/merchandise/detail', params)
  },

  /**
   * @description 获取入库记录
   * @param {Number} params.merchandiseId                 物品id
   * @returns
   */
  getGoodInputRecord(params) {
    return httper.get('physical/inventory/input/record', params)
  },
  /**
   * @description 获取出库记录
   * @param {Number} params.merchandiseId                 物品id
   * @returns
   */
  getGoodOutputRecord(params) {
    return httper.get('physical/inventory/output/record', params)
  },
  /**
   * @description 获取盘点记录
   * @param {Number} params.merchandiseId                 物品id
   * @returns
   */
  getGoodCheckRecord(params) {
    return httper.get('physical/inventory/check/record', params)
  },
  /**
   * @description 获取损益记录
   * @param {Number} params.merchandiseId                 物品id
   * @returns
   */
  getIncreaseDecreaseRecord(params) {
    return httper.get(
      'physical/inventory/increase-decrease/inventory-page',
      params,
    )
  },
}

export default goodAPI
