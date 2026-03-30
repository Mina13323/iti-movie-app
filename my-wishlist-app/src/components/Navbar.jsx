import { Container, Navbar, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = ({ count }) => (
  <Navbar bg="black" variant="dark" className="mb-4 shadow-sm sticky-top">
    <Container>
      <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
        MovieTime 🎥
      </Navbar.Brand>
      
      <Link to="/wishlist" className="text-decoration-none">
        <div className="d-flex align-items-center bg-dark px-3 py-1 rounded-pill border border-secondary">
          <span className="me-2">❤️</span>
          <Badge pill bg="danger">{count}</Badge>
        </div>
      </Link>
    </Container>
  </Navbar>
);

export default AppNavbar;