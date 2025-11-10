import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUserIdFromApiKey } from "../utils/UtilsUser";
import UserProfileComponent from "./components/profile/UserProfileComponent";

export default function ProfilePage() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    setCurrentUserId(getUserIdFromApiKey());
  }, []);

  if (!currentUserId) {
    return <div>Loading user profile...</div>; // O un spinner/mensaje de error
  }

  return (
    <div>
      <UserProfileComponent userId={currentUserId} />
    </div>
  );
}
