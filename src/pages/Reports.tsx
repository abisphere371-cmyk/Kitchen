import React from 'react'
import { BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react'

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          View detailed reports and analytics for your kitchen operations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Revenue Analytics</h3>
          </div>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Revenue charts and analytics coming soon</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Inventory Reports</h3>
          </div>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Inventory analytics coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}