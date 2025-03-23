// Creating the theme configuration file
export const theme = {
  light: {
    background: {
      primary: "bg-white",
      secondary: "bg-gray-50",
      tertiary: "bg-gray-100",
    },
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      tertiary: "text-gray-500",
      inverted: "text-white",
    },
    border: {
      primary: "border-gray-200",
      secondary: "border-gray-300",
    },
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },
    input: {
      background: "bg-white",
      border: "border-gray-300",
      placeholder: "placeholder-gray-400",
      focus: "focus:border-blue-500 focus:ring-blue-500",
    },
    calendar: {
      background: "bg-white",
      dayHover: "hover:bg-gray-100",
      selected: "bg-blue-600",
      today: "bg-gray-100",
      disabled: "text-gray-300",
    },
  },
  dark: {
    background: {
      primary: "bg-gray-900",
      secondary: "bg-gray-800",
      tertiary: "bg-gray-700",
    },
    text: {
      primary: "text-gray-100",
      secondary: "text-gray-300",
      tertiary: "text-gray-400",
      inverted: "text-gray-900",
    },
    border: {
      primary: "border-gray-700",
      secondary: "border-gray-600",
    },
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },
    input: {
      background: "bg-gray-800",
      border: "border-gray-600",
      placeholder: "placeholder-gray-500",
      focus: "focus:border-blue-500 focus:ring-blue-500",
    },
    calendar: {
      background: "bg-gray-800",
      dayHover: "hover:bg-gray-700",
      selected: "bg-blue-600",
      today: "bg-gray-700",
      disabled: "text-gray-600",
    },
  },
};
