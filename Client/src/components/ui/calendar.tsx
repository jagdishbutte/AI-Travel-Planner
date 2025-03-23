import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 select-none w-[286px]", className)}
      classNames={{
        months: "flex flex-col space-y-3",
        month: "space-y-2",
        caption: "relative flex items-center justify-center py-1",
        caption_label: "text-base font-medium text-white",
        nav: "space-x- flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-gray-700 rounded-md hover:bg-gray-600 inline-flex items-center justify-center",
          "text-gray-100 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between w-full",
        head_cell: "w-9 font-normal text-[0.8rem] text-gray-400",
        row: "flex w-full justify-between",
        cell: cn(
          "relative p-0 text-center text-sm w-9",
          "[&:has([aria-selected])]:bg-gray-700",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          "h-9 w-9 p-2 ml-4 font-normal text-sm rounded-md",
          "hover:bg-gray-600 hover:text-white focus:bg-gray-600 focus:text-white",
          "text-gray-100 cursor-pointer transition-colors aria-selected:opacity-100"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
        day_today: "bg-gray-700 text-white",
        day_outside:
          "text-gray-500 opacity-50 hover:bg-gray-600/50 hover:text-gray-300",
        day_disabled:
          "text-gray-500 opacity-50 hover:bg-transparent cursor-not-allowed",
        day_range_middle: "aria-selected:bg-gray-700 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
