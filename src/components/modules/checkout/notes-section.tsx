"use client";

import { MessageSquare } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/Card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutFormValues } from "@/app/(public)/checkout/_lib/schema"; 
import { SectionHeading } from "./section-heading";

interface NotesSectionProps {
  form: UseFormReturn<CheckoutFormValues>;
}

export function NotesSection({ form }: NotesSectionProps) {
  return (
    <Card className="rounded-xl">
      <CardContent className="space-y-4 p-4 sm:p-6">
        <SectionHeading
          icon={MessageSquare}
          title="Order notes"
          description="Any special instructions (optional)"
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Any special instructions for the seller or delivery agent..."
                  className="rounded-xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}