"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/models/Product";
import { Spinner } from "../ui/spinner";

interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  recentProducts: IProduct[];
  unreadMessages: number; 
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        

        const [productsRes, messagesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/messages?read=false"),
        ]);
        const productsData = await productsRes.json();
        const messagesData = await messagesRes.json();
        const products: IProduct[] = productsData.products ?? [];

        setStats({
          totalProducts: products.length,
          inStockProducts: products.filter((p) => p.inStock).length,
          outOfStockProducts: products.filter((p) => !p.inStock).length,
          recentProducts: products.slice(0, 5),
          unreadMessages: messagesData.messages?.length ?? 0, // ← add this
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Spinner/>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Failed to load dashboard data.
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: `${stats.inStockProducts} in stock`,
      icon: Package,
      href: "/admin/products",
      alert: false,
    },

    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      description: "Items needing restock",
      icon: TrendingUp,
      href: "/admin/products",
      alert: stats.outOfStockProducts > 0,
    },
    {
      title: "Messages",
      value: stats.unreadMessages, 
      description:
        stats.unreadMessages === 1 ? "Unread inquiry" : "Unread inquiries", 
      icon: MessageSquare,
      href: "/admin/messages",
      alert: stats.unreadMessages > 0, 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="relative">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                  {stat.alert && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products in your catalog</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProducts.map((product) => (
                <div
                  key={String(product._id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.featured ? "Featured" : "Standard"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs ${
                        product.inStock ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                Manage Products
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/admin/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/" target="_blank">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Live Site
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Out of Stock Alert */}
      {stats.outOfStockProducts > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-foreground">
                {stats.outOfStockProducts} product
                {stats.outOfStockProducts > 1 ? "s" : ""} out of stock
              </p>
              <p className="text-sm text-muted-foreground">
                Consider restocking these items to avoid missing sales.
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link href="/admin/products">View Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
