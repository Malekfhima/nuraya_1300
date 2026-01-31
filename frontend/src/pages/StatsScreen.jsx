import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "../components/AdminLayout";
import { FaFilePdf, FaChartLine, FaUsers } from "react-icons/fa";
import { Store } from "../context/StoreContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const StatsScreen = () => {
  const [summary, setSummary] = useState({
    dailySales: [],
    dailyUsers: [],
    productsCount: 0,
    ordersCount: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get("/api/orders/summary", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSummary(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchSummary();
  }, [userInfo?.token]);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Rapport Statistique - Nuraya", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 14, 30);

    // Sales Table
    const tableColumn = ["Date", "Nombre de Commandes", "Ventes (DT)"];
    const tableRows = [];

    summary.dailySales.forEach((sale) => {
      const rowData = [
        sale._id,
        sale.count,
        `${sale.totalSales.toFixed(2)} DT`,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
      headStyles: { fillColor: [139, 115, 85] }, // --primary color
    });

    // Summary text
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 100;
    doc.setFontSize(14);
    doc.text("Résumé des Performances", 14, finalY);
    doc.setFontSize(11);
    doc.text(
      `Total des Ventes: ${summary.totalSales.toFixed(2)} DT`,
      14,
      finalY + 10,
    );
    doc.text(
      `Nombre total de Commandes: ${summary.ordersCount}`,
      14,
      finalY + 17,
    );
    doc.text(`Nombre de Produits: ${summary.productsCount}`, 14, finalY + 24);

    doc.save(`Rapport_Nuraya_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const salesData = {
    labels: summary.dailySales.map((x) => x._id),
    datasets: [
      {
        fill: true,
        label: "Ventes Journalières (DT)",
        data: summary.dailySales.map((x) => x.totalSales),
        borderColor: "#8B7355",
        backgroundColor: "rgba(139, 115, 85, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "var(--font-body)", size: 12 },
        },
      },
    },
  };

  const usersData = {
    labels: summary.dailyUsers.map((x) => x._id),
    datasets: [
      {
        label: "Nouveaux Utilisateurs",
        data: summary.dailyUsers.map((x) => x.count),
        backgroundColor: "#2C2C2C",
      },
    ],
  };

  return (
    <AdminLayout activePage="stats">
      <header className="admin-header">
          <h1>Statistiques Avancées</h1>
          <button className="btn btn-primary" onClick={exportPDF}>
            <FaFilePdf style={{ marginRight: "10px" }} /> Exporter PDF
          </button>
        </header>

        {loading ? (
          <p className="text-center">Analyse des données en cours...</p>
        ) : (
          <div className="stats-container">
            <div className="stats-charts-row">
              <div className="chart-card">
                <h3>
                  <FaChartLine
                    style={{ marginRight: "10px", color: "var(--primary)" }}
                  />{" "}
                  Volume des Ventes
                </h3>
                <div className="chart-wrapper">
                  <Line data={salesData} options={chartOptions} />
                </div>
              </div>
              <div className="chart-card">
                <h3>
                  <FaUsers
                    style={{ marginRight: "10px", color: "var(--primary)" }}
                  />{" "}
                  Croissance Utilisateurs
                </h3>
                <div className="chart-wrapper">
                  <Bar data={usersData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="report-preview report-card-full">
              <h3 style={{ marginBottom: "2rem" }}>Dernières Transactions</h3>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Commandes</th>
                      <th>Ventes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.dailySales.slice(-5).map((sale) => (
                      <tr key={sale._id}>
                        <td>{sale._id}</td>
                        <td>{sale.count}</td>
                        <td>{sale.totalSales.toFixed(2)} DT</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default StatsScreen;
