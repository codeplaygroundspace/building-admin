-- Add a column for manually overriding the expense_month calculation
ALTER TABLE public.expenses ADD COLUMN expense_month_override TEXT;

-- Update the trigger function to respect manual overrides
CREATE OR REPLACE FUNCTION set_expense_month()
RETURNS TRIGGER AS $$
BEGIN
  -- If an override is provided, use that as the expense_month
  IF NEW.expense_month_override IS NOT NULL THEN
    NEW.expense_month := NEW.expense_month_override;
  ELSE
    -- Otherwise use the automatic calculation based on service period
    NEW.expense_month := 
      CASE 
        -- For expenses with a date range, use the starting date (date_from) 
        WHEN NEW.date_from IS NOT NULL THEN to_char(NEW.date_from, 'Month YYYY')
        -- For expenses without date_from, fall back to date_to or created_at
        WHEN NEW.date_to IS NOT NULL THEN to_char(NEW.date_to, 'Month YYYY')
        ELSE to_char(NEW.created_at, 'Month YYYY')
      END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a comment to explain the override field
COMMENT ON COLUMN public.expenses.expense_month_override IS 'Manual override for expense_month. Use this to force an expense to appear in a specific month report regardless of its dates.'; 