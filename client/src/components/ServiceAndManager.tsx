import Input from "./ui/input";
import { Label } from "./ui/label";

export default function ServiceAndManager({
  errors,
  signatures,
  setSignatures,
  receiptNumber,
  setReceiptNumber,
}: any) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <Label>
            {" "}
            Salesrep/Service Advisor<span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            error={errors.serviceAdvisor}
            value={signatures.serviceAdvisor}
            onChange={(e) =>
              setSignatures((prev: any) => ({
                ...prev,
                serviceAdvisor: e.target.value,
              }))
            }
          />
          {errors.serviceAdvisor && (
            <p className="text-red-500 text-xs mt-1">{errors.serviceAdvisor}</p>
          )}
        </div>
        <div>
          <Label>
            BM/BS<span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            error={errors.branchManager}
            value={signatures.branchManager}
            onChange={(e) =>
              setSignatures((prev: any) => ({
                ...prev,
                branchManager: e.target.value,
              }))
            }
          />
          {errors.branchManager && (
            <p className="text-red-500 text-xs mt-1">{errors.branchManager}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
              <Label>
                Receipt Number:
              </Label>
              <Input
                error={errors.receiptNumber}
                placeholder=""
                className="w-50 mt-1"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
              />
              {errors.receiptNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.receiptNumber}</p>
              )}
            </div>
    </>
  );
}
