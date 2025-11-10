import { useState, useEffect, useMemo } from "react";
import { Table, Space, Typography, Input, Button, Tag, Card, Empty, Modal, message } from 'antd';
import { ShoppingOutlined, EditOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import Link from "next/link";
import { timestampToString } from "../../../utils/UtilsDates";
import { apiGet, apiDelete, apiPut, fetchProducts } from '../../../utils/UtilsApi';
import StatisticsCard from '../common/StatisticsCard'; // Ruta corregida
import PriceEditor from './PriceEditor';
import styles from '../../../styles/ListMyProducts.module.css';
import CardHeader from '../common/CardHeader';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

const { Title } = Typography;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ListMyProductsComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productLoadError, setProductLoadError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [modal, contextHolderModal] = Modal.useModal();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProductLoadError(null);
      const data = await fetchProducts();
      if (data) {
        setProducts(data);
      } else {
        // Considerar que `data` podría ser null si hay un error en la API pero la respuesta es 200
        setProductLoadError("Failed to retrieve products.");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProductLoadError("Failed to load your products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPrice(null);
  };

  const savePrice = async (product) => {
    if (editPrice === null || editPrice < 0) {
      message.warning("Enter a valid price");
      return;
    }

    const result = await apiPut(`/products/${product.id}`, {
      ...product,
      price: editPrice
    }, {
      onError: (serverErrors) => {
        const notificationMsg = serverErrors.map(e => e.msg).join(", ");
        message.error(notificationMsg || "Failed to update price");
      }
    });
    
    if (result) {
      message.success("Price updated");
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, price: editPrice } : p
      ));
      cancelEdit();
    }
  };

  const deleteProduct = (product) => {
    modal.confirm({
      title: 'Delete Product',
      content: `Delete "${product.title}"? This cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        const result = await apiDelete(`/products/${product.id}`, {
          onError: (serverErrors) => {
            const notificationMsg = serverErrors.map(e => e.msg).join(", ");
            message.error(notificationMsg || "Failed to delete product");
          }
        });
        if (result?.deleted) {
          message.success("Product deleted");
          setProducts(prev => prev.filter(p => p.id !== product.id));
        } else if (result !== null) {
          // Si result no es null pero deleted es false, significa que la API respondió pero no se eliminó
          message.error("Failed to delete product. Please try again.");
        }
      }
    });
  };

  // ============================================
  // CONFIGURACIÓN DE COLUMNAS
  // ============================================

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    //   width: 80,
    // },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className={styles.filterDropdown}>
          <Input
            placeholder="Search title"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
          />
          <Space>
            <Button type="primary" onClick={confirm} size="small">Search</Button>
            <Button onClick={clearFilters} size="small">Reset</Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.title?.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => <Link href={`/detailProduct/${record.id}`}>{text || '-'}</Link>
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc) => {
        if (!desc) return '-';
        return desc.length > 50 ? `${desc.substring(0, 50)}...` : desc;
      }
    },
    {
      title: "Price (€)",
      key: "price",
      align: 'right',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
      render: (_, product) => (
        <PriceEditor
          product={product}
          isEditing={editingId === product.id}
          editPrice={editPrice}
          onEdit={() => startEdit(product)}
          onSave={() => savePrice(product)}
          onCancel={cancelEdit}
          onChange={setEditPrice}
        />
      )
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      filters: [
        { text: 'Available', value: false },
        { text: 'Sold', value: true },
      ],
      onFilter: (value, record) => !!record.buyerId === value,
      render: (_, record) => (
        record.buyerId 
          ? <Tag color="red" className={styles.tagStatus}>Sold</Tag>
          : <Tag color="green" className={styles.tagStatus}>Available</Tag>
      )
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => (a.date || 0) - (b.date || 0),
      render: (date) => date ? timestampToString(date) : '-'
    },
    {
      title: "Buyer",
      key: "buyer",
      render: (_, record) => {
        if (!record.buyerId) return '-';
        return (
          <Link href={`/user/${record.buyerId}`}>
            {record.buyerEmail || `User #${record.buyerId}`}
          </Link>
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, product) => (
        <Space size="small">
          <Link href={`/editProduct/${product.id}`}>
            <Button type="link" size="small" icon={<EditOutlined />} />
          </Link>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => deleteProduct(product)}
          />
        </Space>
      )
    },
  ];

  const productStats = useMemo(() => [
    {
      title: "Total Products",
      value: products.length,
      prefix: <ShoppingOutlined />,
    },
    {
      title: "Sold",
      value: products.filter(p => p.buyerId).length,
      prefix: <DollarOutlined />,
      valueStyle: { color: '#cf1322' }
    },
    {
      title: "Available",
      value: products.filter(p => !p.buyerId).length,
      prefix: <ShoppingOutlined />,
      valueStyle: { color: '#52c41a' }
    }
  ], [products]);

  // ============================================
  // RENDER
  // ============================================

  if (loading) {
    return <LoadingSpinner tip="Loading your products..." />;
  }

  if (productLoadError) {
    return (
      <EmptyState
        description={productLoadError}
        title="Error loading products"
        action={
          <Button 
            size="small" 
            danger 
            onClick={loadProducts}
          >
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <CardHeader 
        icon={<ShoppingOutlined className={styles.headerIcon} />} 
        title="My Products" 
        level={2}
        className={styles.header}
      />

      <StatisticsCard 
        stats={productStats}
        className={styles.statisticsRow}
        loading={loading} // Pasar el estado de carga
      />

      {products.length === 0 && !loading ? (
        <Card>
          <EmptyState 
            description="You have no products for sale."
          />
        </Card>
      ) : (
        <Table 
          columns={columns} 
          dataSource={products}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: true }}
        />
      )}

      {contextHolderModal}
    </div>
  );
};

export default ListMyProductsComponent;
