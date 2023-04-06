import Vorpal from "vorpal"
import {
  calculateLemonadePrice,
  calculateOrderTotal,
  writeFileSync,
  readAllFiles,
} from "./lib"

const vorpal = Vorpal()

vorpal
  .command("hello <name>", "Prints hello to console")
  .option("-f --file", "Provide a filename")
  .action(function (args, callback) {
    if (args.options.file) {
      this.log("I see you want to make a file")
    }
    this.log(`Hello ${args.name}.`)
    callback()
  })

vorpal
  .command(
    "createOrder <name> <phoneNumber",
    "Creates an order and saves to JSON file"
  )
  .action(function (args, callback) {
    const order = {
      total: 0,
      lemonades: [],
      customer: {
        name: args.name,
        phoneNumber: args.phoneNumber,
      },
      lemonadeStand: {
        name: "My Lemonade Stand",
      },
    }

    this.prompt(
      {
        type: "number",
        name: "numLemonades",
        default: 1,
        message: "How many lemonades would you like to order?",
      },
      ({ numLemonades }) => {
        let lemonade = {}
        let questions = []
        for (let i = 1; i <= Number.parseInt(numLemonades); i++) {
          questions.push({
            type: "number",
            name: "lemonJuice" + i,
            default: 1,
            message: `How much lemonJuice in your lemonade ${i} ?`,
          })

          questions.push({
            type: "number",
            name: "water" + i,
            default: 1,
            message: `How much water in your lemonade ${i} ?`,
          })

          questions.push({
            type: "number",
            name: "sugar" + i,
            default: 1,
            message: `How much sugar in your lemonade ${i} ?`,
          })

          questions.push({
            type: "number",
            name: "iceCubes" + i,
            default: 1,
            message: `How many iceCubes in your lemonade ${i} ?`,
          })
        }

        this.prompt(questions, (response) => {
          //Create a lemonade obj for each lemonade in the order
          for (let i = 1; i <= numLemonades; i++) {
            order.lemonades.push({
              lemonJuice: Number.parseInt(response["lemonJuice" + i]),
              water: Number.parseInt(response["water" + i]),
              sugar: Number.parseInt(response["sugar" + i]),
              iceCubes: Number.parseInt(response["iceCubes" + i]),
            })
          }

          //Set price of each lemonade in the order
          for (let lemonade of order.lemonades) {
            lemonade.price = calculateLemonadePrice(lemonade)
            lemonade.price = Number(lemonade.price.toFixed(2))
          }

          order.total = calculateOrderTotal(order)
          order.total = Number(order.total.toFixed(2))

          this.log(order)
          writeFileSync(
            order.lemonadeStand.name + "/" + order.customer.name + ".json",
            order
          )
          callback()
        })
      }
    )
  })

vorpal
  .command(
    "getOrders <lemonadeStand>",
    "Get all orders from the lemonade stand"
  )
  .action(function ({ lemonadeStand }, callback) {
    const orders = readAllFiles(lemonadeStand)
    this.log(`There are ${orders.length} orders at ${lemonadeStand}`)
    for (let order of orders) {
      this.log(`Order 1:`)
      this.log(`Total Price: ${order.total}`)
      this.log(`Lemonades: `)
      this.log(order.lemonades)
      this.log(`Customer: `)
      this.log(order.customer)
    }
    callback()
  })

vorpal.delimiter("lemonade-stand$").show()
