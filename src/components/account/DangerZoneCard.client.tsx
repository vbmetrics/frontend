"use client";

import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter as DialogFooterUI,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function DangerZoneCard() {
  const [open, setOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState("");

  // TODO: podepnij prawdziwe akcje
  function onChangePassword() {
    toast.info("Password change flow coming soon.");
  }

  async function onDeleteAccount() {
    if (confirm !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }
    try {
      // TODO: call your API (DELETE /api/v1/users/me), a potem wyloguj i przekieruj
      // await fetch("/api/backend/api/v1/users/me", { method: "DELETE" });
      // location.href = "/";  // np. landing
      toast.success("Account deleted (mock).");
      setOpen(false);
    } catch {
      toast.error("Failed to delete account.");
    }
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p className="text-muted-foreground">
          Sensitive operations. Proceed with caution.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onChangePassword}>
            Change password
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete account</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All data associated with your account will be removed.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm">
                  Type <code>DELETE</code> to confirm.
                </p>
                <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </div>
              <DialogFooterUI>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={onDeleteAccount}>Delete</Button>
              </DialogFooterUI>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
      <CardFooter />
    </Card>
  );
}
