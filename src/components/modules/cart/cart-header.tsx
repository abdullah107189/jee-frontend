"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CartHeaderProps {
  itemCount: number;
  onClear: () => void;
}

export function CartHeader({ itemCount, onClear }: CartHeaderProps) {
  const [isClearing, startClearTransition] = useTransition();

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Shopping Cart
          </h1>

          <Badge variant="destructive" className="rounded-full">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Review your items before checkout.
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              disabled={isClearing}
              className="w-fit text-muted-foreground hover:text-destructive"
            >
              {isClearing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear cart
            </Button>
          }
        />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your cart?</AlertDialogTitle>

            <AlertDialogDescription>
              This will remove all {itemCount} item
              {itemCount !== 1 && "s"} from your cart. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => startClearTransition(onClear)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, clear cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
