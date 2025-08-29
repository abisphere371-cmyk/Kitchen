export interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: 'admin' | 'kitchen_staff' | 'inventory_manager' | 'delivery_staff'
  phone?: string
  created_at: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  min_threshold: number
  max_threshold: number
  supplier_id?: string
  expiry_date?: string
  cost_per_unit: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  status: 'pending' | 'cooking' | 'ready' | 'delivered' | 'cancelled'
  total_amount: number
  items: OrderItem[]
  assigned_staff_id?: string
  delivery_address?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  recipe_id: string
  quantity: number
  unit_price: number
  recipe?: Recipe
}

export interface Recipe {
  id: string
  name: string
  description?: string
  category: string
  price: number
  prep_time: number
  ingredients: RecipeIngredient[]
  instructions?: string
  image_url?: string
  is_available: boolean
  created_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  inventory_item_id: string
  quantity_needed: number
  inventory_item?: InventoryItem
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address?: string
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  contact_person: string
  email?: string
  phone: string
  address?: string
  category: string
  created_at: string
}

export interface StockMovement {
  id: string
  inventory_item_id: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason: string
  reference_id?: string
  staff_id: string
  created_at: string
  inventory_item?: InventoryItem
  staff?: User
}