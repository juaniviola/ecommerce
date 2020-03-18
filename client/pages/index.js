import React from 'react'
import ReactDOM from 'react-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Navbar, Container, Card, Row, Button, Alert } from 'react-bootstrap'

export default class MyApp extends React.Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  state = {
    stripe: null,
    items: []
  }

  async componentDidMount () {
    try {
      const prod = await fetch('http://localhost:3001/products')
      const items = await prod.json()
      this.setState({ items })

      const st = await loadStripe('public_key')
      this.setState({ stripe: st })
    } catch (err) { console.log(err) }
  }

  async handleClick (indice) {
    try {
      const session = await fetch('http://localhost:3001/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prods: this.state.items[indice]
        })
      })
      const sessionId = await session.json()

      const {error} = await this.state.stripe.redirectToCheckout({
        sessionId: sessionId.id
      })
    } catch (err) { console.log(err) }
  }

  render() {
    let prods
    if (this.state.items.length === 0 || !this.state.items.length) {
      prods = <Alert variant="danger" style={{ width: '100%' }}>No hay productos para mostrar</Alert>
    } else {
      prods = this.state.items.map((el, i) =>
        <Card key={i.toString()} style={{ width: '18rem', 'marginRight': '20px' }}>
          <Card.Img variant="top" src={el.images[0]} style={{ width: '100px', heigth: '180px', marginRight: 'auto', marginLeft: 'auto' }} />
          <Card.Body>
            <Card.Title>{el.name}</Card.Title>
            <Card.Text>{el.description}</Card.Text>
            <Button variant="primary" onClick={() => this.handleClick(i)}>Buy for ${el.amount/100}</Button>
          </Card.Body>
        </Card>
      )
    }

    return (
      <div>
        <Navbar bg="dark" style={{ 'marginBottom': '20px' }}>
          <Navbar.Brand style={{ color: 'white' }}>Tienda</Navbar.Brand>
        </Navbar>

        <Container>
          <Row>
            {prods}
          </Row>
        </Container>
      </div>
    )
  }
}
