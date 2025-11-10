import { useState, useEffect, useCallback } from "react";
import { Skeleton, Alert, Button, message, Tag, Card, Space, Typography } from 'antd';
import Link from "next/link";
import { useRouter } from "next/router";
import { ReloadOutlined } from '@ant-design/icons';
import { getUserIdFromApiKey, getUserEmailById } from '../../../utils/UtilsUser';
import { apiGet } from '../../../utils/UtilsApi';
import { categoryLabels } from '../../../utils/UtilsCategories';

const { Title, Text } = Typography;

const DetailsTransactionComponent = ({ id }) => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buyerEmail, setBuyerEmail] = useState(null);
    const [sellerEmail, setSellerEmail] = useState(null);
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

    // Estado de carga
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', padding: '24px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Skeleton active paragraph={{ rows: 12 }} />
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', padding: '24px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Alert
                        message="Error Loading Transaction"
                        description={error}
                        type="error"
                        showIcon
                        action={
                            !error.includes('Authentication') && (
                                <Button 
                                    size="small" 
                                    danger 
                                    icon={<ReloadOutlined />}
                                    onClick={fetchTransaction}
                                >
                                    Retry
                                </Button>
                            )
                        }
                    />
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', padding: '24px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <Alert
                        message="No Data Available"
                        description="Transaction information could not be retrieved."
                        type="info"
                        showIcon
                    />
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: '#fafafa',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            padding: '24px 24px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <Title level={1} style={{ 
                                margin: '0 0 12px 0',
                                fontSize: '36px',
                                fontWeight: '700',
                                color: '#1a1a1a',
                                letterSpacing: '-0.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                🛍️ Transaction Details
                            </Title>
                        </div>
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
                    </div>
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
                            <span style={{ fontSize: '18px', fontWeight: '600' }}>
                                🛍️ Product Information
                            </span>
                        }
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: '1px solid #f0f0f0'
                        }}
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                    Product ID:
                                </Text>
                                <Text strong style={{ fontSize: '16px', fontFamily: 'monospace' }}>
                                    #{transaction.productId}
                                </Text>
                            </div>

                            <div>
                                <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                    Title:
                                </Text>
                                {transaction.productId ? (
                                    <Link 
                                        href={`/detailProduct/${transaction.productId}`}
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#1a1a1a',
                                            textDecoration: 'none',
                                            display: 'block'
                                        }}
                                    >
                                        {transaction.title || `Product #${transaction.productId}`}
                                    </Link>
                                ) : (
                                    <Text strong style={{ fontSize: '18px' }}>
                                        {transaction.title || 'N/A'}
                                    </Text>
                                )}
                            </div>

                            {transaction.description && (
                                <div>
                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                        Description:
                                    </Text>
                                    <Text style={{ fontSize: '15px', color: '#595959', lineHeight: '1.6' }}>
                                        {transaction.description}
                                    </Text>
                                </div>
                            )}

                            {transaction.category && (
                                <div>
                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                                        Category:
                                    </Text>
                                    <Tag color="blue" style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '6px' }}>
                                        {categoryLabels[transaction.category]?.label || transaction.category}
                                    </Tag>
                                </div>
                            )}

                            <div style={{
                                paddingTop: '20px',
                                borderTop: '1px solid #f0f0f0',
                                marginTop: '8px'
                            }}>
                                <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                    Price:
                                </Text>
                                <Text strong style={{ fontSize: '28px', color: '#52c41a', fontWeight: '700' }}>
                                    {formatPrice(transaction.productPrice)}
                                </Text>
                            </div>
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
                                <span style={{ fontSize: '18px', fontWeight: '600' }}>
                                    👤 Transaction Parties
                                </span>
                            }
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid #f0f0f0',
                                flex: '1'
                            }}
                        >
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                                        Buyer:
                                    </Text>
                                    {transaction.buyerId ? (
                                        <Link 
                                            href={`/user/${transaction.buyerId}`}
                                            style={{
                                                fontSize: '15px',
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {buyerEmail || `User #${transaction.buyerId}`}
                                        </Link>
                                    ) : (
                                        <Text style={{ fontSize: '15px', color: '#595959' }}>N/A</Text>
                                    )}
                                </div>

                                <div style={{
                                    paddingTop: '20px',
                                    borderTop: '1px solid #f0f0f0',
                                    marginTop: '8px'
                                }}>
                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                                        Seller:
                                    </Text>
                                    {transaction.sellerId ? (
                                        <Link 
                                            href={`/user/${transaction.sellerId}`}
                                            style={{
                                                fontSize: '15px',
                                                color: '#1890ff',
                                                textDecoration: 'none',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {sellerEmail || `User #${transaction.sellerId}`}
                                        </Link>
                                    ) : (
                                        <Text style={{ fontSize: '15px', color: '#595959' }}>N/A</Text>
                                    )}
                                </div>
                            </Space>
                        </Card>

                        {/* Shipping Address & Transaction Details Card */}
                        <Card
                            title={
                                <span style={{ fontSize: '18px', fontWeight: '600' }}>
                                    📍 Shipping & Transaction Details
                                </span>
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
                                {(transaction.buyerAddress || transaction.buyerCountry || transaction.buyerPostCode) ? (
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '13px', marginBottom: '12px', display: 'block', fontWeight: '600' }}>
                                            📍 Shipping Address:
                                        </Text>
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            {transaction.buyerAddress && (
                                                <div>
                                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                                        Address:
                                                    </Text>
                                                    <Text style={{ fontSize: '14px', color: '#595959' }}>
                                                        {transaction.buyerAddress}
                                                    </Text>
                                                </div>
                                            )}
                                            {transaction.buyerPostCode && (
                                                <div>
                                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                                        Postal Code:
                                                    </Text>
                                                    <Text style={{ fontSize: '14px', color: '#595959' }}>
                                                        {transaction.buyerPostCode}
                                                    </Text>
                                                </div>
                                            )}
                                            {transaction.buyerCountry && (
                                                <div>
                                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                                        Country:
                                                    </Text>
                                                    <Text style={{ fontSize: '14px', color: '#595959' }}>
                                                        {transaction.buyerCountry}
                                                    </Text>
                                                </div>
                                            )}
                                        </Space>
                                    </div>
                                ) : (
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                            📍 Shipping Address:
                                        </Text>
                                        <Text style={{ fontSize: '14px', color: '#595959' }}>N/A</Text>
                                    </div>
                                )}

                                {/* Transaction Date */}
                                <div style={{
                                    paddingTop: '20px',
                                    borderTop: '1px solid #f0f0f0',
                                    marginTop: '8px'
                                }}>
                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                        📅 Transaction Date:
                                    </Text>
                                    <Text style={{ fontSize: '14px', color: '#595959' }}>
                                        {transaction.startDate ? formatDate(transaction.startDate) : 'N/A'}
                                    </Text>
                                </div>

                                {/* Payment Method */}
                                <div style={{
                                    paddingTop: '20px',
                                    borderTop: '1px solid #f0f0f0',
                                    marginTop: '8px'
                                }}>
                                    <Text type="secondary" style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                                        💳 Payment Method:
                                    </Text>
                                    <Text style={{ fontSize: '14px', color: '#595959' }}>
                                        {transaction.buyerPaymentId ? `Payment ID: ${transaction.buyerPaymentId}` : 'N/A'}
                                    </Text>
                                </div>
                            </Space>
                        </Card>
                    </div>
                </div>

                {/* Action Buttons Card */}
                <Card
                    style={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0'
                    }}
                    bodyStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}
                >
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => router.push('/myTransactions')}
                        style={{
                            height: '48px',
                            borderRadius: '8px',
                            padding: '0 40px',
                            fontSize: '15px',
                            fontWeight: '600'
                        }}
                    >
                        View All Transactions
                    </Button>
                    {transaction.productId && (
                        <Button
                            size="large"
                            onClick={() => router.push(`/detailProduct/${transaction.productId}`)}
                            style={{
                                height: '48px',
                                borderRadius: '8px',
                                padding: '0 40px',
                                fontSize: '15px',
                                fontWeight: '600'
                            }}
                        >
                            View Product
                        </Button>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default DetailsTransactionComponent;
