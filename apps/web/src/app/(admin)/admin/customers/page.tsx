"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { authClient, useSession } from "@/lib/auth-client";
import {
  Ban,
  KeyRound,
  LoaderCircle,
  MonitorSmartphone,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRoundCog,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  createdAt: Date | string;
};

type ManagedSession = {
  id: string;
  token: string;
  createdAt: Date | string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

const emptyUser: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
} = { name: "", email: "", password: "", role: "user" };

export default function CustomersPage() {
  const { data: currentSession } = useSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingUserId, setPendingUserId] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState(emptyUser);
  const [banTarget, setBanTarget] = useState<ManagedUser>();
  const [banReason, setBanReason] = useState("");
  const [banDurationDays, setBanDurationDays] = useState("never");
  const [editTarget, setEditTarget] = useState<ManagedUser>();
  const [editDraft, setEditDraft] = useState<{
    name: string;
    email: string;
    role: "admin" | "user";
  }>({ name: "", email: "", role: "user" });
  const [passwordTarget, setPasswordTarget] = useState<ManagedUser>();
  const [newPassword, setNewPassword] = useState("");
  const [sessionsTarget, setSessionsTarget] = useState<ManagedUser>();
  const [sessions, setSessions] = useState<ManagedSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await authClient.admin.listUsers({
      query: {
        limit: 100,
        offset: 0,
        ...(search.trim()
          ? {
              searchValue: search.trim(),
              searchField: "email" as const,
              searchOperator: "contains" as const,
            }
          : {}),
      },
    });

    if (error)
      toast.error(error.message || "Unable to load users.", {
        position: "top-center",
      });
    setUsers((data?.users ?? []) as ManagedUser[]);
    setIsLoading(false);
  }, [search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadUsers(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadUsers]);

  async function runAction(
    userId: string,
    action: () => Promise<{ error: { message?: string } | null }>,
    success: string,
  ) {
    setPendingUserId(userId);
    const { error } = await action();
    setPendingUserId(undefined);
    if (error) {
      toast.error(error.message || "The action failed.", {
        position: "top-center",
      });
      return false;
    }
    toast.success(success, { position: "top-center" });
    await loadUsers();
    return true;
  }

  async function updateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editTarget) return;
    const target = editTarget;
    const succeeded = await runAction(
      target.id,
      async () => {
        const result = await authClient.admin.updateUser({
          userId: target.id,
          data: { name: editDraft.name, email: editDraft.email },
        });
        if (result.error) return result;
        if (
          target.id !== currentSession?.user.id &&
          editDraft.role !== (target.role ?? "user")
        ) {
          return authClient.admin.setRole({
            userId: target.id,
            role: editDraft.role,
          });
        }
        return result;
      },
      "User updated.",
    );
    if (succeeded) setEditTarget(undefined);
  }

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordTarget) return;
    const target = passwordTarget;
    const succeeded = await runAction(
      target.id,
      () =>
        authClient.admin.setUserPassword({ userId: target.id, newPassword }),
      "Password updated.",
    );
    if (succeeded) {
      setPasswordTarget(undefined);
      setNewPassword("");
    }
  }

  async function openSessions(user: ManagedUser) {
    setSessionsTarget(user);
    setSessionsLoading(true);
    const { data, error } = await authClient.admin.listUserSessions({
      userId: user.id,
    });
    setSessionsLoading(false);
    if (error)
      return toast.error(error.message || "Unable to load sessions.", {
        position: "top-center",
      });
    setSessions((data?.sessions ?? []) as ManagedSession[]);
  }

  async function revokeSession(token: string) {
    const { error } = await authClient.admin.revokeUserSession({
      sessionToken: token,
    });
    if (error)
      return toast.error(error.message || "Unable to revoke session.", {
        position: "top-center",
      });
    setSessions((current) =>
      current.filter((session) => session.token !== token),
    );
    toast.success("Session revoked.", { position: "top-center" });
  }

  async function revokeAllSessions() {
    if (!sessionsTarget) return;
    const { error } = await authClient.admin.revokeUserSessions({
      userId: sessionsTarget.id,
    });
    if (error)
      return toast.error(error.message || "Unable to revoke sessions.", {
        position: "top-center",
      });
    setSessions([]);
    toast.success("All sessions revoked.", { position: "top-center" });
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingUserId("new");
    const { error } = await authClient.admin.createUser(newUser);
    setPendingUserId(undefined);
    if (error)
      return toast.error(error.message || "Unable to create user.", {
        position: "top-center",
      });
    toast.success(`${newUser.name} was created.`, { position: "top-center" });
    setNewUser(emptyUser);
    setIsCreating(false);
    await loadUsers();
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage user access, roles, bans, and accounts.
          </p>
        </div>
        <Button onClick={() => setIsCreating((value) => !value)} type="button">
          <Plus /> {isCreating ? "Cancel" : "Create user"}
        </Button>
      </header>

      {isCreating ? (
        <Card>
          <CardHeader>
            <div>
              <h2 className="font-semibold">Create user</h2>
              <p className="text-sm text-muted-foreground">
                Add a customer or administrator account.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={createUser}>
              <div className="space-y-1.5">
                <Label htmlFor="customer-name">Full name</Label>
                <Input
                  id="customer-name"
                  required
                  value={newUser.name}
                  onChange={(event) =>
                    setNewUser({ ...newUser, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer-email">Email</Label>
                <Input
                  id="customer-email"
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(event) =>
                    setNewUser({ ...newUser, email: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customer-password">Temporary password</Label>
                <Input
                  id="customer-password"
                  required
                  minLength={8}
                  type="password"
                  value={newUser.password}
                  onChange={(event) =>
                    setNewUser({ ...newUser, password: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(role) =>
                    setNewUser({ ...newUser, role: role as "admin" | "user" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="sm:col-span-2"
                disabled={pendingUserId === "new"}
                type="submit"
              >
                {pendingUserId === "new" ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Plus />
                )}{" "}
                Create user
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="overflow-hidden">
        <CardHeader className="justify-start p-4">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
        </CardHeader>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
            <LoaderCircle className="mr-2 animate-spin" /> Loading users…
          </div>
        ) : users.length ? (
          <Table className="min-w-200">
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="px-5">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="px-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const pending = pendingUserId === user.id;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="px-5">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role ?? "user"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.banned ? "destructive" : "secondary"}
                      >
                        {user.banned ? "Banned" : "Active"}
                      </Badge>
                      {user.banReason ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {user.banReason}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-5">
                      <div className="flex justify-end gap-1">
                        <Button
                          className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={pending}
                          size="icon-sm"
                          title="Edit user"
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setEditDraft({
                              name: user.name,
                              email: user.email,
                              role: (user.role ?? "user") as "admin" | "user",
                            });
                            setEditTarget(user);
                          }}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={pending}
                          size="icon-sm"
                          title="Set password"
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setNewPassword("");
                            setPasswordTarget(user);
                          }}
                        >
                          <KeyRound />
                        </Button>
                        <Button
                          className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                          size="icon-sm"
                          title={
                            user.id === currentSession?.user.id
                              ? "You cannot revoke your current admin session here"
                              : "Manage sessions"
                          }
                          type="button"
                          variant="ghost"
                          onClick={() => void openSessions(user)}
                        >
                          <MonitorSmartphone />
                        </Button>
                        <Button
                          className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={
                            pending || user.id === currentSession?.user.id
                          }
                          size="icon-sm"
                          title={user.banned ? "Unban" : "Ban"}
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            if (user.banned) {
                              void runAction(
                                user.id,
                                () =>
                                  authClient.admin.unbanUser({
                                    userId: user.id,
                                  }),
                                "User unbanned.",
                              );
                            } else {
                              setBanReason("");
                              setBanDurationDays("never");
                              setBanTarget(user);
                            }
                          }}
                        >
                          <Ban />
                        </Button>
                        <Button
                          className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={
                            pending ||
                            user.role === "admin" ||
                            user.id === currentSession?.user.id
                          }
                          size="icon-sm"
                          title="Impersonate"
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            void runAction(
                              user.id,
                              () =>
                                authClient.admin.impersonateUser({
                                  userId: user.id,
                                }),
                              "Impersonation started.",
                            ).then((succeeded) => {
                              if (succeeded) window.location.href = "/";
                            })
                          }
                        >
                          <UserRoundCog />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                className="cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={
                                  pending || user.id === currentSession?.user.id
                                }
                                size="icon-sm"
                                title="Delete"
                                type="button"
                                variant="ghost"
                              />
                            }
                          >
                            <Trash2 className="text-destructive" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {user.email}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This permanently removes the user and their
                                active sessions. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  void runAction(
                                    user.id,
                                    () =>
                                      authClient.admin.removeUser({
                                        userId: user.id,
                                      }),
                                    "User deleted.",
                                  )
                                }
                              >
                                Delete user
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No users found.
          </p>
        )}
      </Card>

      <AlertDialog
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(undefined);
        }}
      >
        <AlertDialogContent>
          <form className="space-y-5" onSubmit={updateUser}>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit user</AlertDialogTitle>
              <AlertDialogDescription>
                Update the account details for {editTarget?.email}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-user-name">Full name</Label>
                <Input
                  id="edit-user-name"
                  required
                  value={editDraft.name}
                  onChange={(event) =>
                    setEditDraft({ ...editDraft, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-user-email">Email</Label>
                <Input
                  id="edit-user-email"
                  required
                  type="email"
                  value={editDraft.email}
                  onChange={(event) =>
                    setEditDraft({ ...editDraft, email: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={editDraft.role}
                  disabled={editTarget?.id === currentSession?.user.id}
                  onValueChange={(value) => {
                    if (value)
                      setEditDraft({
                        ...editDraft,
                        role: value as "admin" | "user",
                      });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {editTarget?.id === currentSession?.user.id ? (
                  <p className="text-xs text-muted-foreground">
                    You cannot change your own role.
                  </p>
                ) : null}
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button disabled={pendingUserId === editTarget?.id} type="submit">
                {pendingUserId === editTarget?.id ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Pencil />
                )}{" "}
                Save changes
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(passwordTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setPasswordTarget(undefined);
            setNewPassword("");
          }
        }}
      >
        <AlertDialogContent>
          <form className="space-y-5" onSubmit={updatePassword}>
            <AlertDialogHeader>
              <AlertDialogTitle>Set a new password</AlertDialogTitle>
              <AlertDialogDescription>
                This immediately replaces the password for{" "}
                {passwordTarget?.email}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-1.5">
              <Label htmlFor="new-user-password">New password</Label>
              <Input
                id="new-user-password"
                autoComplete="new-password"
                minLength={8}
                required
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button
                disabled={
                  pendingUserId === passwordTarget?.id || newPassword.length < 8
                }
                type="submit"
              >
                {pendingUserId === passwordTarget?.id ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <KeyRound />
                )}{" "}
                Update password
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(sessionsTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setSessionsTarget(undefined);
            setSessions([]);
          }
        }}
      >
        <AlertDialogContent className="min-w-0 max-h-[85vh] overflow-x-hidden overflow-y-auto sm:max-w-2xl">
          <AlertDialogHeader className="min-w-0">
            <AlertDialogTitle className="break-all">
              Sessions for {sessionsTarget?.email}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Review signed-in devices and revoke access that is no longer
              trusted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div
            className="w-full min-w-0 max-w-full space-y-3 overflow-hidden"
            style={{ contain: "inline-size" }}
          >
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                <LoaderCircle className="mr-2 animate-spin" /> Loading
                sessions...
              </div>
            ) : sessions.length ? (
              sessions.map((session) => (
                <Card
                  key={session.id}
                  className="w-0 min-w-full max-w-full overflow-hidden"
                >
                  <CardContent className="grid min-w-0 max-w-full grid-cols-1 gap-4 overflow-hidden p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <div className="min-w-0 max-w-full space-y-2 overflow-hidden">
                      <p
                        className="max-w-full whitespace-normal text-sm font-medium"
                        style={{
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {session.userAgent || "Unknown device"}
                      </p>
                      <p
                        className="max-w-full whitespace-normal text-xs text-muted-foreground"
                        style={{
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        IP: {session.ipAddress || "Unavailable"}
                      </p>
                      <p
                        className="max-w-full whitespace-normal text-xs text-muted-foreground"
                        style={{
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        Created {new Date(session.createdAt).toLocaleString()} ·
                        Expires {new Date(session.expiresAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      className="w-fit justify-self-end"
                      size="sm"
                      type="button"
                      variant="destructive"
                      onClick={() => void revokeSession(session.token)}
                    >
                      Revoke
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No active sessions found.
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              disabled={sessionsLoading || sessions.length === 0}
              type="button"
              variant="destructive"
              onClick={() => void revokeAllSessions()}
            >
              Revoke all sessions
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(banTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setBanTarget(undefined);
            setBanReason("");
            setBanDurationDays("never");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban {banTarget?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              The user will be unable to sign in until an administrator removes
              the ban.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="ban-reason">Reason</Label>
            <Input
              id="ban-reason"
              autoFocus
              maxLength={250}
              placeholder="Explain why this account is being banned"
              value={banReason}
              onChange={(event) => setBanReason(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Ban duration</Label>
            <Select
              value={banDurationDays}
              onValueChange={(value) => {
                if (value) setBanDurationDays(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="never">Until manually unbanned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!banReason.trim() || pendingUserId === banTarget?.id}
              onClick={() => {
                if (!banTarget || !banReason.trim()) return;
                const target = banTarget;
                const reason = banReason.trim();
                const duration = banDurationDays;
                setBanTarget(undefined);
                setBanReason("");
                setBanDurationDays("never");
                void runAction(
                  target.id,
                  () =>
                    authClient.admin.banUser({
                      userId: target.id,
                      banReason: reason,
                      ...(duration === "never"
                        ? {}
                        : { banExpiresIn: Number(duration) * 24 * 60 * 60 }),
                    }),
                  "User banned.",
                );
              }}
            >
              Ban user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
