"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";
import { reviewFormSchema, type ReviewFormValues } from "./review-schema";
import { useCreateReview, useUpdateReview } from "@/hooks/use-reviews";
export function ReviewDialog({
  product,
  review,
  onClose,
}: {
  product: { id: number; name: string } | string;
  review?: { id: string; rating: number; title: string; body: string };
  onClose: () => void;
}) {
  const { register, handleSubmit, watch, setValue } = useForm<ReviewFormValues>(
    {
      resolver: zodResolver(reviewFormSchema),
      defaultValues: {
        rating: review?.rating ?? 0,
        title: review?.title ?? "",
        body: review?.body ?? "",
      },
    },
  );
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const rating = watch("rating");
  const productName = typeof product === "string" ? product : product.name;
  const submit = async (values: ReviewFormValues) => {
    if (review) await updateReview.mutateAsync({ id: review.id, values });
    else if (typeof product !== "string")
      await createReview.mutateAsync({ productId: product.id, ...values });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <Button
        type="button"
        variant="ghost"
        className="absolute inset-0 size-auto rounded-none bg-black/50 hover:bg-black/50"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit(submit)}
        className="relative w-full max-w-lg rounded-2xl bg-card shadow-2xl"
      >
        <header className="border-b border-border p-6">
          <h2 className="text-lg font-bold uppercase">
            {review ? "Edit Review" : "Write a Review"}
          </h2>
          <p className="text-sm text-muted-foreground">{productName}</p>
        </header>
        <div className="space-y-4 p-6">
          <Label>Overall rating</Label>
          <StarRating
            rating={rating}
            interactive
            onChange={(value) => setValue("rating", value)}
          />
          <Field label="Review title">
            <Input {...register("title", { required: true })} />
          </Field>
          <Field label="Your review">
            <Textarea rows={5} {...register("body", { required: true })} />
          </Field>
        </div>
        <footer className="flex gap-3 p-6 pt-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={
              !rating || createReview.isPending || updateReview.isPending
            }
          >
            Submit review
          </Button>
        </footer>
      </form>
    </div>
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
    <div>
      <Label className="mb-2">{label}</Label>
      {children}
    </div>
  );
}
