import { useRouter } from "next/router";
import DetailsTransactionComponent from "../components/transactions/DetailsTransactionComponent";

export default function DetailsTransactionPage() {
  const router = useRouter();
  const { id } = router.query; 

  return (
    <div>
      <DetailsTransactionComponent id={id} />
    </div>
  );
}

