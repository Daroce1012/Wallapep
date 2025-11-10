import CreateUserComponent from "./components/user/CreateUserComponent";

export default function RegisterPage({setLogin,openNotification}) {

  return (
    <div>
      <CreateUserComponent setLogin={setLogin}
        openNotification={openNotification}/>
    </div>
  );
}