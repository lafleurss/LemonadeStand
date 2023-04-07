import fs from "fs"

const calculateLemonadePrice = (lemonade) => {
  let result = 0.75
  for (let key in lemonade) {
    switch (key) {
      case "lemonJuice":
        result += lemonade[key] * 0.3
        break
      case "water":
        result += lemonade[key] * 0.01
        break
      case "sugar":
        result += lemonade[key] * 0.2
        break
      case "iceCubes":
        result += lemonade[key] * 0.05
        break
      default:
        break
    }
  }
  return result
}

export const writeFileSync = (fileName, order) => {
  fs.writeFileSync(fileName, JSON.stringify(order))
}

export const readAllFiles = (dirName) => {
  const orders = []
  for (let name of fs.readdirSync(dirName)) {
    orders.push(JSON.parse(fs.readFileSync(dirName + "/" + name)))
  }
  return orders
}

export const buildQuestionArray = (val, i) => [
  {
    type: "number",
    name: `lemonJuice${i}`,
    message: `How much lemonJuice in your lemonade ${i + 1} ?`,
  },
  {
    type: "number",
    name: `water${i}`,
    message: `How much water in your lemonade ${i + 1} ?`,
  },
  {
    type: "number",
    name: `sugar${i}`,
    message: `How much sugar in your lemonade ${i + 1} ?`,
  },
  {
    type: "number",
    name: `iceCubes${i}`,
    message: `How many iceCubes in your lemonade ${i + 1} ?`,
  },
]

export const createLemonade = (response) => (curr, i) => ({
  lemonJuice: Number.parseInt(response["lemonJuice" + i]),
  water: Number.parseInt(response["water" + i]),
  sugar: Number.parseInt(response["sugar" + i]),
  iceCubes: Number.parseInt(response["iceCubes" + i]),
})

export const addLemonadeToOrder = (originalOrder, lemonade) => ({
  ...originalOrder,
  lemonades: [
    ...originalOrder.lemonades,
    { ...lemonade, price: calculateLemonadePrice(lemonade) }
  ]
})


const calculateOrderTotal = ({ lemonades }) => {
  let result = 0
  for (let lemonade of lemonades) {
    result += lemonade.price
  }
  return result
}

export const updateOrderTotal = order => ({
  ...order,
  total: calculateOrderTotal(order)
})


