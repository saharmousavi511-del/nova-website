import { AlertCircle } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { toFa } from '@/lib/fa';

/* ------------------------------ پوسته فیلد ------------------------------ */

interface ShellProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ label, htmlFor, required, hint, error, children, className = '' }: ShellProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required ? <span className="req">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="error-text flex items-center gap-1.5">
          <AlertCircle size={13} />
          {error}
        </p>
      ) : hint ? (
        <p className="hint">{hint}</p>
      ) : null}
    </div>
  );
}

/* -------------------------------- ورودی‌ها -------------------------------- */

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
}

export function TextField({ label, hint, error, required, id, className = '', ...rest }: TextFieldProps) {
  const fieldId = id ?? rest.name ?? label;
  return (
    <FieldShell label={label} htmlFor={fieldId} required={required} hint={hint} error={error}>
      <input
        id={fieldId}
        className={`field ${error ? 'field-error' : ''} ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
}

export function TextAreaField({ label, hint, error, required, id, className = '', ...rest }: TextAreaFieldProps) {
  const fieldId = id ?? rest.name ?? label;
  return (
    <FieldShell label={label} htmlFor={fieldId} required={required} hint={hint} error={error}>
      <textarea
        id={fieldId}
        rows={4}
        className={`field resize-y leading-loose ${error ? 'field-error' : ''} ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
}

export function SelectField({ label, options, placeholder = 'انتخاب کن', hint, error, required, id, className = '', ...rest }: SelectFieldProps) {
  const fieldId = id ?? rest.name ?? label;
  return (
    <FieldShell label={label} htmlFor={fieldId} required={required} hint={hint} error={error}>
      <select id={fieldId} className={`field ${error ? 'field-error' : ''} ${className}`} aria-invalid={!!error} {...rest}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/* ------------------------------ انتخاب چندتایی ------------------------------ */

interface ChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  max?: number;
}

export function ChipGroupField({ label, options, selected, onToggle, required, hint, error, max }: ChipGroupProps) {
  return (
    <FieldShell label={label} required={required} hint={max ? `حداکثر ${toFa(max)} مورد انتخاب کن.` : hint} error={error}>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={active}
              className={`rounded-2xl border px-4 py-2.5 text-[0.83rem] font-bold transition-all duration-300 ${
                active
                  ? 'border-nova-300/60 bg-nova-400/15 text-nova-100 shadow-[0_8px_24px_-12px_rgba(255,138,61,0.8)]'
                  : 'border-white/10 bg-white/[0.03] text-ink-300 hover:border-white/22 hover:text-ink-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`grid h-4 w-4 place-items-center rounded-md text-[0.6rem] transition-colors ${
                    active ? 'bg-nova-300 text-space-950' : 'border border-white/25'
                  }`}
                >
                  {active ? '✓' : ''}
                </span>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* -------------------------------- رادیو -------------------------------- */

interface RadioGroupProps<T extends string> {
  label: string;
  options: { value: T; label: string; hint?: string }[];
  value: T | '';
  onChange: (value: T) => void;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
}

export function RadioGroupField<T extends string>({ label, options, value, onChange, required, hint, error }: RadioGroupProps<T>) {
  return (
    <FieldShell label={label} required={required} hint={hint} error={error}>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-start transition-all duration-300 ${
                active ? 'border-nebula-300/60 bg-nebula-400/12' : 'border-white/10 bg-white/[0.03] hover:border-white/22'
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                  active ? 'border-nebula-300 bg-nebula-400' : 'border-white/30'
                }`}
              >
                {active ? <span className="h-2 w-2 rounded-full bg-space-950" /> : null}
              </span>
              <span className="flex flex-col">
                <span className={`text-[0.86rem] font-bold ${active ? 'text-nebula-300' : 'text-ink-200'}`}>{option.label}</span>
                {option.hint ? <span className="text-[0.72rem] text-ink-400">{option.hint}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

/* ------------------------------ لغزنده ------------------------------ */

interface RangeProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  hint?: ReactNode;
  leftLabel?: string;
  rightLabel?: string;
  required?: boolean;
}

export function RangeField({ label, value, min = 1, max = 10, step = 1, onChange, hint, leftLabel, rightLabel, required }: RangeProps) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <FieldShell label={label} required={required} hint={hint}>
      <div className="flex items-center gap-4">
        <input
          type="range"
          dir="ltr"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="nova-range h-2 flex-1 cursor-pointer appearance-none rounded-full"
          style={{
            background: `linear-gradient(to right, #ffbf4f 0%, #ff8a3d ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`,
          }}
          aria-label={label}
        />
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-nova-300/35 bg-nova-400/12 text-lg font-black tabular-nums text-nova-200">
          {toFa(value)}
        </span>
      </div>
      {(leftLabel || rightLabel) && (
        <div className="mt-2 flex justify-between text-[0.72rem] text-ink-400">
          <span>{rightLabel}</span>
          <span>{leftLabel}</span>
        </div>
      )}
    </FieldShell>
  );
}
