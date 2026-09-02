import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdlibCommentForm from "./adlib-comment-form";
import AdlibCommentList from "./adlib-comment-list";

export default function AdlibComments({ adlibId }: { adlibId: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <AdlibCommentForm adlibId={adlibId} />
        <AdlibCommentList adlibId={adlibId} />
      </CardContent>
    </Card>
  );
}
