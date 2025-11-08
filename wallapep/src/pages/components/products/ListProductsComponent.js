import { useState, useEffect } from "react";
import Link from 'next/link';
import { Typography, Row, Col, Card } from 'antd';
import ProductFiltersComponent from './ProductFiltersComponent';

const { Title, Paragraph } = Typography;

let ListProductsComponent = () => {
  let [products, setProducts] = useState([]);
  let [filteredProducts, setFilteredProducts] = useState([]);
  let [filters, setFilters] = useState({
    category: 'todos',
    title: '',
    minPrice: null,
    maxPrice: null
  });

  useEffect(() => {
    loadProducts();
  }, []);

  let checkURL = async (url) => {
    try {
      let response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  let loadProducts = async () => {
    let response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/products",
      {
        method: "GET",
        headers: {
          apikey: localStorage.getItem("apiKey"),
        },
      }
    );

    if (response.ok) {
      let jsonData = await response.json();

      let promisesForImages = jsonData.map(async (p) => {
        let urlImage = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/images/" + p.id + ".png";
        let existsImage = await checkURL(urlImage);
        if (existsImage) {
          p.image = urlImage;
        } else {
          p.image = "/imageMockup.png";
        }
        return p;
      });

      let productsWithImage = await Promise.all(promisesForImages);
      setProducts(productsWithImage);
      setFilteredProducts(productsWithImage);
    } else {
      let responseBody = await response.json();
      let serverErrors = responseBody.errors;
      serverErrors.forEach((e) => {
        console.log("Error: " + e.msg);
      });
    }
  };

  return (
    <div>
      <Title level={2}>Products</Title>
      
      <ProductFiltersComponent 
        products={products}
        filters={filters} 
        setFilters={setFilters}
        setFilteredProducts={setFilteredProducts}
      />

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Paragraph>No products found with the selected filters.</Paragraph>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((p) => (
            <Col span={8} key={p.id}>
              <Link href={`detailProduct/${p.id}`}>
                <Card title={p.title} cover={<img src={p.image} alt={p.title} />}>
                  <Title level={4} style={{ margin: 0, color: '#1890ff', fontWeight: 'bold' }}>
                    € {p.price}
                  </Title>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ListProductsComponent;