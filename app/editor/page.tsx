import BlogEditor from "@/components/BlogEditor";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen py-16 px-4">
      <div className="flex items-center justify-between  mb-8">
        <h1 className="text-4xl font-bold">Live Editor</h1>
        <div className="flex gap-2">
        <Button> <Save /> Save</Button>
        </div>
      </div>
      <BlogEditor></BlogEditor>
    </div>
  );
}
