import clsx from "clsx";

export default function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "category";
}) {
  return (
    <span
      className={clsx(
        "inline-block text-xs tracking-wide uppercase px-3 py-1 rounded-full",
        variant === "default" && "bg-cream text-stone-dark",
        variant === "category" && "bg-clay-light/40 text-clay-dark"
      )}
    >
      {children}
    </span>
  );
}
