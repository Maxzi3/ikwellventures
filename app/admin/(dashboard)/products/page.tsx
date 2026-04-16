"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  Package,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { IProduct } from "@/models/Product";

interface PopulatedCategory {
  _id: string;
  name: string;
  slug: string;
}

type ProductWithCategory = Omit<IProduct, "category"> & {
  _id: string;
  category: PopulatedCategory | null;
};

interface FormState {
  name: string;
  description: string;
  partNumber: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  imageFile: File | null;
  existingImageUrl: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  partNumber: "",
  category: "",
  inStock: true,
  featured: false,
  imageFile: null,
  existingImageUrl: "",
};

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<PopulatedCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>("");
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadProducts(p = page, q = searchQuery) {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams({
        page: String(p),
        limit: String(PAGE_SIZE),
        ...(q ? { search: q } : {}),
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalCount(data.total ?? 0);
    } catch (err) {
      console.error("Failed to load products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Debounce search: reset to page 1 when query changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      loadProducts(1, searchQuery);
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    loadProducts(page, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function openAddDialog() {
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setIsNewProduct(true);
    setEditingId(null);
    setError(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(product: ProductWithCategory) {
    setForm({
      name: product.name,
      description: product.description ?? "",
      partNumber: product.partNumber ?? "",
      category: product.category?._id ?? "",
      inStock: product.inStock,
      featured: product.featured,
      imageFile: null,
      existingImageUrl: product.image ?? "",
    });
    setImagePreview(product.image || null);
    setIsNewProduct(false);
    setEditingId(product._id);
    setError(null);
    setIsDialogOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
    if (file) setImagePreview(URL.createObjectURL(file));
    // Reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleRemoveImage() {
    setForm((prev) => ({ ...prev, imageFile: null, existingImageUrl: "" }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    setError(null);

    if (!form.name.trim() || !form.partNumber.trim()) {
      setError("Product name and part number are required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("partNumber", form.partNumber.trim());
      formData.append("category", form.category);
      formData.append("inStock", String(form.inStock));
      formData.append("featured", String(form.featured));
      if (form.imageFile) formData.append("image", form.imageFile);
      // Signal image removal when no file and no existing URL
      if (!form.imageFile && !form.existingImageUrl) {
        formData.append("removeImage", "true");
      }

      const url = isNewProduct ? "/api/products" : `/api/products/${editingId}`;
      const method = isNewProduct ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setIsDialogOpen(false);
      toast.success(
        isNewProduct
          ? "Product added successfully"
          : "Product updated successfully",
      );
      await loadProducts(page, searchQuery);
    } catch (err) {
      console.error("Save product error:", err);
      toast.error("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  function promptDelete(product: ProductWithCategory) {
    setDeletingId(product._id);
    setDeletingName(product.name);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/products/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        toast.error("Failed to delete product");
        return;
      }
      setProducts((prev) => prev.filter((p) => p._id !== deletingId));
      setTotalCount((c) => c - 1);
      toast.success(`"${deletingName}" deleted`);
      setDeleteDialogOpen(false);
      // Reload if page is now empty
      await loadProducts(page, searchQuery);
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Network error — please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const startIndex = (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription className="mt-1">
                {loadingProducts
                  ? "Loading…"
                  : totalCount > 0
                    ? `Showing ${startIndex}–${endIndex} of ${totalCount} product${totalCount !== 1 ? "s" : ""}`
                    : "No products found"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingProducts ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading products…
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or add a new product.
              </p>
            </div>
          ) : (
            <>
              {/* Table — no horizontal overflow; columns are sized to fit */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-full">Product</TableHead>
                    <TableHead className="whitespace-nowrap hidden sm:table-cell">
                      Part #
                    </TableHead>
                    <TableHead className="whitespace-nowrap hidden md:table-cell">
                      Category
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id}>
                      {/* Product name + image */}
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[160px] sm:max-w-xs">
                              {product.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 mt-0.5">
                              {product.featured && (
                                <Badge variant="secondary" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                              {/* Show part # inline on mobile */}
                              <span className="text-xs text-muted-foreground font-mono sm:hidden">
                                {product.partNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-sm whitespace-nowrap hidden sm:table-cell">
                        {product.partNumber || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap hidden md:table-cell">
                        {product.category?.name ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={product.inStock ? "default" : "destructive"}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => promptDelete(product)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {isNewProduct ? "Add New Product" : "Edit Product"}
            </DialogTitle>
            <DialogDescription>
              {isNewProduct
                ? "Fill in the details for the new product."
                : "Make changes to the product details."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={120}
                    height={120}
                    className="rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload an image
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change image
                </Button>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            {/* Part Number + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="partNumber">Part Number</Label>
                <Input
                  id="partNumber"
                  value={form.partNumber}
                  placeholder="e.g. IKW-001"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, partNumber: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.inStock}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      inStock: checked as boolean,
                    }))
                  }
                />
                <span className="text-sm">In Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={form.featured}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      featured: checked as boolean,
                    }))
                  }
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter className="shrink-0 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? "Saving…"
                : isNewProduct
                  ? "Add Product"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                &quot;{deletingName}&quot;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
