export default function Spinner() {
  return (
    <div
      className="flex h-screen items-center justify-center"
      aria-label="読み込み中"
    >
      <div className="border-gray h-8 w-8 animate-spin rounded-xl bg-white"></div>
    </div>
  );
}
