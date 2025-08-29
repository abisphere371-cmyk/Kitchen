import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  DollarSign
} from 'lucide-react'

interface DashboardStats {
  totalInventoryItems: number
  lowStockItems: number
  pendingOrders: number
  totalStaff: number
  todayRevenue: number
  completedOrdersToday: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalInventoryItems: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    totalStaff: 0,
    todayRevenue: 0,
    completedOrdersToday: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch inventory stats
      const { data: inventoryData } = await supabase
        .from('inventory_items')
        .select('quantity, min_threshold')

      const totalInventoryItems = inventoryData?.length || 0
      const lowStockItems = inventoryData?.filter(item => item.quantity <= item.min_threshold).length || 0

      // Fetch order stats
      const { data: ordersData } = await supabase
        .from('orders')
        .select('status, total_amount, created_at')

      const pendingOrders = ordersData?.filter(order => 
        ['pending', 'cooking', 'ready'].includes(order.status)
      ).length || 0

      const today = new Date().toISOString().split('T')[0]
      const todayOrders = ordersData?.filter(order => 
        order.created_at.startsWith(today)
      ) || []

      const completedOrdersToday = todayOrders.filter(order => 
        order.status === 'delivered'
      ).length

      const todayRevenue = todayOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0)

      // Fetch staff stats
      const { data: staffData } = await supabase
        .from('staff_members')
        .select('id')

      const totalStaff = staffData?.length || 0

      setStats({
        totalInventoryItems,
        lowStockItems,
        pendingOrders,
        totalStaff,
        todayRevenue,
        completedOrdersToday
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Inventory Items',
      value: stats.totalInventoryItems,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Low Stock Alerts',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      name: 'Total Staff',
      value: stats.totalStaff,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      name: 'Orders Completed Today',
      value: stats.completedOrdersToday,
      icon: CheckCircle,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening at Abisphere Kitchen today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className={`${stat.bgColor} overflow-hidden rounded-lg`}>
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${stat.textColor} truncate`}>
                        {stat.name}
                      </dt>
                      <dd className={`text-lg font-semibold ${stat.textColor}`}>
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {user?.role === 'admin' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                <Package className="mr-2 h-4 w-4" />
                Add Inventory
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <ShoppingCart className="mr-2 h-4 w-4" />
                New Order
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                <Users className="mr-2 h-4 w-4" />
                Add Staff
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {stats.lowStockItems > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Low Stock Alert
              </h3>
              <p className="mt-1 text-sm text-red-700">
                {stats.lowStockItems} items are running low on stock. Check inventory for details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}