import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Space, Tag, Typography, Input, Button, Empty, Card, Spin } from 'antd';
import { TransactionOutlined, ShoppingOutlined, EyeOutlined, DollarOutlined } from '@ant-design/icons';
import Link from "next/link";
// import { timestampToString } from "../../../utils/UtilsDates";
import { categoryLabels } from "../../../utils/UtilsCategories";
import { getUserIdFromApiKey, getUserEmailById } from '../../../utils/UtilsUser';
import { apiGet, fetchUserTransactions } from '../../../utils/UtilsApi';
import StatisticsCard from '../common/StatisticsCard';
import LoadingSpinner from '../common/LoadingSpinner'; // Importar LoadingSpinner
import EmptyState from '../common/EmptyState'; // Importar EmptyState
import CardHeader from '../common/CardHeader'; // Importar CardHeader
import styles from '../../../styles/ListMyTransactions.module.css';
const { Text, Title } = Typography;
const TRANSACTION_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller'
};
const ROLE_TAGS = {
  [TRANSACTION_ROLES.BUYER]: { color: 'blue', label: 'Buyer' },
  [TRANSACTION_ROLES.SELLER]: { color: 'green', label: 'Seller' }
};
const ListMyTransactionsComponent = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmails, setUserEmails] = useState({});
  const userId = getUserIdFromApiKey();
  // Determinar el rol del usuario en una transacción
  const getUserRole = useCallback((transaction) => {
    if (transaction.buyerId === userId) return TRANSACTION_ROLES.BUYER;
    if (transaction.sellerId === userId) return TRANSACTION_ROLES.SELLER;
    return null;
  }, [userId]);
  // Calcular estadísticas
  const statistics = useMemo(() => {
    const earned = transactions
      .filter(t => t.sellerId === userId)
      .reduce((sum, t) => sum + (t.productPrice || 0), 0);
    const spent = transactions
      .filter(t => t.buyerId === userId)
      .reduce((sum, t) => sum + (t.productPrice || 0), 0);
    return [
      {
        title: "Total Earned",
        value: earned,
        prefix: <DollarOutlined />,
        valueStyle: { color: '#52c41a' },
        formatter: (value) => `€ ${value.toFixed(2)}`
      },
      {
        title: "Total Spent",
        value: spent,
        prefix: <ShoppingOutlined />,
        valueStyle: { color: '#1890ff' },
        formatter: (value) => `€ ${value.toFixed(2)}`
      },
      {
        title: "Total Transactions",
        value: transactions.length,
        prefix: <TransactionOutlined />
      }
    ];
  }, [transactions, userId]);
  // Cargar emails de usuarios únicos
  const loadUserEmails = useCallback(async (transactionsData) => {
    const uniqueUserIds = new Set();
    transactionsData.forEach(t => {
      if (t.sellerId) uniqueUserIds.add(t.sellerId);
      if (t.buyerId) uniqueUserIds.add(t.buyerId);
    });
    const emailsToFetch = Array.from(uniqueUserIds).filter(
      id => !userEmails[id]
    );
    if (emailsToFetch.length === 0) return;
    try {
      const fetchedEmails = await Promise.all(
        emailsToFetch.map(id => getUserEmailById(id))
      );
      const newEmails = {};
      emailsToFetch.forEach((id, index) => {
        if (fetchedEmails[index]) {
          newEmails[id] = fetchedEmails[index];
        }
      });
      setUserEmails(prev => ({ ...prev, ...newEmails }));
    } catch (error) {
      console.error("Error loading user emails:", error);
    }
  }, [userEmails]);
  // Cargar transacciones
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const formattedTransactions = await fetchUserTransactions();
      setTransactions(formattedTransactions);
      loadUserEmails(formattedTransactions);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [loadUserEmails]);
  // Renderizar usuario con link
  const renderUserLink = useCallback((userId, defaultLabel) => {
    if (!userId) return '-';
    const userEmail = userEmails[userId] || defaultLabel;
    return (
      <Link href={`/user/${userId}`}>
        {userEmail}
      </Link>
    );
  }, [userEmails]);
  // Componente de filtro de búsqueda
  const SearchFilter = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div className={styles.filterDropdown}>
      <Input
        placeholder="Search product"
        value={selectedKeys[0]}
        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={confirm}
      />
      <Space>
        <Button type="primary" onClick={confirm} size="small">
          Search
        </Button>
        <Button onClick={clearFilters} size="small">
          Reset
        </Button>
      </Space>
    </div>
  );
  // Configuración de columnas
  const columns = useMemo(() => [
    {
      title: "Product",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
      filterDropdown: SearchFilter,
      onFilter: (value, record) => 
        record.title?.toLowerCase().includes(value.toLowerCase()),
      render: (title, record) => (
        <Link href={`/detailProduct/${record.productId}`}>
          {title || `Product #${record.productId}`}
        </Link>
      )
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: Object.keys(categoryLabels)
        .filter(k => k !== 'todos')
        .map(key => ({
          text: categoryLabels[key].label,
          value: key
        })),
      onFilter: (value, record) => record.category === value,
      render: (category) => {
        if (!category) return '-';
        return categoryLabels[category]?.label || category;
      }
    },
    {
      title: "Price (€)",
      dataIndex: "productPrice",
      key: "productPrice",
      align: 'right',
      sorter: (a, b) => (a.productPrice || 0) - (b.productPrice || 0),
      render: (price) => price ? <Text strong className={styles.priceText}>€ {price}</Text> : '-'
    },
    {
      title: "Role",
      key: "role",
      width: 100,
      filters: [
        { text: 'Seller', value: TRANSACTION_ROLES.SELLER },
        { text: 'Buyer', value: TRANSACTION_ROLES.BUYER },
      ],
      onFilter: (value, record) => getUserRole(record) === value,
      render: (_, record) => {
        const role = getUserRole(record);
        if (!role) return '-';
        const { color, label } = ROLE_TAGS[role];
        return <Tag color={color}>{label}</Tag>;
      }
    },
    // {
    //   title: "Date",
    //   dataIndex: "startDate",
    //   key: "startDate",
    //   sorter: (a, b) => (a.startDate || 0) - (b.startDate || 0),
    //   render: (startDate) => startDate ? timestampToString(startDate) : '-'
    // },
    {
      title: "Seller",
      key: "seller",
      render: (_, record) => 
        renderUserLink(record.sellerId, `Seller #${record.sellerId}`)
    },
    {
      title: "Buyer",
      key: "buyer",
      render: (_, record) => 
        renderUserLink(record.buyerId, `Buyer #${record.buyerId}`)
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Link href={`/detailTransaction/${record.tid || record.id}`}>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            title="View details"
          />
        </Link>
      )
    },
  ], [getUserRole, renderUserLink]);
  useEffect(() => {
    if (userId) {
      loadTransactions();
    }
  }, [userId, loadTransactions]);
  if (loading) {
    return (
      <LoadingSpinner tip="Loading transactions..." />
    );
  }
  return (
    <div>
      <CardHeader 
        icon={<TransactionOutlined className={styles.headerIcon} />} 
        title="My Transactions" 
        level={2} 
        className={styles.header}
      />
      {transactions.length > 0 && (
        <StatisticsCard 
          stats={statistics}
          className={styles.statisticsRow}
        />
      )}
      {transactions.length === 0 ? (
        <Card>
          <EmptyState
            description="You have no registered transactions."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <Table 
          columns={columns} 
          dataSource={transactions}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
        />
      )}
    </div>
  );
};
export default ListMyTransactionsComponent;
