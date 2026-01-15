/**
 * Dashboard Page Template
 *
 * Standard layout pattern for dashboard pages with:
 * - Page header (title + description + actions)
 * - KPI metrics grid (4 cards)
 * - Data table with filters
 * - Loading and empty states
 *
 * Features:
 * - Responsive grid layout
 * - Skeleton loaders
 * - Empty state handling
 * - Filter persistence
 * - Accessible markup
 *
 * Usage:
 * Copy this template and customize for your specific resource
 * (bookings, customers, services, etc.)
 */

import { useState, useMemo } from 'react';
import { Plus, Download, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Badge,
  cn
} from '@ideas/ui';
import { EmptyState } from '@/components/shared/EmptyState';

// ============================================================================
// Types (customize for your resource)
// ============================================================================

interface DashboardItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  value: number;
  createdAt: Date;
  // Add your specific fields
}

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: number;          // Percentage change
  changeLabel?: string;     // "vs last month"
  trend?: 'up' | 'down';
  icon?: React.ComponentType<{ className?: string }>;
}

// ============================================================================
// Component
// ============================================================================

export default function DashboardPage() {
  // ============================================================================
  // State Management
  // ============================================================================

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // ============================================================================
  // API Integration (replace with real hooks)
  // ============================================================================

  // Example: const { data, isLoading, error } = useYourResource();
  const isLoading = false;
  const error = null;

  // Mock data (replace with real API data)
  const items: DashboardItem[] = [
    {
      id: '1',
      name: 'Example Item 1',
      status: 'active',
      value: 150,
      createdAt: new Date('2025-01-15')
    },
    {
      id: '2',
      name: 'Example Item 2',
      status: 'pending',
      value: 89,
      createdAt: new Date('2025-01-10')
    },
    // Add more items...
  ];

  // ============================================================================
  // Computed Values
  // ============================================================================

  // KPI Metrics
  const metrics: DashboardMetric[] = useMemo(() => [
    {
      title: 'Total Items',
      value: items.length,
      change: 12.5,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Active',
      value: items.filter(i => i.status === 'active').length,
      change: -3.2,
      changeLabel: 'vs last week',
      trend: 'down'
    },
    {
      title: 'Total Value',
      value: `$${items.reduce((sum, i) => sum + i.value, 0).toLocaleString()}`,
      change: 8.1,
      changeLabel: 'vs last month',
      trend: 'up'
    },
    {
      title: 'Pending',
      value: items.filter(i => i.status === 'pending').length,
      trend: 'up'
    }
  ], [items]);

  // Filtered data
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      // Add date filter logic here
      const matchesDate = dateFilter === 'all' || true; // Implement your date logic

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [items, searchQuery, statusFilter, dateFilter]);

  // ============================================================================
  // Loading State
  // ============================================================================

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Metrics skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-full" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // ============================================================================
  // Error State
  // ============================================================================

  if (error) {
    return (
      <MainLayout>
        <EmptyState
          icon={Filter}
          title="Error al cargar datos"
          description="No se pudieron cargar los datos. Por favor, intenta de nuevo."
          action={{
            label: 'Reintentar',
            onClick: () => window.location.reload()
          }}
        />
      </MainLayout>
    );
  }

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ====================================================================
            Page Header
            ==================================================================== */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Dashboard Title
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and view all your dashboard items
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>

        {/* ====================================================================
            KPI Metrics Grid
            ==================================================================== */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {metric.icon && (
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {metric.value}
                </div>
                {metric.change !== undefined && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className={cn(
                      "inline-flex items-center gap-1 font-medium",
                      metric.trend === 'up' && "text-green-600",
                      metric.trend === 'down' && "text-red-600"
                    )}>
                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                      {metric.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                      {Math.abs(metric.change)}%
                    </span>
                    {metric.changeLabel && ` ${metric.changeLabel}`}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ====================================================================
            Data Table with Filters
            ==================================================================== */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Items</CardTitle>

              {/* Filter Controls */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredItems.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === 'active' ? 'default' :
                              item.status === 'pending' ? 'secondary' :
                              'outline'
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.value}
                        </TableCell>
                        <TableCell>
                          {item.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon={Filter}
                title="No items found"
                description="Try adjusting your filters or search query."
                action={{
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  },
                  variant: 'outline'
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

// ============================================================================
// Additional Notes
// ============================================================================

/**
 * CUSTOMIZATION CHECKLIST:
 *
 * 1. Replace DashboardItem type with your actual resource type
 * 2. Update API integration with real hooks (useYourResource)
 * 3. Customize metrics calculations based on your data
 * 4. Adjust table columns to match your resource fields
 * 5. Implement proper date filtering logic
 * 6. Add action handlers (edit, delete, view details)
 * 7. Update page title and description
 * 8. Customize empty state messages
 * 9. Add proper error handling
 * 10. Implement pagination if needed
 *
 * PERFORMANCE TIPS:
 *
 * - Use useMemo for expensive calculations
 * - Debounce search input if dataset is large
 * - Implement virtual scrolling for 1000+ rows
 * - Consider server-side filtering for large datasets
 *
 * ACCESSIBILITY:
 *
 * - All filters are keyboard accessible
 * - Table has proper semantic markup
 * - Screen reader announcements for data updates
 * - Focus management for modals/dialogs
 */
