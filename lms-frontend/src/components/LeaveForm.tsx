import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, isValid } from "date-fns";
import { AlertCircle, CalendarIcon, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LeaveApplication,
  LeaveFormData,
  LeaveStatus,
  LeaveType,
} from "@/types";
import { leaveService } from "@/services/leaveService";
import CheckLeave from "@/components/CheckLeave";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface LeaveFormProps {
  onSuccess: () => void;
  application?: LeaveApplication;
  readOnly?: boolean;
}

// Define option types for our selects
const leaveTypeOptions = ["Annual", "Medical", "Emergency", "Other"] as const;
const statusOptions = ["Pending", "Approved", "Rejected"] as const;

const formSchema = z
  .object({
    employeeId: z.string().min(1, { message: "Staff ID is required" }),
    employeeName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    leaveType: z.enum(leaveTypeOptions, {
      errorMap: () => ({ message: "Please select a valid leave type" }),
    }),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    status: z.enum(statusOptions, {
      errorMap: () => ({ message: "Please select a valid status" }),
    }),
  })
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    }
  );

export default function LeaveForm({
  onSuccess,
  application,
  readOnly = false,
}: LeaveFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDuplicateFound, setIsDuplicateFound] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [leaveTypeInput, setLeaveTypeInput] = useState<string>(
    application?.leaveType || "Annual"
  );
  const [statusInput, setStatusInput] = useState<string>(
    application?.status || "Pending"
  );
  const [filteredLeaveTypes, setFilteredLeaveTypes] = useState<string[]>(
    Array.from(leaveTypeOptions)
  );
  const [filteredStatuses, setFilteredStatuses] = useState<string[]>(
    Array.from(statusOptions)
  );
  const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: application
      ? {
          ...application,
          startDate: new Date(application.startDate),
          endDate: new Date(application.endDate),
        }
      : {
          employeeId: "",
          employeeName: "",
          leaveType: "Annual" as LeaveType,
          startDate: new Date(),
          endDate: new Date(),
          status: "Pending" as LeaveStatus,
        },
    mode: "onChange",
  });

  // Function to handle manual date input changes
  const handleManualDateChange = (
    value: string,
    field: { onChange: (date: Date | undefined) => void },
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    fieldName: "startDate" | "endDate"
  ) => {
    if (readOnly) return;
    setInputValue(value);

    if (!value) {
      field.onChange(undefined);
      return;
    }

    // If the input doesn't match DD/MM/YYYY pattern, don't try to parse it
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      return;
    }

    try {
      const [day, month, year] = value
        .split("/")
        .map((part) => parseInt(part, 10));
      const date = new Date(year, month - 1, day);

      if (isValid(date)) {
        field.onChange(date);

        // Validate date range if both dates are set
        const startDate =
          fieldName === "startDate" ? date : form.getValues("startDate");
        const endDate =
          fieldName === "endDate" ? date : form.getValues("endDate");

        if (startDate && endDate && endDate < startDate) {
          form.setError("endDate", {
            message: "End date must be on or after the start date",
          });
        } else {
          form.clearErrors("endDate");
        }
      }
    } catch (error) {
      console.log("Invalid date format:", error);
    }
  };

  // Function to handle leave type input
  const handleLeaveTypeChange = (
    value: string,
    field: { onChange: (value: string) => void }
  ) => {
    if (readOnly) return;
    setLeaveTypeInput(value);

    const filtered = leaveTypeOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLeaveTypes(filtered);

    if (value) {
      setShowLeaveTypeOptions(true);
    }

    field.onChange(value);

    if (!leaveTypeOptions.includes(value as LeaveType) && value) {
      form.setError("leaveType", {
        message: "Please select a valid leave type",
      });
    }
  };

  // Function to handle status input
  const handleStatusChange = (
    value: string,
    field: { onChange: (value: string) => void }
  ) => {
    if (readOnly) return;
    setStatusInput(value);

    const filtered = statusOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStatuses(filtered);

    if (value) {
      setShowStatusOptions(true);
    }

    field.onChange(value);

    if (!statusOptions.includes(value as LeaveStatus) && value) {
      form.setError("status", {
        message: "Please select a valid status",
      });
    }
  };

  // Function to select an option from the leave type dropdown
  const selectLeaveType = (
    option: string,
    field: { onChange: (value: string) => void }
  ) => {
    if (readOnly) return;
    setLeaveTypeInput(option);
    field.onChange(option);
    setShowLeaveTypeOptions(false);
  };

  // Function to select an option from the status dropdown
  const selectStatus = (
    option: string,
    field: { onChange: (value: string) => void }
  ) => {
    if (readOnly) return;
    setStatusInput(option);
    field.onChange(option);
    setShowStatusOptions(false);
  };

  // Update input fields when date values change via calendar
  useEffect(() => {
    const startDate = form.watch("startDate");
    if (startDate) {
      setStartDateInput(format(startDate, "dd/MM/yyyy"));
    }
  }, [form.watch("startDate")]);

  useEffect(() => {
    const endDate = form.watch("endDate");
    if (endDate) {
      setEndDateInput(format(endDate, "dd/MM/yyyy"));
    }
  }, [form.watch("endDate")]);

  // Update input values when form values change
  useEffect(() => {
    const leaveType = form.watch("leaveType");
    if (leaveType) {
      setLeaveTypeInput(leaveType);
    }
  }, [form.watch("leaveType")]);

  useEffect(() => {
    const status = form.watch("status");
    if (status) {
      setStatusInput(status);
    }
  }, [form.watch("status")]);

  // Handle clicks outside the dropdowns
  useEffect(() => {
    const handleClickOutside = () => {
      setShowLeaveTypeOptions(false);
      setShowStatusOptions(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (readOnly || isDuplicateFound || isCheckingDuplicate) return;

    setIsSubmitting(true);

    try {
      // Format dates directly without timezone conversion
      const formatDate = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
      };

      const leaveData: LeaveFormData = {
        employeeId: values.employeeId,
        employeeName: values.employeeName,
        leaveType: values.leaveType as LeaveType,
        startDate: formatDate(values.startDate),
        endDate: formatDate(values.endDate),
        status: values.status as LeaveStatus,
      };

      if (application?._id) {
        await leaveService.update(application._id, leaveData);
        toast({
          title: "Leave application updated",
          description: "The leave application has been updated successfully.",
        });
      } else {
        await leaveService.create(leaveData);
        toast({
          title: "Leave application submitted",
          description: "The leave application has been submitted successfully.",
        });
      }

      onSuccess();
      form.reset();
      setStartDateInput("");
      setEndDateInput("");
      setLeaveTypeInput("Annual");
      setStatusInput("Pending");
      setIsDuplicateFound(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to clear all form fields
  const handleClearFields = () => {
    if (readOnly) return;
    form.reset({
      employeeName: "",
      employeeId: "",
      leaveType: "Annual",
      startDate: undefined,
      endDate: undefined,
      status: "Pending",
    });
    setStartDateInput("");
    setEndDateInput("");
    setLeaveTypeInput("Annual");
    setStatusInput("Pending");
    setIsDuplicateFound(false);
    toast({
      title: "Form fields cleared",
      description: "All fields have been reset.",
    });
  };

  // Handle duplicate detection callback
  const handleDuplicateFound = (isDuplicate: boolean) => {
    setIsDuplicateFound(isDuplicate);
    setIsCheckingDuplicate(false);
  };

  // Get current form values for duplicate checking
  const employeeId = form.watch("employeeId");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="leaveform-employeeName">
                  Employee Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="leaveform-employeeName"
                    placeholder="e.g. John Doe"
                    {...field}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="leaveform-employeeId">Staff ID</FormLabel>
                <FormControl>
                  <Input
                    id="leaveform-employeeId"
                    placeholder="e.g. EMP001"
                    {...field}
                    disabled={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="leaveType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="leaveform-leaveType">Leave Type</FormLabel>
              <div className="relative">
                <Input
                  id="leaveform-leaveType"
                  placeholder="Search or select leave type"
                  value={leaveTypeInput}
                  onChange={(e) => handleLeaveTypeChange(e.target.value, field)}
                  onFocus={() => setShowLeaveTypeOptions(true)}
                  disabled={readOnly}
                  className={cn(
                    form.formState.errors.leaveType && "border-red-500"
                  )}
                />
                {showLeaveTypeOptions && !readOnly && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredLeaveTypes.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectLeaveType(option, field);
                        }}
                        id={`leaveform-leaveType-option-${option}`}>
                        {option}
                      </div>
                    ))}
                    {filteredLeaveTypes.length === 0 && (
                      <div className="px-4 py-2 text-gray-500">
                        No matching leave types
                      </div>
                    )}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="leaveform-startDate">
                  Start Date (DD/MM/YYYY)
                </FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      id="leaveform-startDate"
                      placeholder="DD/MM/YYYY"
                      value={startDateInput}
                      onChange={(e) =>
                        handleManualDateChange(
                          e.target.value,
                          field,
                          setStartDateInput,
                          "startDate"
                        )
                      }
                      disabled={readOnly}
                      className="rounded-r-none"
                    />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger asChild disabled={readOnly}>
                      <Button
                        id="leaveform-startDate-calendar-btn"
                        variant="outline"
                        className="rounded-l-none border-l-0 px-2">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={readOnly}
                        className="p-3 pointer-events-auto"
                        id="leaveform-startDate-calendar"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Type in format DD/MM/YYYY or use calendar
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel htmlFor="leaveform-endDate">
                  End Date (DD/MM/YYYY)
                </FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input
                      id="leaveform-endDate"
                      placeholder="DD/MM/YYYY"
                      value={endDateInput}
                      onChange={(e) =>
                        handleManualDateChange(
                          e.target.value,
                          field,
                          setEndDateInput,
                          "endDate"
                        )
                      }
                      disabled={readOnly}
                      className="rounded-r-none"
                    />
                  </FormControl>
                  <Popover>
                    <PopoverTrigger asChild disabled={readOnly}>
                      <Button
                        id="leaveform-endDate-calendar-btn"
                        variant="outline"
                        className="rounded-l-none border-l-0 px-2">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={readOnly}
                        className="p-3 pointer-events-auto"
                        id="leaveform-endDate-calendar"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Type in format DD/MM/YYYY or use calendar
                </p>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="leaveform-status">Status</FormLabel>
              <div className="relative">
                <Input
                  id="leaveform-status"
                  placeholder="Search or select status"
                  value={statusInput}
                  onChange={(e) => handleStatusChange(e.target.value, field)}
                  onFocus={() => setShowStatusOptions(true)}
                  disabled={readOnly}
                  className={cn(
                    form.formState.errors.status && "border-red-500"
                  )}
                />
                {showStatusOptions && !readOnly && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredStatuses.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectStatus(option, field);
                        }}
                        id={`leaveform-status-option-${option}`}>
                        {option}
                      </div>
                    ))}
                    {filteredStatuses.length === 0 && (
                      <div className="px-4 py-2 text-gray-500">
                        No matching statuses
                      </div>
                    )}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {!readOnly && (
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFields}
              className="flex items-center gap-2"
              id="leaveform-clear-btn">
              <RefreshCw className="h-4 w-4" />
              Clear Fields
            </Button>
            <Button
              type="submit"
              disabled={
                !form.formState.isValid ||
                isDuplicateFound ||
                isCheckingDuplicate ||
                isSubmitting
              }
              id="leaveform-submit-btn">
              {isSubmitting
                ? "Saving..."
                : application?._id
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        )}

        {readOnly && (
          <div className="flex justify-end">
            <Button type="button" onClick={onSuccess} variant="outline">
              Close
            </Button>
          </div>
        )}

        {isDuplicateFound && !readOnly && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Cannot submit duplicate entry
          </div>
        )}

        {/* Display the duplicate check component when all required fields are filled */}
        {!readOnly && employeeId && startDate && endDate && (
          <CheckLeave
            employeeId={employeeId}
            startDate={startDate}
            endDate={endDate}
            onDuplicateFound={handleDuplicateFound}
          />
        )}
      </form>
    </Form>
  );
}
