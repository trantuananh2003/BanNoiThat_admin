import CardIncome from "./components/CardIncome";
import ProductCard from "./components/ProductCard";
import TotalRevenueChart from "./components/TotalRevenueChart";

function AnalysisPage() {
  return (
    <div>
      <div className="flex flex-row gap-8">
        <CardIncome />
        <CardIncome />
        <CardIncome />
        <CardIncome />
      </div>
      <TotalRevenueChart />
      <ProductCard />
    </div>
  );
}

export default AnalysisPage;
