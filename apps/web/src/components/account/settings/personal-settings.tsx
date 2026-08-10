"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "./settings-section";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadAvatar } from "@/services/users";
import { AvatarPicker } from "./avatar-picker";

export function PersonalSettings() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
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
  const { data: session } = useSession();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    values: { name: session?.user.name ?? "" },
  });
  const onSubmit = async (values: ProfileValues) => {
    try {
      const image = avatarFile ? await uploadAvatar(avatarFile) : undefined;
      const result = await authClient.updateUser({
        name: values.name,
        ...(avatarRemoved ? { image: null } : image ? { image } : {}),
      });
      if (result.error) throw new Error(result.error.message);
      toast.success("Profile updated", { position: "top-center" });
    } catch (error) {
      toast.error("Unable to update profile", {
        description: error instanceof Error ? error.message : undefined,
        position: "top-center",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
      <AvatarPicker
        image={session?.user.image}
        onChange={(file) => {
          setAvatarFile(file);
          setAvatarRemoved(file === null);
        }}
      />
      <Field label="Name">
        <Input
          {...register("name", { required: "Name is required" })}
          className="w-full"
        />
      </Field>
      {errors.name && (
        <p className="text-sm text-destructive">{errors.name.message}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving profile..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
type ContactValues = { email: string; phone: string };
function ContactForm() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    values: { email: session?.user.email ?? "", phone: "" },
  });
  const onSubmit = async (values: ContactValues) => {
    try {
      const result = await authClient.changeEmail({
        newEmail: values.email,
        callbackURL: `${window.location.origin}/account/settings`,
      });
      if (result.error) throw new Error(result.error.message);
      toast.success("Email change requested", {
        description: "Check your inbox to confirm the new email address.",
        position: "top-center",
      });
    } catch (error) {
      toast.error("Unable to update email", {
        description: error instanceof Error ? error.message : undefined,
        position: "top-center",
      });
    }
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
          <Button type="submit" variant="outline" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Save contact info"}
        </Button>
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
