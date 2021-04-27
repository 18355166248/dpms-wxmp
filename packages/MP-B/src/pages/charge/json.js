// {
//   paymentAmount:0,
//   transactionChannelId:1,
//   transactionChannelName:1,
// }
// payChannelList

export const mockPayTypes = {
  "_st": 1619504501195,
  "code": 0,
  "data": [
    {
      "canPayZero": true,
      "enabled": true,
      "isShare": true,
      "payStyle": 11,
      "refundBackSameWay": false,
      "settingsPayTransactionChannelId": 41,
      "settingsPayTransactionChannelName": "支付宝",
      "settingsPayTransactionChannelPrepaidFee": true,
      "settingsPayTransactionChannelSpendingBills": true,
      "settingsPayTransactionChannelType": 1,
      "sort": 1.0,
      "systemInner": 2
    },
    {
      "canPayZero": true,
      "enabled": true,
      "isShare": true,
      "payStyle": 11,
      "refundBackSameWay": false,
      "settingsPayTransactionChannelId": 592,
      "settingsPayTransactionChannelName": "现金",
      "settingsPayTransactionChannelType": 1,
      "sort": 3.0,
      "systemInner": 1
    },
    {
      "canPayZero": true,
      "enabled": true,
      "isShare": true,
      "payStyle": 8,
      "refundBackSameWay": true,
      "settingsPayTransactionChannelId": 242,
      "settingsPayTransactionChannelName": "储值卡本金",
      "settingsPayTransactionChannelType": 2,
      "sort": 4.0,
      "systemInner": 1,
      "balance": 600.00,
      "cardNo": "1682021042601",
      "memberId": 83299,
      "customerId": 1235360
    },
    {
      "canPayZero": true,
      "enabled": true,
      "isShare": true,
      "payStyle": 9,
      "refundBackSameWay": true,
      "settingsPayTransactionChannelId": 243,
      "settingsPayTransactionChannelName": "储值卡馈赠金",
      "settingsPayTransactionChannelType": 3,
      "sort": 5.0,
      "systemInner": 1,
      "balance": 31.00,
      "cardNo": "1682021042601",
      "memberId": 83299,
      "customerId": 1235360
    }
  ],
  "lang": "zh_CN"
}

export const mockItems = [
  {
    pageSerialNo: 1,
    salesList:[],
    deductSign:false,
    allBillDiscount: false,
    singleDiscountLimit: 60,
    itemCode:"8098073524959",
    itemName:'测试收费04',
    itemNum: 1,
    itemType: 5,
    parentItemCode: 0,
    singleDiscount: 100,
    totalAmount: 50,
    singleDiscountAfterAmount: 50,
    receivableAmount:50,
    unitAmount: 50,
  },
  {
    pageSerialNo: 2,
    salesList:[],
    deductSign:false,
    allBillDiscount: false,
    singleDiscountLimit: 60,
    itemCode:"2",
    itemName:'拔牙1',
    itemNum: 1,
    itemType: 5,
    parentItemCode: 0,
    singleDiscount: 100,
    totalAmount: 1235,
    singleDiscountAfterAmount: 1235,
    receivableAmount:1235,
    unitAmount: 1235,
  },
  {
    pageSerialNo: 3,
    salesList: [],
    deductSign: false,
    allBillDiscount: false,
    isSingleDiscount: false,
    singleDiscountLimit: 0,
    itemCode: "8109441103329",
    itemName: "火龙果",
    itemNum: 1,
    itemType: 5,
    parentItemCode: 0,
    singleDiscount: 100,
    totalAmount: 50,
    singleDiscountAfterAmount: 50,
    receivableAmount: 50,
    unitAmount: 50,
    unit: "个",
  }
]



