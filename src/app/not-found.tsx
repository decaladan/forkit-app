import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: "#ffc737" }}
    >
      <span className="text-5xl">🍽</span>
      <h1 className="text-2xl font-black" style={{ color: "#000" }}>
        404 — Nothing here
      </h1>
      <p className="text-sm text-center max-w-[280px]" style={{ color: "rgba(0,0,0,0.6)" }}>
        This dish doesn&apos;t exist yet. Maybe the chefs haven&apos;t invented it.
      </p>
      <Link
        href="/"
        className="mt-2 comic-btn-red text-sm tracking-wide inline-block"
      >
        Back to ForkIt
      </Link>
    </div>
  );
}
