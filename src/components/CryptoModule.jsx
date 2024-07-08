import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

const fetchCryptoData = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const CryptoModule = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cryptoData"],
    queryFn: fetchCryptoData,
    refetchInterval: 60000, // Refetch every minute
  });

  if (error) return <div>Error fetching cryptocurrency data</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 10 Cryptocurrencies</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((crypto) => (
              <div key={crypto.id} className="flex justify-between items-center">
                <span className="font-medium">{crypto.symbol.toUpperCase()}</span>
                <span>${crypto.current_price.toFixed(2)}</span>
                <span
                  className={`flex items-center ${
                    crypto.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoModule;