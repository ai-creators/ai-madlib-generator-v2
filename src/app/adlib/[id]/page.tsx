import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import AdlibHeader from "@/adlib/adlib-header";
import AdlibComments from "@/adlib/comments/adlib-comments";
import Layout from "@/layouts/layout";
import { api } from "@/trpc/server";

export default async function AdlibPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adlibId = Number(id);

  if (!Number.isInteger(adlibId)) {
    notFound();
  }

  try {
    const adlib = await api.adlib.getById(adlibId);

    return (
      <Layout>
        <div className="mx-auto flex w-full max-w-3xl grow flex-col gap-6 px-6 py-6">
          <AdlibHeader adlib={adlib} />
          <AdlibComments adlibId={adlib.id} />
        </div>
      </Layout>
    );
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }
}
