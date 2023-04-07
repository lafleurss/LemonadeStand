import Vorpal from "vorpal"
import {
  buildQuestionArray,
  createLemonade,
  addLemonadeToOrder,
  updateOrderTotal,
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


    this.prompt(
      {
        type: "number",
        name: "numLemonades",
        default: 1,
        message: "How many lemonades would you like to order?",
      },
      ({ numLemonades }) => {
        const questions = [...Array(Number.parseInt(numLemonades))].flatMap(
          buildQuestionArray
        )

        // const questions = []
        // for (let i = 1; i <= Number.parseInt(numLemonades); i++) {
        //   questions = buildQuestionArray(questions, i)
        // }

        this.prompt(questions, (response) => {
          // for (let i = 1; i <= numLemonades; i++) {
          //   order = updateOrderTotal(
          //     addLemonadeToOrder(order, createLemonade(response, i))
          //   )
          // }

          const order = updateOrderTotal(
            [...Array(Number.parseInt(numLemonades))]
              .map(createLemonade(response))
              .reduce(addLemonadeToOrder,  {
                total: 0,
                lemonades: [],
                customer: {
                  name: args.name,
                  phoneNumber: args.phoneNumber,
                },
                lemonadeStand: {
                  name: "My Lemonade Stand",
                }
              })
          )

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
