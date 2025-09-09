import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const CropTable = ({ crops, farms, onEdit, onDelete }) => {
  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm?.name || "Unknown Farm";
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "growing":
        return "success";
      case "harvested":
        return "primary";
      case "planned":
        return "warning";
      default:
        return "default";
    }
  };

  const handleDelete = (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
      onDelete(cropId);
      toast.success("Crop deleted successfully!");
    }
  };

  if (crops.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <ApperIcon name="Sprout" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No crops found</h3>
        <p className="text-gray-500">Start by adding your first crop to track its progress.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-surface border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Crop</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Farm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Field</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Planted</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Expected Harvest</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {crops.map((crop, index) => (
                <motion.tr
                  key={crop.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Sprout" className="h-5 w-5 text-white" />
                      </div>
                      <div>
<p className="font-semibold text-gray-900">{crop.crop_type_c || crop.cropType}</p>
                        <p className="text-sm text-gray-500">ID: {crop.Id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
{getFarmName(crop.farm_id_c?.Id || crop.farmId)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
{crop.field_c || crop.field}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
{format(new Date(crop.planting_date_c || crop.plantingDate), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
{format(new Date(crop.expected_harvest_c || crop.expectedHarvest), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4">
<Badge variant={getStatusVariant(crop.status_c || crop.status)}>
                      {crop.status_c || crop.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(crop)}
                      >
                        <ApperIcon name="Edit2" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(crop.Id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {crops.map((crop, index) => (
          <motion.div
            key={crop.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sprout" className="h-5 w-5 text-white" />
                </div>
                <div>
<p className="font-semibold text-gray-900">{crop.crop_type_c || crop.cropType}</p>
                  <p className="text-sm text-gray-500">{getFarmName(crop.farm_id_c?.Id || crop.farmId)}</p>
                </div>
              </div>
<Badge variant={getStatusVariant(crop.status_c || crop.status)}>
                {crop.status_c || crop.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Field</p>
<p className="font-medium">{crop.field_c || crop.field}</p>
              </div>
              <div>
                <p className="text-gray-500">Planted</p>
<p className="font-medium">{format(new Date(crop.planting_date_c || crop.plantingDate), "MMM dd")}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Expected Harvest</p>
<p className="font-medium">{format(new Date(crop.expected_harvest_c || crop.expectedHarvest), "MMM dd, yyyy")}</p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(crop)}
                className="flex-1"
              >
                <ApperIcon name="Edit2" className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(crop.Id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CropTable;