import React from 'react'
import ReactDOM from 'react-dom'
import { useRouter } from 'next/link'
import { Navbar, Container, Card, Row, Button, Alert } from 'react-bootstrap'

export default class Success extends React.Component {
  static getInitialProps ({ query: { session_id } }) {
    return { session_id }
  }

  constructor () {
    super()
  }

  async componentDidMount () {
    const h = await fetch('http://localhost:3001/data', {
      method: 'POST',
      body: JSON.stringify({ session_id: this.props.session_id }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const a = await h.json()
    console.log(a)
  }

  render () {
    return (
      <div>
        <Navbar bg="dark" style={{ 'marginBottom': '20px' }}>
          <Navbar.Brand style={{ color: 'white' }}>Tienda</Navbar.Brand>
        </Navbar>
        <Container>
          <Alert variant="success">
            Producto exitosamente comprado!
            <hr />
            <div className="d-flex justify-content-end">
              <Card.Link href="/">Volver</Card.Link>
            </div>
          </Alert>
        </Container>
      </div>
    )
  }
}
