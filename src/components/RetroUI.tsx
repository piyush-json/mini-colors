import React from "react";
import { cn } from "@/lib/utils";

// Retro 2010 Button Component
interface RetroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  type = "button",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-blue-500/25";
      case "secondary":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500 shadow-purple-500/25";
      case "success":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500 shadow-green-500/25";
      case "warning":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500 shadow-orange-500/25";
      case "error":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-red-500/25";
      case "info":
        return "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 focus:ring-cyan-500 shadow-cyan-500/25";
      case "outline":
        return "bg-transparent border-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-blue-500/25";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2 text-base";
      case "lg":
        return "px-6 py-3 text-lg";
      case "xl":
        return "px-8 py-4 text-xl";
      default:
        return "px-4 py-2 text-base";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg",
        getVariantClasses(),
        getSizeClasses(),
        className,
      )}
    >
      {children}
    </button>
  );
};

// Retro 2010 Card Component
interface RetroCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
}

export const RetroCard: React.FC<RetroCardProps> = ({
  title,
  children,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footer,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700",
        className,
      )}
    >
      {title && (
        <div
          className={cn(
            "px-6 py-4 border-b border-gray-200 rounded-t-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 dark:border-gray-700",
            headerClassName,
          )}
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className={cn("px-6 py-4", bodyClassName)}>{children}</div>
      {footer && (
        <div
          className={cn(
            "px-6 py-4 border-t border-gray-200 rounded-b-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 dark:border-gray-700",
            footerClassName,
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

// Retro 2010 Color Swatch Component
interface RetroColorSwatchProps {
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  showHex?: boolean;
  className?: string;
}

export const RetroColorSwatch: React.FC<RetroColorSwatchProps> = ({
  color,
  size = "md",
  showHex = false,
  className,
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "rounded-2xl border-4 border-white shadow-xl transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl mx-auto",
          sizeClasses[size],
        )}
        style={{ backgroundColor: color }}
      />
      {showHex && (
        <p className="mt-2 font-mono text-sm text-gray-600 dark:text-gray-400">
          {color}
        </p>
      )}
    </div>
  );
};

// Retro 2010 Timer Component
interface RetroTimerProps {
  seconds: number;
  className?: string;
}

export const RetroTimer: React.FC<RetroTimerProps> = ({
  seconds,
  className,
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "font-mono text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border-2 border-blue-200 dark:text-white dark:from-blue-900 dark:to-purple-900 dark:border-blue-700 text-center",
        className,
      )}
    >
      {formatTime(seconds)}
    </div>
  );
};

// Retro 2010 Spinner Component
interface RetroSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const RetroSpinner: React.FC<RetroSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 dark:border-gray-700 dark:border-t-blue-400",
        sizeClasses[size],
        className,
      )}
    />
  );
};

// Retro 2010 Score Display Component
interface RetroScoreDisplayProps {
  label: string;
  score: number;
  maxScore?: number;
  className?: string;
}

export const RetroScoreDisplay: React.FC<RetroScoreDisplayProps> = ({
  label,
  score,
  maxScore,
  className,
}) => {
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : score;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border-2 border-gray-200 shadow-lg dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 text-center",
        className,
      )}
    >
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div className={cn("text-2xl font-bold", getScoreColor(percentage))}>
        {maxScore ? `${score}/${maxScore}` : score}
      </div>
      {maxScore && (
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {percentage}%
        </div>
      )}
    </div>
  );
};

// Retro 2010 Badge Component
interface RetroBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  className?: string;
}

export const RetroBadge: React.FC<RetroBadgeProps> = ({
  children,
  variant = "primary",
  className,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "secondary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "info":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ease-in-out",
        getVariantClasses(),
        className,
      )}
    >
      {children}
    </span>
  );
};

// Retro 2010 Touch Area Component
interface TouchAreaProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const TouchArea: React.FC<TouchAreaProps> = ({
  children,
  onClick,
  className,
  disabled = false,
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 ease-in-out dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:from-blue-900 dark:hover:to-blue-800 p-6 text-center cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Retro 2010 Input Component
interface RetroInputProps {
  type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
}

export const RetroInput: React.FC<RetroInputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  required = false,
  maxLength,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      maxLength={maxLength}
      className={cn(
        "w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ease-in-out hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
        className,
      )}
    />
  );
};

// Retro 2010 Text Area Component
interface RetroTextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export const RetroTextArea: React.FC<RetroTextAreaProps> = ({
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  required = false,
  rows = 3,
  maxLength,
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      rows={rows}
      maxLength={maxLength}
      className={cn(
        "w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ease-in-out hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 resize-none",
        className,
      )}
    />
  );
};

// Retro 2010 Select Component
interface RetroSelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const RetroSelect: React.FC<RetroSelectProps> = ({
  value,
  onChange,
  children,
  className,
  disabled = false,
  required = false,
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={cn(
        "w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ease-in-out hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/20",
        className,
      )}
    >
      {children}
    </select>
  );
};

// Retro 2010 Checkbox Component
interface RetroCheckboxProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const RetroCheckbox: React.FC<RetroCheckboxProps> = ({
  checked = false,
  onChange,
  label,
  className,
  disabled = false,
}) => {
  return (
    <label
      className={cn("flex items-center space-x-2 cursor-pointer", className)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

// Retro 2010 Radio Component
interface RetroRadioProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const RetroRadio: React.FC<RetroRadioProps> = ({
  name,
  value,
  checked = false,
  onChange,
  label,
  className,
  disabled = false,
}) => {
  return (
    <label
      className={cn("flex items-center space-x-2 cursor-pointer", className)}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
};

// Retro 2010 Range Slider Component
interface RetroRangeProps {
  min: number;
  max: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export const RetroRange: React.FC<RetroRangeProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  className,
  disabled = false,
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      step={step}
      disabled={disabled}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700",
        className,
      )}
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
      }}
    />
  );
};

// Retro 2010 Progress Bar Component
interface RetroProgressProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
}

export const RetroProgress: React.FC<RetroProgressProps> = ({
  value,
  max,
  className,
  showLabel = false,
  variant = "primary",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600",
    secondary: "bg-gradient-to-r from-purple-500 to-purple-600",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600",
    error: "bg-gradient-to-r from-red-500 to-red-600",
    info: "bg-gradient-to-r from-cyan-500 to-cyan-600",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
        <div
          className={cn(
            "h-3 rounded-full transition-all duration-500 ease-out",
            variantClasses[variant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Retro 2010 Divider Component
interface RetroDividerProps {
  className?: string;
  text?: string;
}

export const RetroDivider: React.FC<RetroDividerProps> = ({
  className,
  text,
}) => {
  if (text) {
    return (
      <div className={cn("flex items-center my-4", className)}>
        <div className="flex-1 border-t-2 border-gray-300 dark:border-gray-600" />
        <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {text}
        </span>
        <div className="flex-1 border-t-2 border-gray-300 dark:border-gray-600" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t-2 border-gray-300 dark:border-gray-600 my-4",
        className,
      )}
    />
  );
};

// Retro 2010 Alert Component
interface RetroAlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const RetroAlert: React.FC<RetroAlertProps> = ({
  type = "info",
  title,
  children,
  className,
}) => {
  const typeClasses = {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    warning:
      "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-200",
    error:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
  };

  const icons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div
      className={cn("border-2 rounded-2xl p-4", typeClasses[type], className)}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="flex-1">
          {title && <h4 className="font-bold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};
