"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  Search,
  Package,
} from "lucide-react";

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

interface FormData {
  name: string;
  description: string;
}

const EMPTY_FORM: FormData = { name: "", description: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null,
  );
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Load ──────────────────────────────────────────────────────────────────
  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  // ── Dialog helpers ────────────────────────────────────────────────────────
  function openAddDialog() {
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(category: ICategory) {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setFormError(null);
    setIsDialogOpen(true);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Category name is required.");
      return;
    }

    try {
      setSaving(true);

      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong.");
        return;
      }

      setIsDialogOpen(false);
      await loadCategories();
    } catch (err) {
      console.error("Save category error:", err);
      setFormError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteConfirmId) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/categories/${deleteConfirmId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Failed to delete category.");
        return;
      }

      setDeleteConfirmId(null);
      await loadCategories();
    } catch (err) {
      console.error("Delete category error:", err);
    } finally {
      setDeleting(false);
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalProducts = categories.reduce(
    (acc, cat) => acc + (cat.productCount ?? 0),
    0,
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Categories
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Products / Category
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0
                ? (totalProducts / categories.length).toFixed(1)
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading categories…
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FolderOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground md:hidden">
                              {category.description.slice(0, 30)}
                              {category.description.length > 30 ? "…" : ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {category.description || (
                          <span className="italic">No description</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                          <Package className="h-3 w-3" />
                          {category.productCount ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteConfirmId(category._id)}
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Engine Parts"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Brief description of the category"
                rows={3}
              />
            </div>
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving…"
                  : editingCategory
                    ? "Save Changes"
                    : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this category? Products in this
            category will be unlinked but not deleted.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
