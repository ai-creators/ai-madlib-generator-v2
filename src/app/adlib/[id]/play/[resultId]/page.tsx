import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";
import AdlibPlayResult from "@/adlib/play/adlib-play-result";
import Layout from "@/layouts/layout";
import { api } from "@/trpc/server";

export default async function AdlibPlayResultPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const id = Number(resultId);

  if (!Number.isInteger(id)) {
    notFound();
  }

  try {
    const result = await api.adlib.getResultById(id);

    return (
      <Layout>
        <div className="mx-auto flex w-full max-w-3xl grow flex-col gap-6 px-6 py-6">
          <AdlibPlayResult result={result} />
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
