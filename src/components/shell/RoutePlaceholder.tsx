export function RoutePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hf-muted">
        Coming in a later phase
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-hf-text sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-hf-muted">{description}</p>
    </div>
  );
}
