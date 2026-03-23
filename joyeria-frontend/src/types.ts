/** GET/PATCH /api/account/me */
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
}

/** GET /api/admin/stats — Admin & Employee only. */
export interface AdminDashboardStats {
  productCount: number;
  orderCount: number;
  customerCount: number;
  userCount: number;
  ordersRevenueTotal: number;
  recentOrders: RecentOrderSummary[];
}

export interface RecentOrderSummary {
  id: number;
  customerName: string;
  orderedAt: string;
  total: number;
  status?: string | null;
}

/** GET /api/admin/users — Admin only. */
export interface UserListItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

/** GET /api/admin/roles */
export interface RoleOption {
  id: number;
  name: string;
}

/** GET /api/admin/sales/summary — Admin & Employee. */
export interface SalesMonthlyPoint {
  year: number;
  month: number;
  label: string;
  revenue: number;
  orderCount: number;
}

export interface SalesSummary {
  monthly: SalesMonthlyPoint[];
  totalRevenueInRange: number;
  totalOrdersInRange: number;
  months: number;
}

/** Server-side paged list (GET /api/products, /api/orders, …). */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Mirrors API JSON (camelCase) from JoyeriaBackend */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  /** Category display name (from API `category`) */
  category: string;
  imageUrl?: string | null;
  material?: string | null;
  weight?: string | null;
  isAvailable: boolean;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderLine {
  id: number;
  orderId: number;
  productId?: number | null;
  product?: Product | null;
  quantity: number;
  unitPrice: number;
  customDescription?: string | null;
}

export interface OrderUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role?: { id: number; name: string };
  createdAt?: string;
  isActive?: boolean;
}

export interface Order {
  id: number;
  userId: number;
  user?: OrderUser;
  orderedAt: string;
  status?: string | null;
  notes?: string | null;
  total: number;
  /** Omitted or empty on lightweight list responses. */
  lines?: OrderLine[];
}
