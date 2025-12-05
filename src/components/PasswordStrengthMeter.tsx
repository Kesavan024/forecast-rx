import { Check, X } from "lucide-react";
import { 
  calculatePasswordStrength, 
  getPasswordStrengthInfo, 
  getPasswordRequirementStatus 
} from "@/lib/password-validation";

interface PasswordStrengthMeterProps {
  password: string;
  showRequirements?: boolean;
}

const PasswordStrengthMeter = ({ password, showRequirements = true }: PasswordStrengthMeterProps) => {
  const strength = calculatePasswordStrength(password);
  const { label, color } = getPasswordStrengthInfo(strength);
  const requirements = getPasswordRequirementStatus(password);

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={`font-medium ${
            strength < 25 ? "text-red-500" : 
            strength < 50 ? "text-orange-500" : 
            strength < 75 ? "text-yellow-500" : "text-green-500"
          }`}>
            {label}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${color}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div 
              key={index}
              className={`flex items-center gap-2 text-xs ${
                req.met ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {req.met ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
