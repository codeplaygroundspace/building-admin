-- Create a function to set expense_month based on the month the service was FOR
CREATE OR REPLACE FUNCTION set_expense_month()
RETURNS TRIGGER AS $$
BEGIN
  -- Set expense_month based on service period priority:
  -- date_from is preferred since it indicates when the service period started
  NEW.expense_month := 
    CASE 
      -- For expenses with a date range, use the starting date (date_from) as the canonical month
      -- This represents the month the service was FOR (like April admin fees)
      WHEN NEW.date_from IS NOT NULL THEN to_char(NEW.date_from, 'Month YYYY')
      -- For expenses without date_from, fall back to date_to or created_at
      WHEN NEW.date_to IS NOT NULL THEN to_char(NEW.date_to, 'Month YYYY')
      ELSE to_char(NEW.created_at, 'Month YYYY')
    END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set expense_month for new or updated records
CREATE TRIGGER set_expense_month_trigger
BEFORE INSERT OR UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION set_expense_month(); 