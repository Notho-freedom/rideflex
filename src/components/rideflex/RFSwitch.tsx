import React from "react";
import { cn } from "./utils";

interface RFSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

const RFSwitch = React.forwardRef<HTMLInputElement, RFSwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const controlledChecked = checked !== undefined ? checked : isChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) setIsChecked(newChecked);
      onChange?.(e);
      onCheckedChange?.(newChecked);
    };

    return (
      <label
        className={cn(
          "relative inline-flex h-[18.4px] w-[32px] shrink-0 cursor-pointer items-center rounded-full transition-all",
          controlledChecked ? "bg-primary" : "bg-input",
          className
        )}
      >
        <input ref={ref} type="checkbox" checked={controlledChecked} onChange={handleChange} className="sr-only" {...props} />
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-card ring-0 transition-transform",
            controlledChecked ? "translate-x-[calc(100%-2px)]" : "translate-x-0"
          )}
        />
      </label>
    );
  }
);
RFSwitch.displayName = "RFSwitch";

export { RFSwitch };
