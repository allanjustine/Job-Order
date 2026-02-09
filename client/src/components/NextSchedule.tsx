import { set } from "date-fns";
import Input from "./ui/input";
import Label from "./ui/label";

export default function NextSchedule({
  errors,
  nextScheduleDate,
  nextScheduleKms,
  generalRemarks,
  setNextScheduleDate,
  setNextScheduleKms,
  setGeneralRemarks,
}: any) {
  return (
    <div className="mb-6">
      <div className="mt-2">
        <Label>Your Next Service Schedule is:</Label>
        <div className="flex items-center gap-2 mt-1">
          <Input 
            placeholder="Date"
            type="date"
            className="w-80"
            value={nextScheduleDate}
            onChange={(e) => setNextScheduleDate(e.target.value)}
          />
          <p className="whitespace-nowrap">or</p>
          <Input 
            placeholder="KMs"
            type="text"
            className="w-80"
            value={nextScheduleKms}
            onChange={(e) => setNextScheduleKms(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label required>General Remarks:</Label>
        <Input 
          error={errors.generalRemarks}
          placeholder=""
          className="w-full mt-1"
          value={generalRemarks}
          onChange={(e) => setGeneralRemarks(e.target.value)}
        />
         {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>
    </div>
  );
}