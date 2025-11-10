import { useState, useEffect, useCallback } from "react";
import { Alert, Button, message, Tag, Card, Space, Typography, Image, Popconfirm, Col, Row, Divider } from 'antd';
import Link from "next/link";
import { useRouter } from "next/router";
import { ReloadOutlined, ShoppingOutlined, UserOutlined, MailOutlined, HomeOutlined, CreditCardOutlined, CalendarOutlined, GlobalOutlined, DollarOutlined } from '@ant-design/icons';
import { getUserIdFromApiKey, getUserEmailById } from '../../../utils/UtilsUser';
import { apiGet } from '../../../utils/UtilsApi';
import { categoryLabels } from '../../../utils/UtilsCategories';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import CardHeader from '../common/CardHeader';
import UserInfoItem from '../common/UserInfoItem';
import buttonStyles from '../../../styles/buttons.module.css';

const { Title, Text } = Typography;

const DetailsTransactionComponent = ({ id }) => {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState(null);
  const [sellerEmail, setSellerEmail] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Añadir estado para currentUser
  const router = useRouter();

  const fetchTransaction = useCallback(async () => {
    if (!id) {
      setLoading(false);
      setError('Transaction ID is missing.');
      return;
    }

    const userId = getUserIdFromApiKey();
    if (!userId) {
      setError('Authentication required');
      setLoading(false);
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    setCurrentUser(userId); // Establecer el usuario actual

    try {
      setLoading(true);
      setError(null);

      const transactions = await apiGet("/transactions/own");

      if (!transactions || !Array.isArray(transactions)) {
        throw new Error('Unable to retrieve transactions from server.');
      }

      const foundTransaction = transactions.find(
        t => String(t.tid || t.id) === String(id)
      );

      if (!foundTransaction) {
        throw new Error('Transaction not found or access denied.');
      }

      setTransaction(foundTransaction);

      // Cargar emails de buyer y seller
      if (foundTransaction.buyerId) {
        const email = await getUserEmailById(foundTransaction.buyerId);
        if (email) {
          setBuyerEmail(email);
        }
      }

      if (foundTransaction.sellerId) {
        const email = await getUserEmailById(foundTransaction.sellerId);
        if (email) {
          setSellerEmail(email);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load transaction details.');
      console.error('Error fetching transaction:', err);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchTransaction();
    }
  }, [fetchTransaction]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusColor = {
    pending: 'orange',
    shipped: 'blue',
    delivered: 'green',
    cancelled: 'red',
  };

  // Estado de carga
  if (loading) {
    return (
      <LoadingSpinner tip="Cargando detalles de la transacción..." />
    );
  }

  // Estado de error
  if (error) {
    return (
      <EmptyState
        description={error}
        title="Error cargando transacción"
        action={
          !error.includes('Authentication') && (
            <Button
              size="small"
              danger
              icon={<ReloadOutlined />}
              onClick={fetchTransaction}
            >
              Reintentar
            </Button>
          )
        }
      />
    );
  }

  if (!transaction) {
    return (
      <EmptyState
        description="No se pudo recuperar la información de la transacción."
        title="No hay datos disponibles"
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '40px' }}>
          <CardHeader
            icon={<ShoppingOutlined style={{ fontSize: '36px', color: '#1a1a1a' }} />}
            title="Transaction Details"
            level={1}
            className={{
              margin: '0 0 12px 0',
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a1a',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            statusTag={
              <Tag
                color="success"
                style={{
                  fontSize: '14px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  marginTop: '8px'
                }}
              >
                ✓ Completed
              </Tag>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Product Information Card */}
          <Card
            title={
              <CardHeader
                icon={<ShoppingOutlined />}
                title="Product Information"
                level={3}
              />
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0'
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <UserInfoItem label="Product ID" value={`#${transaction.productId}`} />
              <UserInfoItem
                label="Title"
                value={
                  transaction.productId ? (
                    <Link href={`/detailProduct/${transaction.productId}`}>
                      <Title level={4} style={{ margin: 0, color: 'var(--primary)' }}>
                        {transaction.title || `Product #${transaction.productId}`}
                      </Title>
                    </Link>
                  ) : (
                    <Text strong>{transaction.title || 'N/A'}</Text>
                  )
                }
              />
              <UserInfoItem label="Description" value={transaction.description} />
              <UserInfoItem
                label="Category"
                value={
                  <Tag color="blue">
                    {categoryLabels[transaction.category]?.label || transaction.category}
                  </Tag>
                }
              />
              <UserInfoItem
                label="Price"
                value={formatPrice(transaction.productPrice)}
                strongValue
              />
            </Space>
          </Card>

          {/* Right Column: Two Cards Stacked */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Transaction Parties Card */}
            <Card
              title={
                <CardHeader
                  icon={<UserOutlined />}
                  title="Transaction Parties"
                  level={3}
                />
              }
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                flex: '1'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <UserInfoItem
                  label="Buyer"
                  value={
                    transaction.buyerId ? (
                      <Link href={`/user/${transaction.buyerId}`}>
                        {buyerEmail || `User #${transaction.buyerId}`}
                      </Link>
                    ) : (
                      'N/A'
                    )
                  }
                />
                <UserInfoItem
                  label="Seller"
                  value={
                    transaction.sellerId ? (
                      <Link href={`/user/${transaction.sellerId}`}>
                        {sellerEmail || `User #${transaction.sellerId}`}
                      </Link>
                    ) : (
                      'N/A'
                    )
                  }
                />
              </Space>
            </Card>

            {/* Shipping Address & Transaction Details Card */}
            <Card
              title={
                <CardHeader
                  icon={<HomeOutlined />}
                  title="Shipping & Transaction Details"
                  level={3}
                />
              }
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                flex: '1'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Shipping Address Section */}
                <UserInfoItem
                  icon={<GlobalOutlined />}
                  label="Shipping Address"
                  value={
                    (transaction.buyerAddress || transaction.buyerCountry || transaction.buyerPostCode) ?
                      ` ${transaction.buyerAddress || ''}, ${transaction.buyerPostCode || ''}, ${transaction.buyerCountry || ''}`
                      : 'N/A'
                  }
                />

                {/* Transaction Date */}
                <UserInfoItem icon={<CalendarOutlined />} label="Transaction Date" value={transaction.startDate ? formatDate(transaction.startDate) : 'N/A'} />

                {/* Payment Method */}
                <UserInfoItem icon={<CreditCardOutlined />} label="Payment Method" value={transaction.buyerPaymentId ? `Payment ID: ${transaction.buyerPaymentId}` : 'N/A'} />

                <UserInfoItem label="Status" value={<Tag color={statusColor[transaction.status]}>{transaction.status}</Tag>} />

              </Space>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailsTransactionComponent;
