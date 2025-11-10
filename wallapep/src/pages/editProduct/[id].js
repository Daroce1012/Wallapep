import { useRouter } from "next/router";
import EditProductFormComponent from "../components/products/EditProductFormComponent";

export default function EditProductPage({ openNotification }) {
  const router = useRouter();
  const { id } = router.query; 

  const clickReturn = () => {
    router.push("/products");
  };

  return (
    <div>
      <h1>Editar producto {id}</h1>
      <EditProductFormComponent id = {id} openNotification={openNotification} />
    </div>
  );
}