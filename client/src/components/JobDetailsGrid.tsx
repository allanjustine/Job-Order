import Input from "./ui/input";
import Label from "./ui/label";
import Select from "./ui/select";

export default function JobDetailsGrid({
  jobType,
  repairStart,
  repairEnd,
  setJobType,
  setRepairStart,
  setRepairEnd,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div>
        <Label>Type of Job</Label>
        <Select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="" disabled>Select Job Type</option>
          <option value="pms">PMS</option>
          <option value="rr">Regular Repair</option>
          <option value="wc">Warranty Claim</option>
        </Select>
      </div>
      <div>
        <Label>Repair Job Start</Label>
        <Input
          type="datetime-local"
          value={repairStart}
          onChange={(e) => setRepairStart(e.target.value)}
        />
      </div>
      <div>
        <Label>Repair Job End</Label>
        <Input
          type="datetime-local"
          value={repairEnd}
          onChange={(e) => setRepairEnd(e.target.value)}
        />
      </div>
    </div>
  );
}
