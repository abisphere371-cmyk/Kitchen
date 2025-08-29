import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Order } from '../types'
import { Truck, MapPin, Clock, CheckCircle } from 'lucide-react'

export default function Delivery() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeliveryOrders()
  }, [])

  const fetchDeliveryOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (name, phone, address),
          order_items (
            *,
            recipes (name)
          )
        `)
        .in('status', ['ready', 'delivered'])
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching delivery orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error
      
      // Refresh orders
      fetchDeliveryOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-yellow-100 text-yellow-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  const readyOrders = orders.filter(o => o.status === 'ready')
  const deliveredOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track deliveries and manage order fulfillment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ready for Delivery */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Ready for Delivery ({readyOrders.length})
            </h3>
            <div className="space-y-4">
              {readyOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">₹{order.total_amount}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)} capitalize`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-2 h-4 w-4" />
                      {order.customers?.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      {order.customers?.phone}
                    </div>
                    {order.delivery_address && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{order.delivery_address}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Mark as Delivered
                  </button>
                </div>
              ))}

              {readyOrders.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No orders ready for delivery</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Recent Deliveries
            </h3>
            <div className="space-y-4">
              {deliveredOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">₹{order.total_amount}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)} capitalize`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-2 h-4 w-4" />
                      {order.customers?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Delivered on {new Date(order.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {deliveredOrders.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No recent deliveries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}