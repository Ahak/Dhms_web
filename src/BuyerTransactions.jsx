import React, { useEffect, useState } from 'react';
import api from './api';
import Navbar from './Navbar';

const BuyerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalStats, setTotalStats] = useState({ total_count: 0, total_amount: 0 });

  useEffect(() => {
    fetchTransactions();
    fetchTotalStats();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/api/transactions/');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching buyer transactions', error);
    }
  };

  const fetchTotalStats = async () => {
    try {
      const response = await api.get('/api/transactions/total/');
      setTotalStats(response.data);
    } catch (error) {
      console.error('Error fetching buyer transaction totals', error);
    }
  };

  const formatPaymentStatus = (status) => {
    const statusClass = {
      pending: 'bg-warning',
      completed: 'bg-success',
      failed: 'bg-danger'
    };

    return (
      <span className={`badge ${statusClass[status] || 'bg-secondary'} text-capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid mt-4">
        <h2 className="mb-4">My Transactions</h2>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-muted mb-2">Total Transactions</h5>
                <h2 className="mb-0">{totalStats.total_count}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-muted mb-2">Total Amount</h5>
                <h2 className="mb-0">Tzs {Number(totalStats.total_amount || 0).toLocaleString()}</h2>
              </div>
            </div>
          </div>
        </div>

        {transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Property</th>
                  <th>Seller</th>
                  <th>Amount</th>
                  <th>Transaction Date</th>
                  <th>Payment Status</th>
                  <th>Payment Method</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>#{transaction.id}</td>
                    <td>{transaction.property.title}</td>
                    <td>{transaction.property.seller.username}</td>
                    <td>Tzs {transaction.amount}</td>
                    <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                    <td>{formatPaymentStatus(transaction.payment_status)}</td>
                    <td>{transaction.payment_method || '-'}</td>
                    <td>
                      {transaction.payment_date
                        ? new Date(transaction.payment_date).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <p className="mb-0 text-muted">You have no transactions yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerTransactions;
