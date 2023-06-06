import httper from '../http'

const roleAPI = {
  // 获取今日工作的角色列表
  getCurrentStaff(data) {
    return httper.get('institution/role/list/current-staff', data)
  },
}

export default roleAPI
