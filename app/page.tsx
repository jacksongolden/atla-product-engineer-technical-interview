import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Trace Viewer
        </h1>
        <p className="text-gray-600 mb-8">
          View AI agent execution traces
        </p>
        <Link
          href="/run/run_123"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Sample Trace
        </Link>
      </div>
    </div>
  );
}
