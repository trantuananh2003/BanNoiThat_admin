import CardIncome from "./components/CardIncome";
import ProductCard from "./components/ProductCard";
import Editor from "./components/textEditorTool";
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
      <Editor />
      <ProductCard />
    </div>
  );
}

export default AnalysisPage;
