"use client";

import { useState } from "react";
import { useSupabase } from "@/lib/supabase-context";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Trash2, Eye, Calendar, Building } from "lucide-react";
import type { ContactMessage } from "@/lib/types/contact";

export function ContactMessages() {
  const { t } = useLanguage();
  const { contactMessages, updateContactMessageStatus, deleteContactMessage, refreshData } = useSupabase();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const getStatusBadge = (status: ContactMessage["status"]) => {
    const variants = {
      unread: "bg-blue-100 text-blue-800",
      read: "bg-gray-100 text-gray-800",
      replied: "bg-green-100 text-green-800",
      archived: "bg-yellow-100 text-yellow-800",
    };

    return (
      <Badge className={variants[status]}>
        {t.admin.contactMessages.statuses[status]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      t.admin.contactMessages.messages, // Using the language from translations
      { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
    );
  };

  const handleStatusChange = async (id: string, status: ContactMessage["status"]) => {
    try {
      await updateContactMessageStatus(id, status);
      await refreshData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.contactMessages.deleteConfirm)) {
      return;
    }

    try {
      await deleteContactMessage(id);
      await refreshData();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          {t.admin.contactMessages.title}
        </h2>
        <p className="text-muted-foreground">
          {contactMessages.length} {t.admin.contactMessages.messages}
        </p>
      </div>

      {contactMessages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {t.admin.contactMessages.noMessages}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contactMessages.map((message) => (
            <Card key={message.id} className={message.status === "unread" ? "border-primary/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      {getStatusBadge(message.status)}
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${message.email}`} className="hover:text-primary">
                          {message.email}
                        </a>
                      </div>
                      {message.company && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {message.company}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(message.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            if (message.status === "unread") {
                              handleStatusChange(message.id, "read");
                            }
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {t.admin.contactMessages.messageFrom} {message.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-1">
                              {t.admin.contactMessages.email}
                            </p>
                            <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                              {message.email}
                            </a>
                          </div>
                          {message.company && (
                            <div>
                              <p className="text-sm font-medium mb-1">
                                {t.admin.contactMessages.company}
                              </p>
                              <p>{message.company}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium mb-1">
                              {t.admin.contactMessages.message}
                            </p>
                            <p className="whitespace-pre-wrap">{message.message}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">
                              {t.admin.contactMessages.status}
                            </p>
                            <Select
                              value={message.status}
                              onValueChange={(value) => handleStatusChange(message.id, value as ContactMessage["status"])}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unread">
                                  {t.admin.contactMessages.statuses.unread}
                                </SelectItem>
                                <SelectItem value="read">
                                  {t.admin.contactMessages.statuses.read}
                                </SelectItem>
                                <SelectItem value="replied">
                                  {t.admin.contactMessages.statuses.replied}
                                </SelectItem>
                                <SelectItem value="archived">
                                  {t.admin.contactMessages.statuses.archived}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
