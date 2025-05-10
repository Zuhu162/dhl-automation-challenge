import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IconLinkProps {
  type: "github" | "portfolio";
  href: string;
}

export function IconLink({ type, href }: IconLinkProps) {
  const icon =
    type === "github" ? (
      <Github className="h-5 w-5" />
    ) : (
      <Globe className="h-5 w-5" />
    );
  const tooltip =
    type === "github" ? "View GitHub Repository" : "Visit Portfolio";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent"
            asChild>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center">
              {icon}
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
