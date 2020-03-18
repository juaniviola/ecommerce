const express = require('express')
const app = express()
const stripe = require('stripe')(process.env.SECRET)

const port = process.env.PORT || 3001

const products = require('./products')

const createSession = async (items) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/error',
  });

  return session
}

app.use(express.json())
app.use(require('cors')())

app.get('/products', (req, res) => {
  res.json(products)
})

app.post('/session', async (req, res) => {
  const { prods } = req.body

  try {
    const items = []
    items.push(prods)
    const session = await createSession(items)
    res.send({ id: session.id })
  } catch (err) { console.log(err) }
})

app.post('/data', async (req, res) => {
  const { session_id } = req.body
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    const pay = await stripe.paymentIntents.retrieve(session.payment_intent)

    const obj = []
    session.display_items.forEach((el, i) => {
      el.amount = pay.charges.data[i].amount
      el.payment_method_details = pay.charges.data[i].payment_method_details
      el.billing_details = pay.charges.data[i].billing_details
      el.payment_method_details = pay.charges.data[i].payment_method_details
      obj.push(el)
    })
    const compra = {
      session_id,
      paymentIntent:session.payment_intent,
      details: obj,
    }

    // TODO: save compra in db or data model

    res.send({ buy: 'exit' })
  } catch (err) { console.log(err) }
})

app.listen(port, () => console.log('running'))
