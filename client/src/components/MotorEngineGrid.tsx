import Input from "./ui/input";
import Label from "./ui/label";
import Select from "./ui/select";

export default function MotorEngineGrid({
  errors,
  motorcycleUnit,
  remarks,
  engineUnit,
  engineCondition,
  contentUbox,
  setMotorcycleUnit,
  setRemarks,
  setEngineUnit,
  setEngineCondition,
  setContentUbox,
}: any) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">    
        <div className="bg-gray-50 p-4 rounded-md">
          <div>
            <Label>Motorcyle Unit</Label>
            <Select value={motorcycleUnit} onChange={(e) => setMotorcycleUnit(e.target.value)}>
              <option value="" disabled>Select Motocycle Unit</option>
              <option value="business">Business</option>
              <option value="automatic">Automatic</option>
              <option value="cub">Cub</option>
              <option value="sports">Sports</option>
            </Select>
            
            <div className="mt-2">
              <Label>Remarks</Label>
              <Input 
                error={errors.remarks}
                placeholder=""
                className="w-full"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              {errors.remarks && (
                <p className="text-red-500 text-xs mt-1">{errors.remarks}</p>
             )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div>
            <Label>Engine Unit</Label>
            <Select value={engineUnit} onChange={(e) => setEngineUnit(e.target.value)}>
              <option value="" disabled>Select Engine Unit</option>
              <option value="business_sports">Business/Sports</option>
              <option value="automatic">Automatic</option>
              <option value="cub">Cub</option>
            </Select>
            
            <div className="mt-2">
              <Label>Engine Condition</Label>
              <Input 
                error={errors.engineCondition}
                placeholder=""
                className="w-full"
                value={engineCondition}
                onChange={(e) => setEngineCondition(e.target.value)}
              />
              {errors.engineCondition && (
                <p className="text-red-500 text-xs mt-1">{errors.engineCondition}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <Label>Contents inside U-Box</Label>
        <Input 
          error={errors.contentUbox}
          placeholder=""
          className="w-full"
          value={contentUbox}
          onChange={(e) => setContentUbox(e.target.value)}
        />
        {errors.contentUbox && (
          <p className="text-red-500 text-xs mt-1">{errors.contentUbox}</p>
        )}
      </div>
    </div>
  );
}