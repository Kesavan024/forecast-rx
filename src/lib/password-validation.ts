import { z } from "zod";

// Password strength requirements
export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

// Strong password schema with detailed validation
export const strongPasswordSchema = z
  .string()
  .min(passwordRequirements.minLength, `Password must be at least ${passwordRequirements.minLength} characters`)
  .refine(
    (password) => !passwordRequirements.requireUppercase || /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => !passwordRequirements.requireLowercase || /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => !passwordRequirements.requireNumber || /[0-9]/.test(password),
    "Password must contain at least one number"
  )
  .refine(
    (password) => !passwordRequirements.requireSpecialChar || /[!@#$%^&*(),.?":{}|<>]/.test(password),
    "Password must contain at least one special character (!@#$%^&*)"
  );

// Calculate password strength score (0-100)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let score = 0;
  
  // Length scoring (up to 30 points)
  score += Math.min(password.length * 3, 30);
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
  
  // Bonus for mixed characters
  const varietyCount = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ].filter(Boolean).length;
  
  if (varietyCount >= 3) score += 5;
  
  return Math.min(score, 100);
};

// Get password strength label and color
export const getPasswordStrengthInfo = (score: number): { label: string; color: string } => {
  if (score < 25) return { label: "Weak", color: "bg-red-500" };
  if (score < 50) return { label: "Fair", color: "bg-orange-500" };
  if (score < 75) return { label: "Good", color: "bg-yellow-500" };
  return { label: "Strong", color: "bg-green-500" };
};

// Get individual requirement status
export const getPasswordRequirementStatus = (password: string) => [
  {
    label: `At least ${passwordRequirements.minLength} characters`,
    met: password.length >= passwordRequirements.minLength,
  },
  {
    label: "Contains uppercase letter",
    met: /[A-Z]/.test(password),
  },
  {
    label: "Contains lowercase letter",
    met: /[a-z]/.test(password),
  },
  {
    label: "Contains number",
    met: /[0-9]/.test(password),
  },
  {
    label: "Contains special character",
    met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

// Email validation schema with additional security
export const secureEmailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters")
  .refine(
    (email) => !email.includes("+"), // Optional: prevent email aliases
    "Email aliases with '+' are not allowed"
  );

// Basic email schema (less strict)
export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");
