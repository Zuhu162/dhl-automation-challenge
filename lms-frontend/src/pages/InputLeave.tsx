import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format, parse, isValid } from "date-fns";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CheckLeave from "@/components/CheckLeave";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertCircle, CalendarIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LeaveType, LeaveStatus } from "@/types";
import { leaveService } from "@/services/leaveService";

const formSchema = z
  .object({
    employeeName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),
    employeeId: z.string().min(1, { message: "Staff ID is required" }),
    leaveType: z.enum(["Annual", "Medical", "Emergency", "Other"] as const, {
      errorMap: () => ({ message: "Please select a valid leave type" }),
    }),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    status: z.enum(["Pending", "Approved", "Rejected"] as const, {
      errorMap: () => ({ message: "Please select a valid status" }),
    }),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof formSchema>;

// Define option types for our selects
const leaveTypeOptions = ["Annual", "Medical", "Emergency", "Other"];
const statusOptions = ["Pending", "Approved", "Rejected"];

const InputLeave = () => {
  const [isDuplicateFound, setIsDuplicateFound] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [leaveTypeInput, setLeaveTypeInput] = useState("Annual");
  const [statusInput, setStatusInput] = useState("Pending");
  const [filteredLeaveTypes, setFilteredLeaveTypes] =
    useState<string[]>(leaveTypeOptions);
  const [filteredStatuses, setFilteredStatuses] =
    useState<string[]>(statusOptions);
  const [showLeaveTypeOptions, setShowLeaveTypeOptions] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: "",
      employeeId: "",
      leaveType: "Annual",
      status: "Pending",
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
    setInputValue(value);

    if (!value) {
      field.onChange(undefined);
      return;
    }

    // Improved date parsing
    // If the input doesn't match DD/MM/YYYY pattern, don't try to parse it
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      return;
    }

    try {
      // Use a safer way to parse the date
      const [day, month, year] = value
        .split("/")
        .map((part) => parseInt(part, 10));
      const date = new Date(year, month - 1, day);

      // Check if the result is a valid date
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
    setLeaveTypeInput(value);

    // Filter options based on input
    const filtered = leaveTypeOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredLeaveTypes(filtered);

    // Show dropdown when typing
    if (value) {
      setShowLeaveTypeOptions(true);
    }

    // Update form field with the value to trigger validation
    field.onChange(value);

    // If it's not a valid option, it will trigger the validation error
    if (!leaveTypeOptions.includes(value) && value) {
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
    setStatusInput(value);

    // Filter options based on input
    const filtered = statusOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStatuses(filtered);

    // Show dropdown when typing
    if (value) {
      setShowStatusOptions(true);
    }

    // Update form field with the value to trigger validation
    field.onChange(value);

    // If it's not a valid option, it will trigger the validation error
    if (!statusOptions.includes(value) && value) {
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
    setLeaveTypeInput(option);
    field.onChange(option);
    setShowLeaveTypeOptions(false);
  };

  // Function to select an option from the status dropdown
  const selectStatus = (
    option: string,
    field: { onChange: (value: string) => void }
  ) => {
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

  const onSubmit = (data: FormValues) => {
    // Validate that end date is not before start date
    if (data.endDate < data.startDate) {
      form.setError("endDate", {
        message: "End date must be on or after the start date",
      });
      return;
    }

    // Create a new leave application
    const leaveFormData = {
      employeeName: data.employeeName,
      employeeId: data.employeeId,
      leaveType: data.leaveType as LeaveType,
      startDate: format(data.startDate, "yyyy-MM-dd"), // Keep backend format as yyyy-MM-dd
      endDate: format(data.endDate, "yyyy-MM-dd"),
      status: data.status as LeaveStatus,
    };

    try {
      // Use the correct create method from leaveService
      leaveService.create(leaveFormData);

      toast.success("Leave application submitted successfully");
      form.reset();
      setStartDateInput("");
      setEndDateInput("");
      setLeaveTypeInput("Annual");
      setStatusInput("Pending");
      setIsDuplicateFound(false);
    } catch (error) {
      toast.error("Failed to submit leave application");
      console.error(error);
    }
  };

  // Add a function to clear all form fields
  const handleClearFields = () => {
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
    toast.info("Form fields cleared");
  };

  // Check if end date is after start date
  useEffect(() => {
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

    if (startDate && endDate && endDate < startDate) {
      form.setError("endDate", {
        type: "manual",
        message: "End date cannot be before start date",
      });
    }
  }, [form.watch("startDate"), form.watch("endDate")]);

  // Get current form values for duplicate checking
  const employeeId = form.watch("employeeId");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Handle duplicate detection callback
  const handleDuplicateFound = (isDuplicate: boolean) => {
    setIsDuplicateFound(isDuplicate);
    setIsCheckingDuplicate(false);
  };

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Input Leave Data</h1>
              <p className="text-gray-600">
                Manually create a new leave application
              </p>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto" id="leave-application-card">
            <CardHeader>
              <CardTitle>Leave Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="leave-application-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6">
                  <FormField
                    control={form.control}
                    name="employeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="employee-name-input">
                          Employee Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="employee-name-input"
                            placeholder="John Doe"
                            {...field}
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
                        <FormLabel htmlFor="employee-id-input">
                          Staff ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="employee-id-input"
                            placeholder="EMP001"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leaveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="leave-type-input">
                          Leave Type
                        </FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="Search or select leave type"
                            value={leaveTypeInput}
                            onChange={(e) =>
                              handleLeaveTypeChange(e.target.value, field)
                            }
                            onFocus={() => setShowLeaveTypeOptions(true)}
                            className={cn(
                              form.formState.errors.leaveType &&
                                "border-red-500"
                            )}
                          />
                          {showLeaveTypeOptions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {filteredLeaveTypes.map((option) => (
                                <div
                                  key={option}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectLeaveType(option, field);
                                  }}>
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
                          <FormLabel htmlFor="start-date-input">
                            Start Date (DD/MM/YYYY)
                          </FormLabel>
                          <div className="flex">
                            <FormControl>
                              <Input
                                id="start-date-input"
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
                                className="rounded-r-none"
                              />
                            </FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="start-date-calendar-button"
                                  variant="outline"
                                  className="rounded-l-none border-l-0 px-2">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start">
                                <Calendar
                                  id="start-date-calendar"
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
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
                          <FormLabel htmlFor="end-date-input">
                            End Date (DD/MM/YYYY)
                          </FormLabel>
                          <div className="flex">
                            <FormControl>
                              <Input
                                id="end-date-input"
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
                                className="rounded-r-none"
                              />
                            </FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="end-date-calendar-button"
                                  variant="outline"
                                  className="rounded-l-none border-l-0 px-2">
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start">
                                <Calendar
                                  id="end-date-calendar"
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className="p-3 pointer-events-auto"
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
                        <FormLabel htmlFor="status-input">Status</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="Search or select status"
                            value={statusInput}
                            onChange={(e) =>
                              handleStatusChange(e.target.value, field)
                            }
                            onFocus={() => setShowStatusOptions(true)}
                            className={cn(
                              form.formState.errors.status && "border-red-500"
                            )}
                          />
                          {showStatusOptions && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {filteredStatuses.map((option) => (
                                <div
                                  key={option}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectStatus(option, field);
                                  }}>
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

                  <div className="flex justify-between">
                    <Button
                      id="clear-fields-button"
                      variant="outline"
                      onClick={handleClearFields}
                      className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Clear Fields
                    </Button>
                    <Button
                      id="submit-leave-button"
                      type="submit"
                      className="bg-dhl-red hover:bg-red-700"
                      disabled={
                        !form.formState.isValid ||
                        isDuplicateFound ||
                        isCheckingDuplicate
                      }>
                      Submit
                    </Button>
                  </div>
                  {isDuplicateFound && (
                    <div
                      id="duplicate-error-message"
                      className="flex items-center mr-4 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Cannot submit duplicate entry
                    </div>
                  )}
                </form>
              </Form>

              {/* Display the duplicate check component when all required fields are filled */}
              {employeeId && startDate && endDate && (
                <CheckLeave
                  employeeId={employeeId}
                  startDate={startDate}
                  endDate={endDate}
                  onDuplicateFound={handleDuplicateFound}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default InputLeave;
