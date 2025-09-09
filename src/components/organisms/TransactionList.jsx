import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const TransactionList = ({ transactions, farms, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm?.name || "All Farms";
  };

  const getTransactionIcon = (category) => {
    const iconMap = {
      "Seeds": "Sprout",
      "Fertilizer": "Zap",
      "Equipment": "Wrench",
      "Labor": "Users",
      "Utilities": "Zap",
      "Maintenance": "Settings",
      "Crop Sales": "TrendingUp",
      "Livestock Sales": "PiggyBank",
      "Equipment Sales": "Package",
      "Other Income": "Plus",
      "Other Expense": "Minus"
    };
    return iconMap[category] || "DollarSign";
  };

  const handleDelete = (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      onDelete(transactionId);
      toast.success("Transaction deleted successfully!");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="DollarSign" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No transactions found</h3>
          <p className="text-gray-500">Start by adding your first income or expense record.</p>
        </CardContent>
      </Card>
    );
  }

  // Group transactions by month
  const groupedTransactions = transactions.reduce((groups, transaction) => {
const monthKey = format(new Date(transaction.date_c || transaction.date), "yyyy-MM");
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(transaction);
    return groups;
  }, {});

  const sortedMonths = Object.keys(groupedTransactions).sort().reverse();

  return (
    <div className="space-y-6">
      {sortedMonths.map((monthKey) => {
        const monthTransactions = groupedTransactions[monthKey];
        const monthDate = new Date(monthKey + "-01");
        const monthTotal = monthTransactions.reduce((sum, t) => {
return sum + ((t.type_c || t.type) === "income" ? (t.amount_c || t.amount) : -(t.amount_c || t.amount));
        }, 0);

        return (
          <div key={monthKey}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary-700">
                {format(monthDate, "MMMM yyyy")}
              </h3>
              <div className="flex items-center space-x-4">
                <Badge variant={monthTotal >= 0 ? "success" : "error"}>
                  {monthTotal >= 0 ? "+" : ""}{formatCurrency(monthTotal)}
                </Badge>
                <Badge variant="default">
                  {monthTransactions.length} transactions
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              {monthTransactions
.sort((a, b) => new Date(b.date_c || b.date) - new Date(a.date_c || a.date))
                .map((transaction, index) => (
                <motion.div
                  key={transaction.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            (transaction.type_c || transaction.type) === "income"
                              ? "bg-gradient-to-br from-secondary-500 to-secondary-600"
                              : "bg-gradient-to-br from-accent-500 to-accent-600"
                          }`}>
                            <ApperIcon 
name={getTransactionIcon(transaction.category_c || transaction.category)} 
                              className="h-5 w-5 text-white" 
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-gray-900">
{transaction.description_c || transaction.description || transaction.category_c || transaction.category}
                              </h4>
                              <Badge variant={(transaction.type_c || transaction.type) === "income" ? "success" : "error"}>
                                {transaction.category_c || transaction.category}
                              </Badge>
                            </div>
<div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                              <ApperIcon name="Calendar" className="h-4 w-4" />
                              <span>{format(new Date(transaction.date_c || transaction.date), "MMM dd, yyyy")}</span>
                              <span className="text-gray-300">•</span>
                              <span>{getFarmName(transaction.farmId)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className={`text-right ${
                            (transaction.type_c || transaction.type) === "income" ? "text-secondary-600" : "text-accent-600"
                          }`}>
                            <div className="text-lg font-bold">
                              {(transaction.type_c || transaction.type) === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount_c || transaction.amount)}
                            </div>
                            <div className="text-xs text-gray-500 uppercase">
                              {transaction.type_c || transaction.type}
                            </div>
                          </div>
                          
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(transaction)}
                            >
                              <ApperIcon name="Edit2" className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(transaction.Id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <ApperIcon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;