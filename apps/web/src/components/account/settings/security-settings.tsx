"use client";

import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import {
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  ShieldCheck,
  Smartphone,
  // MessageSquareText,
  // Monitor,
  // Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SettingsSection } from "./settings-section";

export function SecuritySettings() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const newPassword = watch("newPassword");
  const score = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /[0-9!@#$%^&*]/.test(newPassword),
    newPassword.length >= 12,
  ].filter(Boolean).length;
  const onSubmit = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const result = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (result.error) throw new Error(result.error.message);
      reset();
      toast.success("Password updated", { position: "top-center" });
    } catch (error) {
      toast.error("Unable to update password", {
        description: error instanceof Error ? error.message : undefined,
        position: "top-center",
      });
    }
  };
  return (
    <div className="space-y-6">
      <SettingsSection
        title="Change Password"
        description="Use a strong password that you don't use elsewhere."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <PasswordField
            label="Current password"
            registration={register("currentPassword", {
              required: "Enter your current password",
            })}
          />
          <div className="space-y-2">
            <PasswordField
              label="New password"
              registration={register("newPassword", {
                required: "Enter a new password",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  uppercase: (value) =>
                    /[A-Z]/.test(value) || "Include an uppercase letter",
                  numberOrSymbol: (value) =>
                    /[0-9!@#$%^&*]/.test(value) || "Include a number or symbol",
                },
              })}
            />
            <div className="flex gap-1.5">
              {Array.from({ length: 4 }, (_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index < score ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength:{" "}
              {score === 0
                ? "—"
                : ["Weak", "Fair", "Good", "Strong"][score - 1]}
            </p>
          </div>
          <PasswordField
            label="Confirm new password"
            registration={register("confirmPassword", {
              required: "Confirm your new password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• At least 8 characters</li>
            <li>• One uppercase letter</li>
            <li>• One number or symbol</li>
          </ul>
          {(errors.currentPassword ||
            errors.newPassword ||
            errors.confirmPassword) && (
            <p className="text-sm text-destructive">
              {errors.currentPassword?.message ??
                errors.newPassword?.message ??
                errors.confirmPassword?.message}
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating password..." : "Update password"}
            </Button>
          </div>
        </form>
      </SettingsSection>
      {/* <SettingsSection
        danger
        title="Danger Zone"
        description="Irreversible account actions. Proceed with caution."
      >
        <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium">Delete account</p>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Once you delete your account, all your data will be permanently
              removed. This action cannot be undone.
            </p>
          </div>
          <Button type="button" variant="destructive">
            <Trash2 />
            Delete account
          </Button>
        </div>
      </SettingsSection> */}
    </div>
  );
}

function PasswordField({
  label,
  registration,
}: {
  label: string;
  registration: UseFormRegisterReturn;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <KeyRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={visible ? "text" : "password"}
          className="px-9"
          placeholder={
            label === "Current password"
              ? "Enter current password"
              : "Enter password"
          }
          {...registration}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setVisible(!visible)}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        >
          {visible ? <EyeOff /> : <Eye />}
          <span className="sr-only">Toggle password visibility</span>
        </Button>
      </div>
    </div>
  );
}
function SecurityMethod({
  icon: Icon,
  title,
  description,
  enabled = false,
}: {
  icon: typeof Smartphone;
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div className="flex items-center gap-4">
        <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {enabled ? (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
            <ShieldCheck className="size-4" />
            Enabled
          </span>
          <Button type="button" variant="ghost">
            Disable
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline">
          Enable
        </Button>
      )}
    </div>
  );
}
function Session({
  icon: Icon,
  title,
  subtitle,
  current = false,
}: {
  icon: typeof Laptop;
  title: string;
  subtitle: string;
  current?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${current ? "border-primary/30 bg-primary/5" : "border-border"}`}
    >
      <div className="flex items-center gap-4">
        <div className="grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {!current && (
        <Button type="button" variant="link" className="text-destructive">
          Revoke
        </Button>
      )}
    </div>
  );
}
