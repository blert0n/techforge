"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, UserRound } from "lucide-react";
import { PersonalSettings } from "./personal-settings";
import { SecuritySettings } from "./security-settings";

const tabs = [
  { value: "personal", label: "Personal info", icon: UserRound },
  { value: "security", label: "Security", icon: Shield },
] as const;

type Tab = (typeof tabs)[number]["value"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold uppercase">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information, credentials, and preferences.
        </p>
      </header>

      <div
        className="border-b border-border"
        role="tablist"
        aria-label="Account settings"
      >
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={activeTab === value}
              onClick={() => setActiveTab(value)}
              className={`h-10 rounded-none border-b-2 px-3 ${activeTab === value ? "border-primary text-primary hover:text-primary" : "border-transparent text-muted-foreground"}`}
            >
              <Icon /> {label}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === "personal" && <PersonalSettings />}
      {activeTab === "security" && <SecuritySettings />}
    </div>
  );
}
