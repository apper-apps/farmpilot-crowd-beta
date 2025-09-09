class TaskService {
  constructor() {
    this.tableName = 'task_c';
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
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_date_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name,
        type: task.type_c || 'Other',
        dueDate: task.due_date_c || new Date().toISOString(),
        priority: task.priority_c || 'Medium',
        completed: task.completed_c || false,
        completedDate: task.completed_date_c || null,
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "completed_date_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name,
        type: task.type_c || 'Other',
        dueDate: task.due_date_c || new Date().toISOString(),
        priority: task.priority_c || 'Medium',
        completed: task.completed_c || false,
        completedDate: task.completed_date_c || null,
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c || null
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          type_c: taskData.type,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: false,
          completed_date_c: null,
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
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
          console.error(`Failed to create tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name,
            type: task.type_c || 'Other',
            dueDate: task.due_date_c || new Date().toISOString(),
            priority: task.priority_c || 'Medium',
            completed: task.completed_c || false,
            completedDate: task.completed_date_c || null,
            farmId: task.farm_id_c?.Id || task.farm_id_c,
            cropId: task.crop_id_c?.Id || task.crop_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title,
        title_c: taskData.title,
        type_c: taskData.type,
        due_date_c: taskData.dueDate,
        priority_c: taskData.priority,
        completed_c: taskData.completed,
        farm_id_c: parseInt(taskData.farmId)
      };

      if (taskData.cropId) {
        updateData.crop_id_c = parseInt(taskData.cropId);
      }

      if (taskData.completedDate) {
        updateData.completed_date_c = taskData.completedDate;
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
          console.error(`Failed to update tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name,
            type: task.type_c || 'Other',
            dueDate: task.due_date_c || new Date().toISOString(),
            priority: task.priority_c || 'Medium',
            completed: task.completed_c || false,
            completedDate: task.completed_date_c || null,
            farmId: task.farm_id_c?.Id || task.farm_id_c,
            cropId: task.crop_id_c?.Id || task.crop_id_c || null
          };
        }
      }
    } catch (error) {
      console.error("Error updating task:", error);
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
          console.error(`Failed to delete tasks ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          return false;
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();