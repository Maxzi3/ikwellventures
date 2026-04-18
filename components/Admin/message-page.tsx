"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Mail,
  Calendar,
  CheckCircle,
  Circle,
  Trash2,
  Loader2,
  Phone,
} from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages);
    } catch (err) {
      setError("Could not load messages. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function openMessage(message: ContactMessage) {
    setSelectedMessage(message);
    // Auto-marks as read on the server via GET /api/messages/[id]
    if (!message.read) {
      try {
        const res = await fetch(`/api/messages/${message._id}`);
        if (res.ok) {
          setMessages((prev) =>
            prev.map((m) => (m._id === message._id ? { ...m, read: true } : m)),
          );
          setSelectedMessage({ ...message, read: true });
        }
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  }

  async function handleToggleRead(id: string, currentRead: boolean) {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });
      if (!res.ok) throw new Error("Failed to update message");
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: !currentRead } : m)),
      );
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) =>
          prev ? { ...prev, read: !currentRead } : prev,
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllRead() {
    const unread = messages.filter((m) => !m.read);
    await Promise.all(
      unread.map((m) =>
        fetch(`/api/messages/${m._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        }),
      ),
    );
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            Customer inquiries and contact form submissions
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-sm text-muted-foreground">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Circle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-muted-foreground">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-6">
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {messages.length - unreadCount}
              </p>
              <p className="text-sm text-muted-foreground">Read</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>
            Click on a message to view full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={fetchMessages}
              >
                Retry
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
              <p className="text-muted-foreground mt-1">
                Messages from the contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <button
                  key={message._id}
                  onClick={() => openMessage(message)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                    !message.read
                      ? "bg-primary/5 border-primary/20"
                      : "bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <span className="h-2 w-2 bg-primary rounded-full shrink-0" />
                        )}
                        <p
                          className={`font-medium truncate ${!message.read ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {message.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.email}
                      </p>
                      <p className="text-sm mt-2 line-clamp-2 text-foreground/80">
                        {message.message}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </p>
                      <Badge
                        variant={message.read ? "secondary" : "default"}
                        className="mt-2"
                      >
                        {message.read ? "Read" : "New"}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.name}</DialogTitle>
                <DialogDescription>
                  Received on {formatDate(selectedMessage.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                {selectedMessage.subject && (
                  <div className="flex items-center gap-3 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMessage.subject}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(selectedMessage.createdAt)}</span>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Message</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Replace the single <div className="flex gap-3"> with this: */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a href={`mailto:${selectedMessage.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Reply via Email
                    </a>
                  </Button>
                  {selectedMessage.phone && (
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 bg-[#25D366] text-white hover:bg-[#20BA5C] border-0"
                    >
                      <a
                        href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      handleToggleRead(
                        selectedMessage._id,
                        selectedMessage.read,
                      )
                    }
                  >
                    {selectedMessage.read ? (
                      <>
                        <Circle className="mr-2 h-4 w-4" />
                        Mark Unread
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(selectedMessage._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
