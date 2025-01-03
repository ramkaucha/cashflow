import "@/components/under-construction.css";

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[85vh] bg-background text-center">
      <div className="construction"></div>
      <div className="inline-flex items-center gap-10 text-6xl">
        <span>Under Construction</span>
      </div>
      <p className="mt-4 max-w-md text-muted-foreground">
        This page is under construction. Please check back later.
      </p>
    </div>
  );
}
