import styled from "styled-components";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import { mobile } from "../responsive";
import { format } from "date-fns";
import { userRequest } from "../requestMethods";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin-bottom: 30px;
`;

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  ${mobile({ flexDirection: "column", alignItems: "flex-start", gap: "10px" })}
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const OrderId = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const OrderDate = styled.span`
  color: #666;
  font-size: 14px;
`;

const OrderStatus = styled.div`
  padding: 5px 12px;
  font-size: 14px;
  border-radius: 20px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  width: fit-content;
  background-color: ${(props) =>
    props.status === "Delivered"
      ? "#4caf50"
      : props.status === "Delivering"
      ? "#ff9800"
      : "#9e9e9e"};
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  ${mobile({ flexDirection: "column", textAlign: "center" })}
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  background-color: #f0f0f0;
`;

const ProductImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
`;

const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProductName = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const ProductInfo = styled.span`
  color: #666;
  font-size: 14px;
`;

const ProductPrice = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #666;
`;

const EmptyTitle = styled.h2`
  font-weight: 300;
  margin-bottom: 10px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ShopButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: #555;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user?.currentUser);
  const token = user?.accessToken;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      try {
        // Fetch orders for current user
        const res = await userRequest.get(`orders/find/${user._id}`);

        const ordersWithDetails = await Promise.all(
          res.data.map(async (order) => {
            const productsWithDetails = await Promise.all(
              order.products.map(async (orderProduct) => {
                try {
                  const productRes = await userRequest.get(`products/find/${orderProduct.productId}`);
                  return {
                    ...productRes.data,
                    quantity: orderProduct.quantity || 1,
                    size: orderProduct.size || "N/A",
                    color: orderProduct.color || "N/A",
                  };
                } catch {
                  return {
                    _id: orderProduct.productId,
                    title: "Product Not Found",
                    img: null,
                    price: 0,
                    quantity: orderProduct.quantity || 1,
                    size: "N/A",
                    color: "N/A",
                  };
                }
              })
            );
            return { ...order, products: productsWithDetails };
          })
        );

        const sorted = ordersWithDetails.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      } catch (err) {
        setError("Failed to load orders. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);


  const handleShopNow = () => window.location.href = "/";
  const calculateProductPrice = (product) => (Number(product.price) || 0) * (Number(product.quantity) || 1);

  if (loading) {
    return (
      <Container>
        <Navbar />
        <Announcement />
        <Wrapper>
          <LoadingSpinner>Loading your orders...</LoadingSpinner>
        </Wrapper>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Navbar />
        <Announcement />
        <Wrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </Wrapper>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>MY ORDERS</Title>
        {orders.length === 0 ? (
          <EmptyState>
            <EmptyTitle>No Orders Found</EmptyTitle>
            <EmptyText>You haven't placed any orders yet.</EmptyText>
            <ShopButton onClick={handleShopNow}>START SHOPPING</ShopButton>
          </EmptyState>
        ) : (
          <OrdersContainer>
            {orders.map((order) => (
              <OrderCard key={order._id}>
                <OrderHeader>
                  <OrderInfo>
                    <OrderId>Order #{order._id.slice(-8).toUpperCase()}</OrderId>
                    <OrderDate>Placed on {format(new Date(order.createdAt), "PPP")}</OrderDate>
                    <OrderStatus status={order.status}>{order.status}</OrderStatus>
                  </OrderInfo>
                </OrderHeader>
                <ProductsList>
                  {order.products.map((product, index) => (
                    <ProductItem key={product._id || index}>
                      {product.img ? (
                        <ProductImage
                          src={product.img}
                          alt={product.title}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <ProductImagePlaceholder style={{ display: product.img ? "none" : "flex" }}>No Image</ProductImagePlaceholder>
                      <ProductDetails>
                        <ProductName>{product.title}</ProductName>
                        <ProductInfo>Size: {product.size} | Quantity: {product.quantity}</ProductInfo>
                        <ProductInfo>Color: {product.color}</ProductInfo>
                        <ProductPrice>₹{calculateProductPrice(product)}</ProductPrice>
                      </ProductDetails>
                    </ProductItem>
                  ))}
                </ProductsList>
              </OrderCard>
            ))}
          </OrdersContainer>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Orders;
