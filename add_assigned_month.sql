-- Add expenses_assigned_month column to expenses table
ALTER TABLE public.expenses ADD COLUMN expenses_assigned_month TEXT;

-- Add a comment to explain the purpose of this field
COMMENT ON COLUMN public.expenses.expenses_assigned_month IS 'The month this expense is assigned to for reporting and UI display, regardless of payment date. Format: "Month YYYY"';

-- Initially populate based on date_from (service start date) as default
UPDATE public.expenses 
SET expenses_assigned_month = 
  CASE 
    WHEN date_from IS NOT NULL THEN to_char(date_from, 'Month YYYY')
    WHEN date_to IS NOT NULL THEN to_char(date_to, 'Month YYYY')
    ELSE to_char(created_at, 'Month YYYY')
  END;

-- Create a function to set a default value for new expenses
CREATE OR REPLACE FUNCTION set_default_assigned_month()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set a default if expenses_assigned_month is NULL
  IF NEW.expenses_assigned_month IS NULL THEN
    NEW.expenses_assigned_month := 
      CASE 
        WHEN NEW.date_from IS NOT NULL THEN to_char(NEW.date_from, 'Month YYYY')
        WHEN NEW.date_to IS NOT NULL THEN to_char(NEW.date_to, 'Month YYYY')
        ELSE to_char(NEW.created_at, 'Month YYYY')
      END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to set the default value for new or updated expenses
CREATE TRIGGER default_assigned_month_trigger
BEFORE INSERT OR UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION set_default_assigned_month(); 