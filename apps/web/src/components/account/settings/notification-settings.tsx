"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SettingsSection } from "./settings-section";

const notifications = [
  ["Order Updates", "Shipping, delivery, and cancellation updates", true],
  ["Price Drops on Wishlist", "Get notified when saved items go on sale", true],
  ["Marketing & Promotions", "New products, deals, and weekly digests", false],
  ["Security Alerts", "Unusual sign-ins and password changes", true],
  ["Review Responses", "When someone replies to your product reviews", true],
] as const;
export function NotificationSettings() {
  const { handleSubmit, setValue, watch } = useForm<Record<string, boolean>>({
    defaultValues: Object.fromEntries(
      notifications.map(([title, , checked]) => [title, checked]),
    ),
  });
  const onSubmit = (values: Record<string, boolean>) => {
    void values; /* Connect this to notification preferences API. */
  };
  return (
    <SettingsSection
      title="Notification Preferences"
      description="Choose how and when you'd like to be notified."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="divide-y divide-border px-6">
          {notifications.map(([title, description, checked]) => (
            <PreferenceRow
              key={title}
              title={title}
              description={description}
              checked={checked}
              value={watch(title)}
              onCheckedChange={(value) => setValue(title, value === true)}
            />
          ))}
        </div>
        <div className="flex justify-end border-t border-border p-6">
          <Button type="submit">Save preferences</Button>
        </div>
      </form>
    </SettingsSection>
  );
}
export function PreferenceRow({
  title,
  description,
  checked,
  value,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  value?: boolean;
  onCheckedChange?: (value: boolean | "indeterminate") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Checkbox
        checked={value ?? checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
        className="size-5 rounded-md"
      />
    </div>
  );
}

import { useForm } from "react-hook-form";
