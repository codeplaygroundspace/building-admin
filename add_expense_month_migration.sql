-- Add expense_month column to expenses table
ALTER TABLE public.expenses ADD COLUMN expense_month TEXT;

-- Update existing records to populate expense_month based on service period (date_from)
-- This prioritizes the month the service was FOR, not when it was paid
UPDATE public.expenses 
SET expense_month = 
  CASE 
    -- For expenses with a date range, use the starting date (date_from) as the canonical month
    -- This represents the month the service was FOR (like April admin fees)
    WHEN date_from IS NOT NULL THEN to_char(date_from, 'Month YYYY')
    -- For expenses without date ranges, fall back to date_to or created_at
    WHEN date_to IS NOT NULL THEN to_char(date_to, 'Month YYYY')
    ELSE to_char(created_at, 'Month YYYY')
  END;

-- Add a comment to explain the purpose of this field
COMMENT ON COLUMN public.expenses.expense_month IS 'The canonical month this expense belongs to for reporting/UI display (Month YYYY format). Represents the month the service was FOR, not when it was paid.';

-- Make this field mandatory for future records
ALTER TABLE public.expenses ALTER COLUMN expense_month SET NOT NULL; 