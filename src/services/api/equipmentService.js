class EquipmentService {
  constructor() {
    this.tableName = 'equipment_c';
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
          { field: { Name: "type_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "purchase_price_c" } },
          { field: { Name: "current_value_c" } },
          { field: { Name: "maintenance_schedule_c" } },
          { field: { Name: "operating_hours_c" } },
          { field: { Name: "fuel_type_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_maintenance_c" } },
          { field: { Name: "next_maintenance_c" } }
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
      return response.data.map(equipment => ({
        Id: equipment.Id,
        name: equipment.name_c || equipment.Name,
        type: equipment.type_c || '',
        brand: equipment.brand_c || '',
        model: equipment.model_c || '',
        year: equipment.year_c || new Date().getFullYear(),
        status: equipment.status_c || 'Active',
        farmId: equipment.farm_id_c?.Id || equipment.farm_id_c,
        purchasePrice: equipment.purchase_price_c || 0,
        currentValue: equipment.current_value_c || 0,
        maintenanceSchedule: equipment.maintenance_schedule_c || '',
        operatingHours: equipment.operating_hours_c || 0,
        fuelType: equipment.fuel_type_c || 'Diesel',
        specifications: equipment.specifications_c || '',
        createdAt: equipment.created_at_c || equipment.CreatedOn,
        lastMaintenance: equipment.last_maintenance_c || null,
        nextMaintenance: equipment.next_maintenance_c || null
      }));
    } catch (error) {
      console.error("Error fetching equipment:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "brand_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "purchase_price_c" } },
          { field: { Name: "current_value_c" } },
          { field: { Name: "maintenance_schedule_c" } },
          { field: { Name: "operating_hours_c" } },
          { field: { Name: "fuel_type_c" } },
          { field: { Name: "specifications_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "last_maintenance_c" } },
          { field: { Name: "next_maintenance_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const equipment = response.data;
      return {
        Id: equipment.Id,
        name: equipment.name_c || equipment.Name,
        type: equipment.type_c || '',
        brand: equipment.brand_c || '',
        model: equipment.model_c || '',
        year: equipment.year_c || new Date().getFullYear(),
        status: equipment.status_c || 'Active',
        farmId: equipment.farm_id_c?.Id || equipment.farm_id_c,
        purchasePrice: equipment.purchase_price_c || 0,
        currentValue: equipment.current_value_c || 0,
        maintenanceSchedule: equipment.maintenance_schedule_c || '',
        operatingHours: equipment.operating_hours_c || 0,
        fuelType: equipment.fuel_type_c || 'Diesel',
        specifications: equipment.specifications_c || '',
        createdAt: equipment.created_at_c || equipment.CreatedOn,
        lastMaintenance: equipment.last_maintenance_c || null,
        nextMaintenance: equipment.next_maintenance_c || null
      };
    } catch (error) {
      console.error(`Error fetching equipment with ID ${id}:`, error);
      throw error;
    }
  }

  async create(equipmentData) {
    try {
      const params = {
        records: [{
          Name: equipmentData.name,
          name_c: equipmentData.name,
          type_c: equipmentData.type,
          brand_c: equipmentData.brand,
          model_c: equipmentData.model,
          year_c: parseInt(equipmentData.year),
          status_c: equipmentData.status,
          farm_id_c: equipmentData.farmId ? parseInt(equipmentData.farmId) : null,
          purchase_price_c: equipmentData.purchasePrice ? parseFloat(equipmentData.purchasePrice) : null,
          current_value_c: equipmentData.currentValue ? parseFloat(equipmentData.currentValue) : null,
          maintenance_schedule_c: equipmentData.maintenanceSchedule,
          operating_hours_c: equipmentData.operatingHours ? parseInt(equipmentData.operatingHours) : null,
          fuel_type_c: equipmentData.fuelType,
          specifications_c: equipmentData.specifications,
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
          console.error(`Failed to create equipment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const equipment = successfulRecords[0].data;
          return {
            Id: equipment.Id,
            name: equipment.name_c || equipment.Name,
            type: equipment.type_c || '',
            brand: equipment.brand_c || '',
            model: equipment.model_c || '',
            year: equipment.year_c || new Date().getFullYear(),
            status: equipment.status_c || 'Active',
            farmId: equipment.farm_id_c?.Id || equipment.farm_id_c,
            purchasePrice: equipment.purchase_price_c || 0,
            currentValue: equipment.current_value_c || 0,
            maintenanceSchedule: equipment.maintenance_schedule_c || '',
            operatingHours: equipment.operating_hours_c || 0,
            fuelType: equipment.fuel_type_c || 'Diesel',
            specifications: equipment.specifications_c || '',
            createdAt: equipment.created_at_c || equipment.CreatedOn,
            lastMaintenance: equipment.last_maintenance_c || null,
            nextMaintenance: equipment.next_maintenance_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
      throw error;
    }
  }

  async update(id, equipmentData) {
    try {
      const updateData = {
        Id: parseInt(id),
        Name: equipmentData.name,
        name_c: equipmentData.name,
        type_c: equipmentData.type,
        brand_c: equipmentData.brand,
        model_c: equipmentData.model,
        year_c: parseInt(equipmentData.year),
        status_c: equipmentData.status,
        maintenance_schedule_c: equipmentData.maintenanceSchedule,
        fuel_type_c: equipmentData.fuelType,
        specifications_c: equipmentData.specifications
      };

      if (equipmentData.farmId) {
        updateData.farm_id_c = parseInt(equipmentData.farmId);
      }

      if (equipmentData.purchasePrice) {
        updateData.purchase_price_c = parseFloat(equipmentData.purchasePrice);
      }

      if (equipmentData.currentValue) {
        updateData.current_value_c = parseFloat(equipmentData.currentValue);
      }

      if (equipmentData.operatingHours) {
        updateData.operating_hours_c = parseInt(equipmentData.operatingHours);
      }

      const params = {
        records: [updateData]
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
          console.error(`Failed to update equipment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const equipment = successfulRecords[0].data;
          return {
            Id: equipment.Id,
            name: equipment.name_c || equipment.Name,
            type: equipment.type_c || '',
            brand: equipment.brand_c || '',
            model: equipment.model_c || '',
            year: equipment.year_c || new Date().getFullYear(),
            status: equipment.status_c || 'Active',
            farmId: equipment.farm_id_c?.Id || equipment.farm_id_c,
            purchasePrice: equipment.purchase_price_c || 0,
            currentValue: equipment.current_value_c || 0,
            maintenanceSchedule: equipment.maintenance_schedule_c || '',
            operatingHours: equipment.operating_hours_c || 0,
            fuelType: equipment.fuel_type_c || 'Diesel',
            specifications: equipment.specifications_c || '',
            createdAt: equipment.created_at_c || equipment.CreatedOn,
            lastMaintenance: equipment.last_maintenance_c || null,
            nextMaintenance: equipment.next_maintenance_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
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
          console.error(`Failed to delete equipment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      throw error;
    }
  }
}

export default new EquipmentService();