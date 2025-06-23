"use client"
import { useModalStore } from "@/store/BlogCreate";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const SaveButton: React.FC = () => {
  const saveAsMarkdown = useModalStore((state) => state.saveAsMarkdown);

  return (
    <Button onClick={saveAsMarkdown}>
      <Save /> Save
    </Button>
  );
};

export default SaveButton;
