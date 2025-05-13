export function MovieGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[auto_auto_auto] w-max mx-auto gap-x-12 gap-y-24">
      {children}
    </div>
  );
}
