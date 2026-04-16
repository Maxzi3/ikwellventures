// "use client";

// import { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   MessageSquare,
//   Mail,
//   Phone,
//   Calendar,
//   CheckCircle,
//   Circle,
// } from "lucide-react";
// // import {
// //   contactMessages as initialMessages,
// //   type ContactMessage,
// // } from "@/lib/data";

// export default function AdminMessagesPage() {
//   const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
//   const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
//     null,
//   );

//   const unreadCount = messages.filter((m) => !m.read).length;

//   function handleMarkAsRead(id: string) {
//     setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
//     if (selectedMessage?.id === id) {
//       setSelectedMessage({ ...selectedMessage, read: true });
//     }
//   }

//   function handleMarkAllRead() {
//     setMessages(messages.map((m) => ({ ...m, read: true })));
//   }

//   function formatDate(dateString: string) {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }

//   function openMessage(message: ContactMessage) {
//     setSelectedMessage(message);
//     if (!message.read) {
//       handleMarkAsRead(message.id);
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Messages</h1>
//           <p className="text-muted-foreground mt-1">
//             Customer inquiries and contact form submissions
//           </p>
//         </div>
//         {unreadCount > 0 && (
//           <Button variant="outline" onClick={handleMarkAllRead}>
//             <CheckCircle className="mr-2 h-4 w-4" />
//             Mark all as read
//           </Button>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <Card>
//           <CardContent className="flex items-center gap-4 py-6">
//             <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
//               <MessageSquare className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold">{messages.length}</p>
//               <p className="text-sm text-muted-foreground">Total Messages</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex items-center gap-4 py-6">
//             <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
//               <Circle className="h-6 w-6 text-destructive" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold">{unreadCount}</p>
//               <p className="text-sm text-muted-foreground">Unread</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex items-center gap-4 py-6">
//             <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
//               <CheckCircle className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold">
//                 {messages.length - unreadCount}
//               </p>
//               <p className="text-sm text-muted-foreground">Read</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Messages List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Messages</CardTitle>
//           <CardDescription>
//             Click on a message to view full details
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {messages.map((message) => (
//               <button
//                 key={message.id}
//                 onClick={() => openMessage(message)}
//                 className={`w-full text-left p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
//                   !message.read
//                     ? "bg-primary/5 border-primary/20"
//                     : "bg-background"
//                 }`}
//               >
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                       {!message.read && (
//                         <span className="h-2 w-2 bg-primary rounded-full shrink-0" />
//                       )}
//                       <p
//                         className={`font-medium truncate ${!message.read ? "text-foreground" : "text-muted-foreground"}`}
//                       >
//                         {message.name}
//                       </p>
//                     </div>
//                     <p className="text-sm text-muted-foreground truncate mt-1">
//                       {message.email}
//                     </p>
//                     <p className="text-sm mt-2 line-clamp-2 text-foreground/80">
//                       {message.message}
//                     </p>
//                   </div>
//                   <div className="text-right shrink-0">
//                     <p className="text-xs text-muted-foreground">
//                       {formatDate(message.createdAt)}
//                     </p>
//                     <Badge
//                       variant={message.read ? "secondary" : "default"}
//                       className="mt-2"
//                     >
//                       {message.read ? "Read" : "New"}
//                     </Badge>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {messages.length === 0 && (
//             <div className="text-center py-12">
//               <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
//               <p className="text-muted-foreground mt-1">
//                 Messages from the contact form will appear here.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Message Detail Dialog */}
//       <Dialog
//         open={!!selectedMessage}
//         onOpenChange={() => setSelectedMessage(null)}
//       >
//         <DialogContent className="max-w-lg">
//           {selectedMessage && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selectedMessage.name}</DialogTitle>
//                 <DialogDescription>
//                   Received on {formatDate(selectedMessage.createdAt)}
//                 </DialogDescription>
//               </DialogHeader>

//               <div className="space-y-4 py-4">
//                 <div className="flex items-center gap-3 text-sm">
//                   <Mail className="h-4 w-4 text-muted-foreground" />
//                   <a
//                     href={`mailto:${selectedMessage.email}`}
//                     className="text-primary hover:underline"
//                   >
//                     {selectedMessage.email}
//                   </a>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm">
//                   <Phone className="h-4 w-4 text-muted-foreground" />
//                   <a
//                     href={`tel:${selectedMessage.phone}`}
//                     className="text-primary hover:underline"
//                   >
//                     {selectedMessage.phone}
//                   </a>
//                 </div>
//                 <div className="flex items-center gap-3 text-sm">
//                   <Calendar className="h-4 w-4 text-muted-foreground" />
//                   <span>{formatDate(selectedMessage.createdAt)}</span>
//                 </div>

//                 <div className="pt-4 border-t">
//                   <h4 className="font-medium mb-2">Message</h4>
//                   <p className="text-muted-foreground whitespace-pre-wrap">
//                     {selectedMessage.message}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <Button asChild className="flex-1">
//                   <a href={`mailto:${selectedMessage.email}`}>
//                     <Mail className="mr-2 h-4 w-4" />
//                     Reply via Email
//                   </a>
//                 </Button>
//                 <Button variant="outline" asChild>
//                   <a
//                     href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, "")}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Phone className="mr-2 h-4 w-4" />
//                     WhatsApp
//                   </a>
//                 </Button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
