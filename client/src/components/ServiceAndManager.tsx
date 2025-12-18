import Input from "./ui/input";
import Label from "./ui/label";

export default function ServiceAndManager({
  errors,
  signatures,
  setSignatures,
}: any) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <Label required> Salesrep/Service Advisor</Label>
          <Input
            type="text"
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
          <Label required>BM/BS</Label>
          <Input
            type="text"
            value={signatures.branchManager}
            onChange={(e) => setSignatures((prev: any) => ({
                ...prev,
                branchManager: e.target.value,
              }))}
          />
          {errors.branchManager && (
            <p className="text-red-500 text-xs mt-1">{errors.branchManager}</p>
          )}
        </div>
      </div>
    </>
  );
}
