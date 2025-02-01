import Transactions from "../../features/Transaction/Transactions";

export default function TransactionDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-head">
        <div className="dashboard-head__title">Transaction List</div>
      </div>
      <Transactions />
    </div>
  );
}
