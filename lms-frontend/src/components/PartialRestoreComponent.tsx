import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import axios from "axios";

interface PartialRestoreComponentProps {
  logId: string;
  createdAt: string;
  onRestore?: () => void; // Optional callback after restore
}
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PartialRestoreComponent = ({
  logId,
  createdAt,
  onRestore,
}: PartialRestoreComponentProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/automation-logs/${logId}/restore`
      );
      toast.success(
        `System restored. ${res.data.deletedCount} leave records deleted.`
      );
      setOpen(false);
      if (onRestore) onRestore();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Restore failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Restore failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Partial Restore
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Confirm Partial Restore
            </DialogTitle>
            <DialogDescription>
              <div className="mt-2 text-sm text-gray-700">
                Are you sure you want to restore the system to the state as of{" "}
                <b>{new Date(createdAt).toLocaleString()}</b>?<br />
                <br />
                <span className="text-red-600 font-semibold">
                  This action cannot be undone.
                </span>
                <br />
                <br />
                <ul className="list-disc pl-5">
                  <li>
                    All leave data created <b>after</b> this point will be
                    permanently deleted.
                  </li>
                  <li>
                    <b>Manually deleted data will NOT be restored.</b>
                  </li>
                  <li>
                    This is a destructive operation and should be used with
                    caution.
                  </li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleRestore}
              disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Restoring...
                </>
              ) : (
                "Yes, Restore"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PartialRestoreComponent;
