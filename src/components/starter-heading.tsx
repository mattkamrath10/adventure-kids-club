export function StarterHeading({
  title,
  className,
}: {
  title: string;
  className: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <h1 className={`text-center text-5xl sm:text-7xl ${className}`}>{title}</h1>
    </div>
  );
}
