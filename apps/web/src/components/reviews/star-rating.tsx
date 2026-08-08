import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
export function StarRating({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (rating: number) => void }) { return <div className="flex">{[1, 2, 3, 4, 5].map((star) => <Button key={star} type="button" variant="ghost" size="icon-xs" disabled={!interactive} onClick={() => onChange?.(star)}><Star className={`size-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} /></Button>)}</div>; }
