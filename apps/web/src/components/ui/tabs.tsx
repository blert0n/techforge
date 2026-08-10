"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
const Context = React.createContext<{ value: string; setValue: (value: string) => void } | null>(null);
export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) { const [value, setValue] = React.useState(defaultValue); return <Context.Provider value={{ value, setValue }}>{children}</Context.Provider>; }
export function TabsList({ children, variant, className }: { children: React.ReactNode; variant?: "line"; className?: string }) { return <div role="tablist" className={cn(variant === "line" && "flex gap-6 border-b border-border", className)}>{children}</div>; }
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) { const context = React.useContext(Context); if (!context) throw new Error("TabsTrigger requires Tabs"); const active = context.value === value; return <button type="button" role="tab" aria-selected={active} onClick={() => context.setValue(value)} className={`border-b-2 px-0 pb-3 text-sm font-medium ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{children}</button>; }
export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) { const context = React.useContext(Context); return context?.value === value ? <div role="tabpanel">{children}</div> : null; }
