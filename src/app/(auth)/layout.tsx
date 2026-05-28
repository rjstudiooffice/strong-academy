export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {children}
      <footer className="py-6 text-center">
        <p className="text-[11px] text-[#C4B9B0] tracking-wider">
          Strong Academy · Nur auf Einladung
        </p>
      </footer>
    </div>
  )
}
