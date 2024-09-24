import React, { useState } from 'react';
import { Stack, Form, Button, Container, Card } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function AddProduct() {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null); // For handling errors
  const [success, setSuccess] = useState(null); // For success messages
  const navigate = useNavigate();

  const handleApi = async () => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    const url = 'http://localhost:5000/add-product';

    try {
      const res = await axios.post(url, formData);
      console.log(res);
      setSuccess('Product added successfully!');
      setError(null); // Clear any previous errors
      // Redirect to the home page or another page after a successful API call
      setTimeout(() => {
        navigate('/');
      }, 2000); // Redirect after 2 seconds for user feedback
    } catch (err) {
      console.error(err);
      setError('Error adding product. Please try again.');
      setSuccess(null); // Clear success message if there's an error
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleApi();
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Add New Product</Card.Title>
          {error && <p className="text-danger">{error}</p>} {/* Show error messages */}
          {success && <p className="text-success">{success}</p>} {/* Show success messages */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0" // Ensure price is not negative
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddProduct;
