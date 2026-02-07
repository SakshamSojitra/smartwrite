type BackgroundVariant = "grid" | "gradient";

export type BackgroundSnippetsProps = {
  variant?: BackgroundVariant;
};

/**
 * Background component for page layout.
 * - grid: Subtle grid pattern with purple radial gradient
 * - gradient: Dark radial gradient (purple/black)
 */
export function BackgroundSnippets({ variant = "grid" }: BackgroundSnippetsProps) {
  if (variant === "gradient") {
    return (
      <div
        className="absolute inset-0 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"
      aria-hidden
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]" />
    </div>
  );
}
