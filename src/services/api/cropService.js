class CropService {
  constructor() {
    this.tableName = 'crop_c';
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
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_type_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
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
      return response.data.map(crop => ({
        Id: crop.Id,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c,
        cropType: crop.crop_type_c || crop.Name,
        field: crop.field_c || '',
        plantingDate: crop.planting_date_c || new Date().toISOString(),
        expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
        status: crop.status_c || 'Planned',
        notes: crop.notes_c || ''
      }));
    } catch (error) {
      console.error("Error fetching crops:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_type_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const crop = response.data;
      return {
        Id: crop.Id,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c,
        cropType: crop.crop_type_c || crop.Name,
        field: crop.field_c || '',
        plantingDate: crop.planting_date_c || new Date().toISOString(),
        expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
        status: crop.status_c || 'Planned',
        notes: crop.notes_c || ''
      };
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw error;
    }
  }

  async create(cropData) {
    try {
      const params = {
        records: [{
          Name: cropData.cropType,
          farm_id_c: parseInt(cropData.farmId),
          crop_type_c: cropData.cropType,
          field_c: cropData.field,
          planting_date_c: cropData.plantingDate,
          expected_harvest_c: cropData.expectedHarvest,
          status_c: cropData.status,
          notes_c: cropData.notes
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
          console.error(`Failed to create crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            farmId: crop.farm_id_c?.Id || crop.farm_id_c,
            cropType: crop.crop_type_c || crop.Name,
            field: crop.field_c || '',
            plantingDate: crop.planting_date_c || new Date().toISOString(),
            expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
            status: crop.status_c || 'Planned',
            notes: crop.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.cropType,
          farm_id_c: parseInt(cropData.farmId),
          crop_type_c: cropData.cropType,
          field_c: cropData.field,
          planting_date_c: cropData.plantingDate,
          expected_harvest_c: cropData.expectedHarvest,
          status_c: cropData.status,
          notes_c: cropData.notes
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
          console.error(`Failed to update crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            farmId: crop.farm_id_c?.Id || crop.farm_id_c,
            cropType: crop.crop_type_c || crop.Name,
            field: crop.field_c || '',
            plantingDate: crop.planting_date_c || new Date().toISOString(),
            expectedHarvest: crop.expected_harvest_c || new Date().toISOString(),
            status: crop.status_c || 'Planned',
            notes: crop.notes_c || ''
          };
        }
      }
    } catch (error) {
      console.error("Error updating crop:", error);
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
          console.error(`Failed to delete crops ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
}

export default new CropService();

export default new CropService();