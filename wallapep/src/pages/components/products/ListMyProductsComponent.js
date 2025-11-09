import {useState, useEffect} from "react";
import { Table, Space, Typography, Input, Button, Tag, InputNumber, Card, Empty, Row, Col, Statistic } from 'antd';
import { ShoppingOutlined, EditOutlined, CheckOutlined, CloseOutlined, DollarOutlined, DeleteOutlined } from '@ant-design/icons';
import Link from "next/link";
import { timestampToString } from "../../../utils/UtilsDates";
import { apiGet, apiDelete, apiPut } from '../../../utils/UtilsApi'; // Importar métodos de UtilsApi
import styles from '../../../styles/ListMyProducts.module.css';

const { Title, Text } = Typography;

let ListMyProductsComponent = () => {
    let [products, setProducts] = useState([])
    let [editingId, setEditingId] = useState(null);
    let [editingPrice, setEditingPrice] = useState(null);
    let [editingProduct, setEditingProduct] = useState(null); // Nuevo estado para el producto completo en edición
    let [totalProducts, setTotalProducts] = useState(0);
    let [soldProducts, setSoldProducts] = useState(0);
    let [availableProducts, setAvailableProducts] = useState(0);

    useEffect(() => {
        getMyProducts();
    }, [])

    // useEffect para calcular estadísticas cada vez que los productos cambian
    useEffect(() => {
        calculateStatistics(products);
    }, [products]);

    let deleteProduct = async (id) => {
        let result = await apiDelete(`/products/${id}`, {
            onError: (serverErrors) => {
                serverErrors.forEach(e => {
                    // El error ya se maneja en handleApiError
                })
            }
        });

        if (result && result.deleted){
            let productsAftherDelete = products.filter(p => p.id != id)
            setProducts(productsAftherDelete)
        }
    }

    let handleEditPrice = (record) => {
        setEditingId(record.id);
        setEditingPrice(record.price);
        setEditingProduct(record); // Guardar el producto completo al iniciar la edición
    }

    let handleSavePrice = async (id, newPrice) => {

        if (!editingProduct) {
            console.error("Error: No hay producto en edición para guardar.");
            setEditingId(null);
            setEditingPrice(null);
            setEditingProduct(null);
            return;
        }

        // Crear un objeto con los datos del producto actualizados
        const updatedProductData = {
            ...editingProduct,
            price: newPrice,
        };

        let result = await apiPut(`/products/${id}`, updatedProductData, {
            onError: (serverErrors) => {
                serverErrors.forEach(e => {
                    // El error ya se maneja en handleApiError
                })
            }
        });
        if (result) {
            // Si la actualización es exitosa, recargar todos los productos para asegurar la consistencia
            getMyProducts();
        }
        // Siempre reiniciar el estado de edición después de intentar guardar
        setEditingId(null);
        setEditingPrice(null);
        setEditingProduct(null); // Reiniciar también el producto en edición
    }

    let handleCancelEdit = () => {
        setEditingId(null);
        setEditingPrice(null);
        setEditingProduct(null);
    }

    let getMyProducts = async () => {
        let jsonData = await apiGet("/products/own/", {
            onError: (serverErrors) => {
                serverErrors.forEach(e => {
                    // El error ya se maneja en handleApiError
                })
            }
        });
        if ( jsonData ){
            const productsWithKeys = jsonData.map( product => ({
                ...product,
                key: product.id
            }));
            setProducts(productsWithKeys)
        }
    }

    let calculateStatistics = (currentProducts) => {
        setTotalProducts(currentProducts.length);
        setSoldProducts(currentProducts.filter(p => p.buyerId).length);
        setAvailableProducts(currentProducts.filter(p => !p.buyerId).length);
    }

    let columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => {
                let titleA = a.title || '';
                let titleB = b.title || '';
                return titleA.localeCompare(titleB);
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className={styles.filterDropdown}>
                    <Input
                        placeholder="Search title"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => confirm()}
                        className={styles.filterInput}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => confirm()}
                            size="small"
                            className={styles.filterButton}
                        >
                            Search
                        </Button>
                        <Button onClick={() => clearFilters()} size="small" className={styles.filterButton}>
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            onFilter: (value, record) =>
                record.title && record.title.toLowerCase().includes(value.toLowerCase()),
            render: (text, record) => (
                <Link href={`/detailProduct/${record.id}`}>
                    {text}
                </Link>
            )
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description) => description ? (description.length > 50 ? description.substring(0, 50) + '...' : description) : '-'
        },
        {
            title: "Price (€)",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            align: 'right',
            render: (price, record) => {
                if (editingId === record.id) {
                    return (
                        <Space>
                            <InputNumber
                                min={0}
                                value={editingPrice}
                                onChange={setEditingPrice}
                                formatter={value => `€ ${value}`}
                                parser={value => value.replace('€ ', '')}
                                className={styles.priceInput}
                            />
                            <Button 
                                type="primary" 
                                size="small" 
                                icon={<CheckOutlined />}
                                onClick={() => handleSavePrice(record.id, editingPrice)}
                            />
                            <Button 
                                size="small" 
                                icon={<CloseOutlined />}
                                onClick={handleCancelEdit}
                            />
                        </Space>
                    );
                }
                return price ? (
                    <Text strong className={`${styles.priceText} ${styles.clickablePrice}`} onClick={() => handleEditPrice(record)}>
                        € {price}
                    </Text>
                ) : '-'
            }
        },
        {
            title: "Status",
            key: "status",
            filters: [
                { text: 'Available', value: 'available' },
                { text: 'Sold', value: 'sold' },
            ],
            onFilter: (value, record) => {
                if (value === 'available') return !record.buyerId;
                if (value === 'sold') return !!record.buyerId;
                return true;
            },
            render: (_, record) => {
                if (record.buyerId) {
                    return <Tag color="red">Sold</Tag>
                } else {
                    return <Tag color="green">Available</Tag>
                }
            }
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            sorter: (a, b) => (a.date || 0) - (b.date || 0),
            render: (date) => timestampToString(date)
        },
        {
            title: "Buyer",
            key: "buyer",
            render: (_, record) => {
                if (record.buyerId) {
                    return <Link href={`user/${record.buyerId}`}>{record.buyerEmail || `User #${record.buyerId}`}</Link>
                }
                return '-'
            }
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => 
                <Space>
                    <Link href={`editProduct/${record.id}`} passHref>
                        <Button type="link" size="small" icon={<EditOutlined />} />
                    </Link>
                    <Button 
                        type="link" 
                        size="small" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => deleteProduct(record.id)}
                    />
                </Space>
        },
    ]

    return (
        <div>
            <Space align="center" className={styles.header}>
                <ShoppingOutlined className={styles.headerIcon} />
                <Title level={2} className={styles.headerTitle}>My Products</Title>
            </Space>

            <Row gutter={[16, 16]} className={styles.statisticsRow}>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic title="Total Products" value={totalProducts} prefix={<ShoppingOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic title="Products Sold" value={soldProducts} prefix={<DollarOutlined />} valueStyle={{ color: '#cf1322' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic title="Products Available" value={availableProducts} prefix={<ShoppingOutlined />} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
            </Row>

            {products.length === 0 ? (
                <Card>
                    <Empty 
                        description="You have no registered products for sale."
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                </Card>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={products}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            )}
        </div>
    )
}

export default ListMyProductsComponent;
