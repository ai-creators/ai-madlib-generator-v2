import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateAdlibForm from "./create-adlib-form";

export default function CreateAdlibCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new Adlib</CardTitle>
        <CardDescription>
          Enter a prompt to generate a custom madlib
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateAdlibForm />
      </CardContent>
    </Card>
  );
}
