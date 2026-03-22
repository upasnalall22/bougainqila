import { useState, useRef, useEffect } from "react";
import { searchCities, type CityEntry } from "@/data/indianCities";

export interface CustomerFormData {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
}

export const emptyCustomerForm: CustomerFormData = {
  salutation: "Mr.",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  city: "",
  state: "",
  pincode: "",
  address: "",
};

export interface CustomerFormErrors {
  firstName?: string;
  email?: string;
  mobile?: string;
  pincode?: string;
}

export function validateCustomerForm(form: CustomerFormData): CustomerFormErrors {
  const errors: CustomerFormErrors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }
  const digits = form.mobile.replace(/\s/g, "");
  if (!digits) {
    errors.mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(digits)) {
    errors.mobile = "Enter exactly 10 digits";
  }
  if (!form.pincode.trim()) {
    errors.pincode = "Pincode is required";
  } else if (!/^\d{6}$/.test(form.pincode.trim())) {
    errors.pincode = "Enter exactly 6 digits";
  }
  return errors;
}

const WHATSAPP_NUMBER = "919999999999";
const PHONE_NUMBER = "+919999999999";
const EMAIL_ADDRESS = "hello@bougainqila.com";

const inputClass =
  "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground rounded-sm focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "text-xs tracking-widest uppercase text-muted-foreground block mb-1";
const errorClass = "text-xs text-destructive mt-1";

interface Props {
  form: CustomerFormData;
  onChange: (form: CustomerFormData) => void;
  errors: CustomerFormErrors;
  onBlurValidate?: (field: keyof CustomerFormErrors) => void;
  showAddress?: boolean;
}

export default function CustomerFormFields({ form, onChange, errors, onBlurValidate, showAddress = false }: Props) {
  const [citySuggestions, setCitySuggestions] = useState<CityEntry[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof CustomerFormData, value: string) => {
    onChange({ ...form, [key]: value });
  };

  const handleCityInput = (value: string) => {
    set("city", value);
    const results = searchCities(value);
    setCitySuggestions(results);
    setShowCityDropdown(results.length > 0);
  };

  const selectCity = (entry: CityEntry) => {
    onChange({ ...form, city: entry.city, state: entry.state });
    setShowCityDropdown(false);
  };

  // Close city dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-4">
      {/* NAME */}
      <div className="grid grid-cols-[100px_1fr_1fr] gap-2">
        <div>
          <label className={labelClass}>Title</label>
          <select
            value={form.salutation}
            onChange={(e) => set("salutation", e.target.value)}
            className={inputClass}
          >
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            onBlur={() => onBlurValidate?.("firstName")}
            maxLength={100}
            placeholder="First name"
            className={inputClass}
          />
          {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            maxLength={100}
            placeholder="Last name"
            className={inputClass}
          />
        </div>
      </div>

      {/* CONTACT */}
      <div>
        <label className={labelClass}>Mobile *</label>
        <div className="flex gap-2">
          <div className="border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground rounded-sm flex items-center gap-1 flex-shrink-0 select-none">
            <span>🇮🇳</span>
            <span>+91</span>
          </div>
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/[^\d\s]/g, "").slice(0, 12))}
            onBlur={() => onBlurValidate?.("mobile")}
            placeholder="10-digit mobile number"
            className={inputClass}
          />
        </div>
        {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
        <p className="text-xs text-muted-foreground mt-1.5">
          Outside India? Reach us on{" "}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="underline text-primary">
            WhatsApp
          </a>
          ,{" "}
          <a href={`tel:${PHONE_NUMBER}`} className="underline text-primary">
            call
          </a>
          , or{" "}
          <a href={`mailto:${EMAIL_ADDRESS}`} className="underline text-primary">
            email
          </a>
          .
        </p>
      </div>

      <div>
        <label className={labelClass}>Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => onBlurValidate?.("email")}
          maxLength={255}
          placeholder="you@example.com"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      {/* LOCATION */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div ref={cityRef} className="relative">
          <label className={labelClass}>City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => handleCityInput(e.target.value)}
            onFocus={() => {
              if (form.city.length >= 2) {
                const results = searchCities(form.city);
                setCitySuggestions(results);
                setShowCityDropdown(results.length > 0);
              }
            }}
            placeholder="Search city"
            className={inputClass}
            autoComplete="off"
          />
          {showCityDropdown && (
            <div className="absolute z-50 top-full left-0 right-0 bg-background border border-border rounded-sm shadow-lg max-h-48 overflow-y-auto mt-0.5">
              {citySuggestions.map((c) => (
                <button
                  key={c.city + c.state}
                  type="button"
                  onClick={() => selectCity(c)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {c.city}, <span className="text-muted-foreground">{c.state}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input
            type="text"
            value={form.state}
            readOnly
            tabIndex={-1}
            placeholder="Auto-filled"
            className={`${inputClass} bg-muted cursor-not-allowed`}
          />
        </div>
        <div>
          <label className={labelClass}>Pincode *</label>
          <input
            type="text"
            value={form.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            onBlur={() => onBlurValidate?.("pincode")}
            maxLength={6}
            placeholder="6-digit pincode"
            className={inputClass}
          />
          {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}
        </div>
      </div>

      {/* ADDRESS (optional, shown for checkout) */}
      {showAddress && (
        <div>
          <label className={labelClass}>Address</label>
          <textarea
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Street address, landmark"
            className={`${inputClass} resize-none`}
          />
        </div>
      )}
    </div>
  );
}
