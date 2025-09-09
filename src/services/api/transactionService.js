class TransactionService {
  constructor() {
    this.tableName = 'transaction_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || '',
        amount: transaction.amount_c || 0,
        date: transaction.date_c || new Date().toISOString(),
        description: transaction.description_c || '',
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const transaction = response.data;
      return {
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || '',
        amount: transaction.amount_c || 0,
        date: transaction.date_c || new Date().toISOString(),
        description: transaction.description_c || '',
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      };
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      throw error;
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: `${transactionData.category} - ${transactionData.amount}`,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: parseFloat(transactionData.amount),
          date_c: transactionData.date,
          description_c: transactionData.description,
          farm_id_c: parseInt(transactionData.farmId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c || 'expense',
            category: transaction.category_c || '',
            amount: transaction.amount_c || 0,
            date: transaction.date_c || new Date().toISOString(),
            description: transaction.description_c || '',
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${transactionData.category} - ${transactionData.amount}`,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: parseFloat(transactionData.amount),
          date_c: transactionData.date,
          description_c: transactionData.description,
          farm_id_c: parseInt(transactionData.farmId)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c || 'expense',
            category: transaction.category_c || '',
            amount: transaction.amount_c || 0,
            date: transaction.date_c || new Date().toISOString(),
            description: transaction.description_c || '',
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
          };
        }
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }

  async exportData(startDate, endDate) {
    try {
      let params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      if (startDate || endDate) {
        params.where = [];
        if (startDate) {
          params.where.push({
            FieldName: "date_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [startDate]
          });
        }
        if (endDate) {
          params.where.push({
            FieldName: "date_c",
            Operator: "LessThanOrEqualTo", 
            Values: [endDate]
          });
        }
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c || 'expense',
        category: transaction.category_c || '',
        amount: transaction.amount_c || 0,
        date: transaction.date_c || new Date().toISOString(),
        description: transaction.description_c || '',
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      }));
    } catch (error) {
      console.error("Error exporting transactions:", error);
      throw error;
    }
  }
}

export default new TransactionService();
export default new TransactionService();