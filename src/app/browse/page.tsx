import AdlibFeed from "@/feed/adlib-feed";
import Layout from "@/layouts/layout";
import SideNav from "@/layouts/navbars/side-nav";

export default function BrowsePage() {
  return (
    <Layout>
      <div className="mx-auto grid h-full w-full max-w-7xl grow grid-cols-12">
        <aside className="hidden px-2 py-6 md:col-span-4 md:block lg:col-span-2">
          <SideNav />
        </aside>
        <main className="col-span-12 flex flex-col gap-6 px-6 py-6 md:col-span-8 md:border-l lg:col-span-8 lg:border-r">
          <AdlibFeed />
        </main>
        <section className="hidden px-2 py-6 md:col-span-4 md:block lg:col-span-2"></section>
      </div>
    </Layout>
  );
}
