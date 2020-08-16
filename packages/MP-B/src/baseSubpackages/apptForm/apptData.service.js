import moment from 'moment'
import _ from 'lodash'
import appointmentAPI from 'APIS/appointment/appointment.api'

const apptDataService = {
  /**
   * 预约校验
   * @param formatValue {object} 验证数据
   * @param onOkCb {func} // 弹窗点击确定后 如果没有后续弹窗的回调
   * @param onCancelOk {func} // 弹窗点击取消后的回调
   */
  getApptVerify(formatValue, onOkCb, onCancelOk, finallyCb) {
    appointmentAPI
      .getAppointmentVerify({ appointmentJsonStr: JSON.stringify(formatValue) })
      .then((res) => {
        // existInCurrentDate true 提示3 患者张xx在2020-02-13已有预约，请确认是否继续？
        // appointmentVerifyStaffResult 数组下的 allowAppoint false 提示1 预约时间不在xxx,xxx可约时间内，确定要保存么？
        // modifyAppointmentTime true 提示2 您确认要修改预约吗？
        // appointmentBlockVerifyList 中存在数据时表示有 block 事件，此时不可预约
        const {
          existInCurrentDate,
          appointmentVerifyStaffResult,
          modifyAppointmentTime,
          appointmentBlockVerifyList,
        } = res.data

        if (!!appointmentBlockVerifyList.length) {
          const businessNameSplit = appointmentBlockVerifyList
            .map((item) => item.businessName)
            .join('，')

          return uni.showModal({
            title: `预约时段内 ${businessNameSplit} 有Block事件，预约失败，请通知患者更改预约时间`,
            showCancel: false,
            success: ({ confirm, cancel }) => {
              _.isFunction(onCancelOk) && cancel && onCancelOk()
            },
          })
        }

        const staffResult = appointmentVerifyStaffResult
          .filter((result) => result.allowAppoint === false)
          .map((staff) => staff.staffName)

        if (existInCurrentDate) {
          uni.showModal({
            title:
              '患者 ' +
              formatValue.patient.patientName +
              ' 在' +
              moment(formatValue.appointmentBeginTimeStamp).format(
                'YYYY-MM-DD',
              ) +
              '已有预约，请确认是否继续？',
            success: ({ confirm, cancel }) => {
              if (cancel) {
                _.isFunction(onCancelOk) && onCancelOk()
                return
              }
              if (confirm) {
                if (staffResult.length > 0) {
                  uni.showModal({
                    title:
                      '预约时间不在' +
                      staffResult.join(',') +
                      '可约时间内，确定要保存么？',
                    success: ({ confirm, cancel }) => {
                      if (confirm) _.isFunction(onOkCb) && onOkCb()

                      if (cancel) _.isFunction(onCancelOk) && onCancelOk()
                    },
                  })

                  return
                }

                _.isFunction(onOkCb) && onOkCb()
              }
            },
          })

          return
        }

        // 如果existInCurrentDate为false 要判断提示1
        if (staffResult.length > 0) {
          uni.showModal({
            title:
              '预约时间不在' +
              staffResult.join(',') +
              '可约时间内，确定要保存么？',
            success: ({ confirm, cancel }) => {
              if (confirm) _.isFunction(onOkCb) && onOkCb()

              if (cancel) _.isFunction(onCancelOk) && onCancelOk()
            },
          })

          return
        }

        // 当提示2、提示3同时存在 提示：“预约提示3”
        // 这里表示没有提示3 所以判断是否显示提示2
        if (modifyAppointmentTime) {
          uni.showModal({
            title: '您确认要修改预约吗？',
            success: ({ confirm, cancel }) => {
              if (confirm) _.isFunction(onOkCb) && onOkCb()

              if (cancel) _.isFunction(onCancelOk) && onCancelOk()
            },
          })

          return
        }

        _.isFunction(onOkCb) && onOkCb()
      })
      .finally(() => {
        _.isFunction(finallyCb) && finallyCb()
      })
      .catch()
  },
}

export { apptDataService }
