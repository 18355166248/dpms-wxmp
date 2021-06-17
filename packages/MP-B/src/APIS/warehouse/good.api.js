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
   * @param {Number} params.merchandiseIds           // 物品id
   * @returns
   */
  getGoodsDetail(params) {
    return httper.get('physical/merchandise/list/by-merchandise-ids', params)
  },
}

export default goodAPI
