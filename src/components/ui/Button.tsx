type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "accent" | "outline";
  block?: boolean;
};

const variants = {
  primary: "border-navy-700 bg-navy-700 text-white hover:bg-navy-600",
  accent: "border-gold-500 bg-gold-500 text-black hover:bg-gold-600",
  outline: "border-line bg-transparent text-navy-700 hover:border-navy-600",
};

export default function Button({ variant = "primary", block, className = "", ...rest }: Props) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center rounded-[10px] border px-5 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-65 ${variants[variant]} ${block ? "w-full" : ""} ${className}`.trim()}
      {...rest}
    />
  );
}