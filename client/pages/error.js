import { Navbar, Container, Card, Row, Button, Alert } from 'react-bootstrap'

export default function Error () {
  return (
    <div>
      <Navbar bg="dark" style={{ 'marginBottom': '20px' }}>
        <Navbar.Brand style={{ color: 'white' }}>Tienda</Navbar.Brand>
      </Navbar>
      <Container>
        <Alert variant="warning">
          No se ha podido completar la compra
          <hr />
          <div className="d-flex justify-content-end">
            <Card.Link href="/">Volver</Card.Link>
          </div>
        </Alert>
      </Container>
    </div>
  )
}