"use client";

import { useForm } from "react-hook-form";
import { Camera, CheckCircle2, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "./settings-section";

export function PersonalSettings() {
  return (
    <div className="space-y-6">
      <SettingsSection
        title="Basic information"
        description="Update your basic information such as name or your profile picture"
      >
        <ProfilePhotoForm />
      </SettingsSection>
      <SettingsSection
        title="Contact Information"
        description="Manage the email address and phone number tied to your account."
      >
        <ContactForm />
      </SettingsSection>
    </div>
  );
}

type ProfileValues = { name: string };

function ProfilePhotoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    defaultValues: { name: "Alex Smith" },
  });
  const onSubmit = (values: ProfileValues) => {
    void values; /* Connect this to the profile update API. */
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative">
          <img
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
            alt="Alex Smith"
            className="size-20 rounded-full border-2 border-border object-cover"
          />
          <Button
            type="button"
            size="icon-xs"
            className="absolute right-0 bottom-0 rounded-full border-2 border-background"
          >
            <Camera />
          </Button>
        </div>
        <div className="w-full flex-1">
          <Field label="Name">
            <Input
              {...register("name", { required: "Name is required" })}
              className="max-w-sm"
            />
          </Field>
          <p className="mt-1 text-sm text-muted-foreground">
            JPG, PNG or WebP. Max file size 5MB.
          </p>
          <div className="mt-3 flex gap-3">
            <Button type="button">Upload photo</Button>
            <Button type="button" variant="outline">
              Remove
            </Button>
          </div>
        </div>
      </div>
      {errors.name && (
        <p className="text-sm text-destructive">{errors.name.message}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit">Save profile</Button>
      </div>
    </form>
  );
}
type ContactValues = { email: string; phone: string };
function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    defaultValues: { email: "alex@example.com", phone: "(555) 123-4567" },
  });
  const onSubmit = (values: ContactValues) => {
    void values; /* Connect this to the contact update API. */
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      <Field label="Email address">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
          </div>
          <Button type="submit" variant="outline">
            Update
          </Button>
        </div>
        <Status verified>
          Verified — A verification link will be sent if you change your email.
        </Status>
      </Field>
      {(errors.email || errors.phone) && (
        <p className="text-sm text-destructive">
          {errors.email?.message ?? errors.phone?.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit">Save contact info</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </Label>
      {children}
    </div>
  );
}
function Status({
  verified = false,
  children,
}: {
  verified?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${verified ? "text-emerald-600" : "text-amber-600"}`}
    >
      <CheckCircle2 className="size-3.5" />
      {children}
    </div>
  );
}
