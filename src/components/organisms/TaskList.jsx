import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";

const TaskList = ({ tasks, farms, crops, onToggleComplete, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm?.name || "Unknown Farm";
  };

  const getCropName = (cropId) => {
    const crop = crops.find(c => c.Id === cropId);
    return crop?.cropType || "General";
  };

  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getTaskIcon = (type) => {
    switch (type.toLowerCase()) {
      case "watering":
        return "Droplets";
      case "fertilizing":
        return "Zap";
      case "harvesting":
        return "Scissors";
      case "planting":
        return "Sprout";
      case "weeding":
        return "Trash2";
      default:
        return "CheckSquare";
    }
  };

  const handleToggleComplete = (task) => {
    onToggleComplete(task.Id);
    toast.success(task.completed ? "Task marked as incomplete" : "Task completed!");
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      onDelete(taskId);
      toast.success("Task deleted successfully!");
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && format(new Date(dueDate), "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd");
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    const date = format(new Date(task.dueDate), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedTasks).sort();

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="CheckSquare" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No tasks found</h3>
          <p className="text-gray-500">Create your first task to get started with farm management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => {
        const dateObj = new Date(date);
        const isToday = format(dateObj, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
        const isPast = isOverdue(date);
        
        return (
          <div key={date}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                isToday ? "bg-accent-500" : isPast ? "bg-red-500" : "bg-primary-500"
              }`} />
              <h3 className={`text-lg font-bold ${
                isToday ? "text-accent-700" : isPast ? "text-red-700" : "text-primary-700"
              }`}>
                {isToday ? "Today" : format(dateObj, "EEEE, MMMM d")}
                {isPast && " (Overdue)"}
              </h3>
              <Badge variant={isToday ? "warning" : isPast ? "error" : "default"}>
                {groupedTasks[date].length} tasks
              </Badge>
            </div>

            <div className="space-y-3">
              {groupedTasks[date].map((task, index) => (
                <motion.div
                  key={task.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`transition-all duration-200 ${
                    task.completed ? "opacity-60 bg-gray-50" : "hover:shadow-lg"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            task.completed
                              ? "bg-secondary-500 border-secondary-500"
                              : "border-gray-300 hover:border-secondary-500"
                          }`}
                        >
                          {task.completed && (
                            <ApperIcon name="Check" className="h-3 w-3 text-white" />
                          )}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                task.completed ? "bg-gray-300" : "bg-gradient-to-br from-primary-500 to-secondary-500"
                              }`}>
                                <ApperIcon 
                                  name={getTaskIcon(task.type)} 
                                  className="h-4 w-4 text-white" 
                                />
                              </div>
                              <div>
                                <h4 className={`font-semibold ${
                                  task.completed ? "line-through text-gray-500" : "text-gray-900"
                                }`}>
                                  {task.title}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
<span className="text-sm text-gray-500">
                                    {getFarmName(task.farm_id_c?.Id || task.farmId)}
</span>
                                  {(task.crop_id_c?.Id || task.cropId) && (
                                    <>
                                      <span className="text-gray-300">•</span>
                                      <span className="text-sm text-gray-500">
                                        {getCropName(task.crop_id_c?.Id || task.cropId)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
<Badge variant={getPriorityVariant(task.priority_c || task.priority)} className="text-xs">
                                {task.priority_c || task.priority}
                              </Badge>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(task)}
                                >
                                  <ApperIcon name="Edit2" className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(task.Id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <ApperIcon name="Trash2" className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
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

export default TaskList;