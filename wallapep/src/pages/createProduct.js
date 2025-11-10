import CreateProductComponent from "./components/products/CreateProductComponent";

export default function CreateProductPage({ setLogin, openNotification }) {

  return (
    <div>
      <CreateProductComponent setLogin={setLogin} openNotification={openNotification} />
    </div>
  );
}