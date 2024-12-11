"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LogsIcon } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Email Templates",
    href: "/docs/features/email-templates",
    description:
      "Design and manage custom email templates for campaigns and automated workflows.",
  },
  {
    title: "Subscriber Segmentation",
    href: "/docs/features/subscriber-segmentation",
    description:
      "Segment your audience based on custom criteria for targeted email campaigns.",
  },
  {
    title: "Campaign Analytics",
    href: "/docs/features/campaign-analytics",
    description:
      "Track the performance of your email campaigns with detailed metrics and insights.",
  },
  {
    title: "Automated Workflows",
    href: "/docs/features/automated-workflows",
    description:
      "Create workflows to automate repetitive tasks like welcome emails and follow-ups.",
  },
  {
    title: "Dynamic Personalization",
    href: "/docs/features/dynamic-personalization",
    description:
      "Enhance engagement by personalizing email content with dynamic fields.",
  },
  {
    title: "Deliverability Insights",
    href: "/docs/features/deliverability-insights",
    description:
      "Monitor email deliverability rates and improve inbox placement with actionable insights.",
  },
];

export function NavigationMenuBar() {
  const matches = useMediaQuery("(min-width: 834px)");

  return (
    <NavigationMenu>
      {matches && (
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black hover:bg-paleblue">
              Getting started
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white">
              <ul className="grid gap-2 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3 rounded-xl bg-paleblue">
                  <NavigationMenuLink asChild>
                    <a
                      className="from-muted/50 to-muted flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <LogsIcon className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Miraj AI
                      </div>
                      <p className="text-muted-foreground text-sm leading-tight">
                        An advanced AI-powered SaaS email management system
                        designed to optimize workflows, automate responses, and
                        ensure seamless communication. Smart. Efficient.
                        Scalable.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem title="Overview">
                  Discover Miraj, the AI-powered SaaS email management system.
                  Learn its features and capabilities.
                </ListItem>
                <ListItem title="Automation">
                  Leverage AI to automate responses, prioritize emails, and
                  streamline communication workflows.
                </ListItem>
                <ListItem title="Analytics">
                  Gain insights into email performance and track communication
                  metrics effectively.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-black hover:bg-paleblue">
              Components
            </NavigationMenuTrigger>
            <NavigationMenuContent className="mr-16 bg-white">
              <ul className="grid w-[18.75rem] gap-3 p-4 md:w-[25rem] md:grid-cols-2 lg:w-[31.25rem]">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="rounded-xl bg-secondary hover:bg-paleblue">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
