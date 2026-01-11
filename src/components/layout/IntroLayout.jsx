import MobileMenu from "../MobileMenu";

export default function IntroLayout({ children, sidebar }) {
  return (
    <div className="min-h-screen w-full flex bg-black text-white overflow-hidden">
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main content */}
      <main className="flex-1 relative flex items-center justify-center">
        {children}
      </main>

      {/* Right vertical sidebar - desktop only */}
      <aside className="hidden lg:flex w-16 items-center justify-center">
        {sidebar}
      </aside>
    </div>
  );
}