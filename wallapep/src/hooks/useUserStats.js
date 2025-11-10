import { useState, useEffect } from "react";
import { apiGet } from "../utils/UtilsApi";

const useUserStats = (userId) => {
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadCounts();
    }
  }, [userId]);

  const loadCounts = async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const [sales, purchases, productsData] = await Promise.all([
        apiGet("/transactions/public", { params: { sellerId: userId } }),
        apiGet("/transactions/public", { params: { buyerId: userId } }),
        apiGet("/products", { params: { sellerId: userId } })
      ]);

      let allTransactions = [];
      let salesCount = 0;
      let purchasesCount = 0;

      if (sales) {
        allTransactions = [...allTransactions, ...sales];
        salesCount = sales.length;
      }

      if (purchases) {
        allTransactions = [...allTransactions, ...purchases];
        purchasesCount = purchases.length;
      }

      const uniqueTransactions = allTransactions.filter((transaction, index, self) =>
        index === self.findIndex(t => t.id === transaction.id)
      );

      setTransactionsCount(uniqueTransactions.length);
      setTotalSales(salesCount);
      setTotalPurchases(purchasesCount);

      if (productsData) {
        setProductsCount(productsData.length);
      }
    } catch (error) {
      console.error("Error loading counts:", error);
      setStatsError("Failed to load user statistics.");
    } finally {
      setLoadingStats(false);
    }
  };

  return {
    transactionsCount,
    productsCount,
    totalSales,
    totalPurchases,
    loadingStats,
    statsError,
    loadCounts // Permite recargar los conteos si es necesario
  };
};

export default useUserStats;
