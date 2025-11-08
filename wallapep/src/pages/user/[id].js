import { useRouter } from "next/router";
import UserProfileComponent from "../components/user/UserProfileComponent";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query; 

  return (
    <div>
      <UserProfileComponent userId={id} />
    </div>
  );
}

