"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import AuthGuard from "@/components/auth/AuthGuard";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

export default function RootPage() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <AuthGuard>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              {/* Ecommerce Metrics */}
              <div className="xl:col-span-3">
                <EcommerceMetrics />
              </div>

              {/* Monthly Target */}
              <div className="xl:col-span-1">
                <MonthlyTarget />
              </div>

              {/* Monthly Sales Chart */}
              <div className="xl:col-span-2">
                <MonthlySalesChart />
              </div>

              {/* Statistics Chart */}
              <div className="xl:col-span-2">
                <StatisticsChart />
              </div>

              {/* Recent Orders */}
              <div className="xl:col-span-1">
                <RecentOrders />
              </div>

              {/* Demographic Card */}
              <div className="xl:col-span-3">
                <DemographicCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
