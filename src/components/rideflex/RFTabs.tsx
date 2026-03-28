import React from "react";
import { cn } from "./utils";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({ value: "", onValueChange: () => {} });

interface RFTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const RFTabs = React.forwardRef<HTMLDivElement, RFTabsProps>(
  ({ className, defaultValue = "", value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const controlledValue = value !== undefined ? value : internalValue;
    const handleChange = (v: string) => {
      if (value === undefined) setInternalValue(v);
      onValueChange?.(v);
    };
    return (
      <TabsContext.Provider value={{ value: controlledValue, onValueChange: handleChange }}>
        <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>{children}</div>
      </TabsContext.Provider>
    );
  }
);
RFTabs.displayName = "RFTabs";

const RFTabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="tablist" className={cn("inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground", className)} {...props} />
  )
);
RFTabsList.displayName = "RFTabsList";

const RFTabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(
  ({ className, value: tabValue, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(TabsContext);
    const isActive = value === tabValue;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={() => onValueChange(tabValue)}
        className={cn(
          "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center rounded-md px-2 py-0.5 text-sm font-medium whitespace-nowrap transition-all",
          isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
RFTabsTrigger.displayName = "RFTabsTrigger";

const RFTabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value: tabValue, ...props }, ref) => {
    const { value } = React.useContext(TabsContext);
    if (value !== tabValue) return null;
    return <div ref={ref} role="tabpanel" className={cn("flex-1 text-sm outline-none", className)} {...props} />;
  }
);
RFTabsContent.displayName = "RFTabsContent";

export { RFTabs, RFTabsList, RFTabsTrigger, RFTabsContent };
