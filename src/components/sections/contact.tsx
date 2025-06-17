"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emailAction } from "@/lib/api/actions";
import { useActionState } from "react";

export const ContactSection = () => {
  const [state, action, pending] = useActionState(emailAction, {
    error: "",
    success: "",
  });

  return (
    <form className="flex flex-col gap-2" action={action}>
      <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
      <div className="space-y-4">
        {state.success ? (
          <Alert>
            <Icon icon="lucide:check" className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{state.success}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input name="name" type="text" placeholder="Your name" />
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                name="message"
                placeholder="Your message..."
                className="min-h-32"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button type="submit" className="flex-1" disabled={pending}>
                {pending ? (
                  <Icon
                    icon="ph:spinner-gap"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                ) : (
                  <Icon icon="lucide:send" className="mr-2 h-4 w-4" />
                )}
                Send Message
              </Button>
              <Button variant="outline" type="reset" className="flex-1">
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
      {state.error && (
        <Alert variant="destructive">
          <Icon icon="lucide:alert-circle" className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};
