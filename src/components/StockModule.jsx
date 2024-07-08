import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

const API_KEY = "YOUR_API_KEY"; // Replace with your actual API key
const TOP_NASDAQ_SYMBOLS = ["AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "NVDA", "PYPL", "ADBE", "NFLX"];

const fetchStockData = async () => {
  const promises = TOP_NASDAQ_SYMBOLS.map(symbol =>
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
      .then(response => response.json())
  );
  const results = await Promise.all(promises);
  return results.map(result => result["Global Quote"]);
};

const StockModule = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stockData"],
    queryFn: fetchStockData,
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  if (error) return <div>Error fetching stock data</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top 10 NASDAQ Stocks</CardTitle>
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
            {data.map((stock, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{stock["01. symbol"]}</span>
                <span>${parseFloat(stock["05. price"]).toFixed(2)}</span>
                <span className={`flex items-center ${parseFloat(stock["09. change"]) >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {parseFloat(stock["09. change"]) >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {parseFloat(stock["10. change percent"]).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockModule;