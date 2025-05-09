import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LeaveApplication,
  LeaveFormData,
  LeaveStatus,
  LeaveType,
} from "@/types";
import { leaveService } from "@/services/leaveService";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const formSchema = z
  .object({
    employeeId: z.string().min(1, "Employee ID is required"),
    employeeName: z.string().min(1, "Employee Name is required"),
    leaveType: z.enum(["Annual", "Medical", "Emergency", "Other"]),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z
      .date({
        required_error: "End date is required",
      })
      .refine((date) => date instanceof Date, {
        message: "End date is required",
      }),
    status: z.enum(["Pending", "Approved", "Rejected"]),
  })
  .refine(
    (data) => {
      return data.startDate <= data.endDate;
    },
    {
      message: "End date must be after or equal to start date",
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
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (readOnly) return;

    setIsSubmitting(true);

    try {
      const leaveData: LeaveFormData = {
        employeeId: values.employeeId,
        employeeName: values.employeeName,
        leaveType: values.leaveType as LeaveType,
        startDate: values.startDate.toISOString().split("T")[0],
        endDate: values.endDate.toISOString().split("T")[0],
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. EMP001"
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
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. John Doe"
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
              <FormLabel>Leave Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={readOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
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
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild disabled={readOnly}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={readOnly}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={readOnly}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild disabled={readOnly}>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled={readOnly}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      disabled={readOnly}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={readOnly}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {!readOnly && (
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
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
      </form>
    </Form>
  );
}
