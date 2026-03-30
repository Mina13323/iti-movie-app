import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import useWishlist from '../hooks/useWishlist'; 
import AppNavbar from '../components/Navbar';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: 'white' }}>
      <AppNavbar count={wishlistItems ? wishlistItems.length : 0} />
      
      <Container className="py-5">
        <h2 className="fw-bold mb-4" style={{ fontSize: '2rem', textAlign: 'left' }}>My List</h2>
        
        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-secondary fs-4">Your list is empty. Start adding movies!</p>
          </div>
        ) : (
          <Row xs={2} md={3} lg={4} xl={5} className="g-4">
            {wishlistItems.map((movie) => (
              <Col key={movie.id}>
                <Card className="h-100 border-0 bg-transparent movie-card-hover">
                  <div className="position-relative overflow-hidden rounded shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      className="img-fluid transition-transform"
                    />
                    <div className="card-overlay d-flex flex-column justify-content-end p-2">
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="w-100 fw-bold border-0"
                        style={{ backgroundColor: '#e50914' }}
                        onClick={() => removeFromWishlist(movie.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Card.Body className="px-0 py-2 text-start">
                    <Card.Title className="fs-6 text-truncate mb-0" style={{ color: '#fff' }}>
                      {movie.title}
                    </Card.Title>
                    <small className="text-secondary">
                      {movie.release_date ? movie.release_date.split('-')[0] : ''}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default WishlistPage;