export default function getFakeData() {
  return [
    { y: 24601.687971882868, x: '2021-06-06T14:45:17.638Z' },
    { y: 26000.50757392337, x: '2021-06-07T14:45:17.638Z' },
    { y: 24641.912218323152, x: '2021-06-08T14:45:17.638Z' },
    { y: 25879.723533236356, x: '2021-06-09T14:45:17.638Z' },
    { y: 24376.052305772304, x: '2021-06-10T14:45:17.638Z' },
    { y: 22336.721610253335, x: '2021-06-11T14:45:17.638Z' },
    { y: 24557.275157137487, x: '2021-06-12T14:45:17.638Z' },
    { y: 26535.611730720782, x: '2021-06-13T14:45:17.638Z' },
    { y: 26218.430339881495, x: '2021-06-14T14:45:17.638Z' },
    { y: 24051.762280007675, x: '2021-06-15T14:45:17.638Z' },
    { y: 23376.23986846941, x: '2021-06-16T14:45:17.638Z' },
    { y: 23433.35606966247, x: '2021-06-17T14:45:17.638Z' },
    { y: 25548.11830041562, x: '2021-06-18T14:45:17.638Z' },
    { y: 27911.606639621517, x: '2021-06-19T14:45:17.638Z' },
    { y: 29877.799123622586, x: '2021-06-20T14:45:17.638Z' },
    { y: 28332.06459172096, x: '2021-06-21T14:45:17.638Z' },
    { y: 29856.818102727862, x: '2021-06-22T14:45:17.638Z' },
    { y: 31852.303235974818, x: '2021-06-23T14:45:17.638Z' },
    { y: 31968.91194790786, x: '2021-06-24T14:45:17.638Z' },
    { y: 38233.61054422469, x: '2021-06-25T14:45:17.638Z' }
  ]
}

function generateFakeData() {
  function getNextPrice(old_price) {
    let volatility = 0.1
    let rnd = Math.random()
    let change_percent = 2 * volatility * rnd
    if (change_percent > volatility) change_percent -= 2 * volatility
    let change_amount = old_price * change_percent
    return old_price + change_amount
  }

  let price = 25000

  const data = Array.apply(null, new Array(20)).map((item, index) => {
    const today = new Date()
    price = getNextPrice(price)
    return {
      y: price,
      x: new Date(today.setDate(today.getDate() + index))
    }
  })

  return data
}
