class FarmService {
  constructor() {
    this.tableName = 'farm_c';
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
          { field: { Name: "name_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c || 0,
        sizeUnit: farm.size_unit_c || 'acres',
        location: farm.location_c || '',
        createdAt: farm.created_at_c || farm.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c || 0,
        sizeUnit: farm.size_unit_c || 'acres',
        location: farm.location_c || '',
        createdAt: farm.created_at_c || farm.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching farm with ID ${id}:`, error);
      throw error;
    }
  }

  async create(farmData) {
    try {
      const params = {
        records: [{
          Name: farmData.name,
          name_c: farmData.name,
          size_c: parseFloat(farmData.size),
          size_unit_c: farmData.sizeUnit,
          location_c: farmData.location,
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create farms ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const farm = successfulRecords[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c || farm.Name,
            size: farm.size_c || 0,
            sizeUnit: farm.size_unit_c || 'acres',
            location: farm.location_c || '',
            createdAt: farm.created_at_c || farm.CreatedOn
          };
        }
      }
    } catch (error) {
      console.error("Error creating farm:", error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name,
          name_c: farmData.name,
          size_c: parseFloat(farmData.size),
          size_unit_c: farmData.sizeUnit,
          location_c: farmData.location
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
          console.error(`Failed to update farms ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const farm = successfulRecords[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c || farm.Name,
            size: farm.size_c || 0,
            sizeUnit: farm.size_unit_c || 'acres',
            location: farm.location_c || '',
            createdAt: farm.created_at_c || farm.CreatedOn
          };
        }
      }
    } catch (error) {
      console.error("Error updating farm:", error);
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
          console.error(`Failed to delete farms ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting farm:", error);
      throw error;
    }
  }
}

export default new FarmService();
export default new FarmService();