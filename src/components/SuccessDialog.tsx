import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCelebration?: boolean;
}

export const SuccessDialog = ({
  isOpen,
  onClose,
  title = "Success!",
  description = "Your NFT has been minted successfully!",
  showCelebration = true,
}: SuccessDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] bg-white border-2 border-black rounded-2xl">
        <DialogHeader className="text-center space-y-4">
          {/* <div className="flex justify-center">
            {showCelebration && (
              <div className="relative">
                <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
                <div className="absolute -inset-1 bg-green-500 rounded-full animate-ping opacity-25"></div>
              </div>
            )}
          </div> */}
          <DialogTitle className="font-hartone text-2xl font-normal text-black text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="font-sintony text-base text-gray-600 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#4ECDC4] hover:bg-[#3FB8B0] border border-black rounded-full font-hartone text-lg font-normal text-black transition-colors"
            style={{
              boxShadow: "0px 4px 0px 0px rgba(0, 0, 0, 1)",
              letterSpacing: "7.5%",
            }}
          >
            AWESOME!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
