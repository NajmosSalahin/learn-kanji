import zxcvbn from "zxcvbn";

export function PasswordStrengthMeter({ password }: { password: string }) {
  const result = zxcvbn(password);
  const score = result.score;
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];

  return (
    <div className="mt-1 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= score ? colors[score] : "bg-border"}`}
          />
        ))}
      </div>
      <p className="text-xs text-text-secondary">
        {labels[score]}
      </p>
    </div>
  );
}
