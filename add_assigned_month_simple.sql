-- Add expenses_assigned_month column to expenses table
ALTER TABLE public.expenses ADD COLUMN expenses_assigned_month TEXT;

-- Add a comment to explain the purpose of this field
COMMENT ON COLUMN public.expenses.expenses_assigned_month IS 'The month this expense is assigned to for reporting and UI display, regardless of payment date. Format: "Month YYYY"'; 