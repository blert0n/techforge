"use client";

import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";
import { PreferenceRow } from "./notification-settings";
const preferences = [
  [
    "Show Profile Publicly",
    "Allow others to view your public review profile",
    true,
  ],
  [
    "Personalized Recommendations",
    "Use browsing history to tailor product suggestions",
    true,
  ],
  [
    "Analytics & Diagnostics",
    "Share anonymous usage data to improve TechForge",
    false,
  ],
] as const;
export function PrivacySettings() {
  const { handleSubmit, setValue, watch } = useForm<Record<string, boolean>>({
    defaultValues: Object.fromEntries(
      preferences.map(([title, , checked]) => [title, checked]),
    ),
  });
  const onSubmit = (values: Record<string, boolean>) => {
    void values; /* Connect this to privacy settings API. */
  };
  return (
    <SettingsSection
      title="Privacy Settings"
      description="Control how your data and activity are used."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="divide-y divide-border px-6">
          {preferences.map(([title, description, checked]) => (
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
        <div className="flex flex-col items-start justify-between gap-4 border-t border-border p-6 sm:flex-row sm:items-center">
          <Button type="button" variant="link">
            Download my data
          </Button>
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </SettingsSection>
  );
}

import { useForm } from "react-hook-form";
