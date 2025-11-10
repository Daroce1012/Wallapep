import "@/styles/globals.css";
import Link from "next/link";
import 'antd/dist/reset.css';
import { Layout, Menu, Avatar, Typography, Col, Row, notification, Breadcrumb, App as AntdApp, Dropdown, Space } from 'antd';
import { FireOutlined , LoginOutlined, HomeOutlined, ShoppingOutlined, PlusOutlined, AppstoreOutlined, TransactionOutlined, LogoutOutlined, UserOutlined, ShopOutlined, ContainerOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import store from "../reducers/store"
import { apiGet, getApiKey } from '../utils/UtilsApi';
import styles from '../styles/App.module.css';
import Head from "next/head";

const { Text } = Typography;

export default function App({ Component, pageProps }) {
    const [api, contextHolder] = notification.useNotification();

    const pathname = usePathname();
    let router = useRouter()
    let [login, setLogin] = useState(false);
    let [charUser,setCharUser] = useState("a")

    useEffect(() => {
        checkAll();
        setCharUser(localStorage.getItem("email")?.charAt(0))
    }, [])

    let checkAll = async () => {
        let isActive = await checkLoginIsActive()
        checkUserAccess(isActive)
    }

    let checkUserAccess= async (isActive) => {
        if (!isActive && !["/", "/login", "/register"].includes(pathname)) {
            router.push("/login"); 
        }
    }

    let checkLoginIsActive = async () => {
        if(getApiKey() == null){
            setLogin(false);
            return;
        }

        let jsonData = await apiGet("/users/isActiveApiKey");
        if (jsonData) {
            setLogin(jsonData.activeApiKey)
            if (!jsonData.activeApiKey){
                router.push("/login")
            }
            return(jsonData.activeApiKey)
        } else {
            setLogin(false)
            router.push("/login")
            return (false)
        }
    }


    let disconnect = async () => {
        const result = await apiGet("/users/disconnect");
        if (result) { // Solo desconectar si la API responde exitosamente
            localStorage.removeItem("apiKey");
            setLogin(false)
            router.push("/login")
        }
    }


  let callBackOnFinishLogin = (loginUser) => {
    console.log("Cambiado "+loginUser.email);
    console.log("Cambiado "+loginUser.password);
  }

  let { Header, Content, Footer } = Layout;

  const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

  const userMenu = (
    <Menu>
      <Menu.Item key="3" onClick={disconnect}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );


  return (
    <Provider store={store}>
      <Head>
        <title>Wallapep - Buy and Sell Products</title>
      </Head>
      <Layout className={styles.layout}>
        {contextHolder}
          <Header>
            <Row>
                <Col xs= {18} sm={19} md={20} lg={21} xl = {22}>
                {!login &&
                    <Menu theme="dark" mode="horizontal" items={ [
                        { key:"logo",  label: <Link href="/" className={styles.logoLink}><img src="/logo.png" width="40" height="40" /></Link>},
                        { key:"menuLogin",  icon: <LoginOutlined/>, label: <Link href="/login">Login</Link>},
                        { key:"menuRegister",  label: <Link href="/register">Register</Link>},
                    ]} >
                    </Menu>
                }
                {login &&
                    <Menu theme="dark" mode="horizontal" items={ [
                        { key:"logo",  label: <Link href="/" className={styles.logoLink}><img src="/logo.png" width="40" height="40" /></Link>},
                        { key:"menuProducts",  icon: <ShoppingOutlined />, label: <Link href="/products">Products</Link>},
                        { key:"menuCreateProduct",  icon: <ShopOutlined />, label: <Link href="/createProduct">Sell</Link>},
                        { key:"menuMyProduct", icon: <ContainerOutlined />, label: <Link href="/myProducts">My Products</Link> },
                        { key:"menuMyTransactions", icon: <TransactionOutlined />, label: <Link href="/myTransactions">My Transactions</Link> },
                    ]} >
                    </Menu>
                }
                </Col>
                <Col xs= {6} sm={5} md = {4}  lg = {3} xl = {2} className={styles.userCol}>
                    { login ? (
                        <Dropdown overlay={userMenu} placement="bottomRight" trigger={['hover']} arrow>
                            <Link href="/profile">
                                <Avatar size="large" className={styles.userInfo}>
                                    { charUser }
                                </Avatar>
                            </Link>
                        </Dropdown>
                    ) : (
                        null
                    )}
                </Col>
            </Row>
          </Header>
          <Content className={styles.content}>
            <AntdApp>
              <Component {...pageProps} setLogin={setLogin} openNotification={openNotification} />
            </AntdApp>
          </Content>
          <Footer className={styles.footer}>
            <Row justify="center">
              <Col xs={24} sm={24} md={20} lg={16} xl={12}>
                <Text className={styles.footerText}>
                  © {new Date().getFullYear()} Wallapep - All rights reserved
                </Text>
              </Col>
            </Row>
          </Footer>
      </Layout>
    </Provider>
  )
}
