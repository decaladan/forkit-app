"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: "#ffc737" }}
    >
      <span className="text-5xl">💥</span>
      <h1 className="text-xl font-bold" style={{ color: "#000" }}>
        Something went wrong
      </h1>
      <p className="text-sm text-center max-w-[280px]" style={{ color: "rgba(0,0,0,0.6)" }}>
        The kitchen had a small accident. Let&apos;s try that again.
      </p>
      <button
        onClick={reset}
        className="mt-2 comic-btn-red text-sm tracking-wide"
      >
        Try again
      </button>
    </div>
  );
}
