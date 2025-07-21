import React, { useState } from 'react';
import { Table } from '../types';
import { mockTables } from '../data/mockData';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const Tables: React.FC = () => {
  const [tables, setTables] = useState(mockTables);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const sections = Array.from(new Set(tables.map(t => t.section).filter(Boolean)));

  // Filter tables
  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         table.number.toString().includes(searchTerm);
    const matchesSection = selectedSection === 'all' || table.section === selectedSection;
    const matchesStatus = selectedStatus === 'all' || table.status === selectedStatus;
    return matchesSearch && matchesSection && matchesStatus && table.isActive;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="text-green-600" />;
      case 'occupied': return <XCircle size={16} className="text-red-600" />;
      case 'reserved': return <Clock size={16} className="text-yellow-600" />;
      case 'cleaning': return <AlertCircle size={16} className="text-gray-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cleaning': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const TableForm: React.FC<{ table?: Table; onSave: (table: Table) => void; onCancel: () => void }> = ({
    table,
    onSave,
    onCancel,
  }) => {
    const [formData, setFormData] = useState({
      number: table?.number || 0,
      name: table?.name || '',
      capacity: table?.capacity || 4,
      section: table?.section || '',
      status: table?.status || 'available' as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newTable: Table = {
        id: table?.id || Date.now().toString(),
        ...formData,
        branchId: table?.branchId || '1',
        isActive: true,
        createdAt: table?.createdAt || new Date().toISOString(),
      };
      onSave(newTable);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-semibold mb-6">
              {table ? 'Edit Table' : 'Add New Table'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="e.g., Table 1, VIP Table A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Main Dining, Terrace, VIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {table ? 'Update' : 'Create'} Table
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveTable = (table: Table) => {
    if (editingTable) {
      setTables(tables.map(t => t.id === table.id ? table : t));
    } else {
      setTables([...tables, table]);
    }
    setShowForm(false);
    setEditingTable(null);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setShowForm(true);
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      setTables(tables.filter(t => t.id !== tableId));
    }
  };

  const handleStatusChange = (tableId: string, newStatus: Table['status']) => {
    setTables(tables.map(t => 
      t.id === tableId ? { ...t, status: newStatus } : t
    ));
  };

  // Statistics
  const totalTables = tables.filter(t => t.isActive).length;
  const availableTables = tables.filter(t => t.status === 'available' && t.isActive).length;
  const occupiedTables = tables.filter(t => t.status === 'occupied' && t.isActive).length;
  const totalCapacity = tables.filter(t => t.isActive).reduce((sum, t) => sum + t.capacity, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-gray-600">Manage restaurant tables and seating arrangements</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Table
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalTables}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <MapPin size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{availableTables}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{occupiedTables}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalCapacity}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTables.map((table) => (
          <div key={table.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{table.name}</h3>
                <p className="text-sm text-gray-600">Table #{table.number}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTable(table)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Capacity:</span>
                <div className="flex items-center space-x-1">
                  <Users size={14} className="text-gray-500" />
                  <span className="text-sm font-medium">{table.capacity}</span>
                </div>
              </div>

              {table.section && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Section:</span>
                  <span className="text-sm font-medium">{table.section}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(table.status)}
                  <select
                    value={table.status}
                    onChange={(e) => handleStatusChange(table.id, e.target.value as Table['status'])}
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(table.status)}`}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Form Modal */}
      {showForm && (
        <TableForm
          table={editingTable || undefined}
          onSave={handleSaveTable}
          onCancel={() => {
            setShowForm(false);
            setEditingTable(null);
          }}
        />
      )}
    </div>
  );
};